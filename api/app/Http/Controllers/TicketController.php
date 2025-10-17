<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Support\Str;
use Jenssegers\Agent\Agent;
use Illuminate\Http\Request;
use App\Services\ActivityLogger;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    public function createOrUpdate(ActivityLogger $activityLogger)
    {
        try {
            $validated = request()->validate([
                'ticket_id' => 'nullable|string|exists:tickets,ticket_id',
                'title' => 'nullable|string|max:255',
                'subject' => 'nullable|string|max:255',
                'description' => 'required|string|max:1000',
                'file' => 'nullable|file|max:2056',
                'priority_level' => 'nullable|string|in:low,medium,high',
                'response_status' => 'nullable|string|in:open,close,ongoing',
                'agent_id' => 'required|integer|exists:users,id',
                'reporter_id' => 'required|integer|exists:users,id',
            ]);

            $reporter_id = Auth::id();
            $ticketID = $validated['ticket_id'] ?? Str::uuid();

            // Find existing ticket
            $ticket = Ticket::where('ticket_id', $ticketID)->first();


            // Convert existing description to an array
            $newDescription = [];
            if ($ticket && !empty($ticket->description)) {
                $existingDescription = json_decode($ticket->description, true);
                if (is_array($existingDescription)) {
                    $newDescription = $existingDescription;
                }
            }

            // Determine sender role
            $sender = $ticket ? 'agent' : 'reporter';
            if ($ticket && $ticket->agent_id && count($newDescription) % 2 === 1) {
                $sender = 'agent';
            } else {
                $sender = 'reporter';
            }

            // Append new structured message
            $incomingMessage = json_decode($validated['description'], true);

            if (is_array($incomingMessage) && isset($incomingMessage[0])) {
                $newDescription[] = $incomingMessage[0];
            } else {
                $newDescription[] = [
                    'sender' => $sender,
                    'message' => $validated['description'],
                    'timestamp' => now()->toISOString(),
                ];
            }


            // Handle file upload using Cloudinary
            $imageUrl = $ticket->file ?? null;
            $image_publicId = $ticket->file_public_id ?? null;

            if (request()->hasFile('file')) {
                $uploadedFile = request()->file('file')->getRealPath();
                $uploadResult = cloudinary()->upload($uploadedFile, [
                    'folder' => 'TicketFiles',
                    'transformation' => [
                        'width' => 300,
                        'height' => 300,
                        'crop' => 'fill',
                    ],
                ]);
                $imageUrl = $uploadResult->getSecurePath();
                $image_publicId = $uploadResult->getPublicId();
            }

            // Create or update ticket
            Ticket::updateOrCreate(
                ['ticket_id' => $ticketID],
                [
                    'title' => $validated['title'] ?? $ticket->title ?? null,
                    'subject' => $validated['subject'] ?? $ticket->subject ?? null,
                    'description' => json_encode($newDescription, JSON_FORCE_OBJECT),
                    'file' => $imageUrl ?? $ticket->file ?? null,
                    'file_public_id' => $image_publicId ?? $ticket->file_public_id ?? null,
                    'priority_level' => $validated['priority_level'] ?? $ticket->priority_level ?? 'low',
                    'response_status' => $validated['response_status'] ?? 'open',
                    'agent_id' => $validated['agent_id'] ?? null,
                    'reporter_id' => $reporter_id,
                ]
            );

            $agent = new Agent();
            $device = $agent->device();
            $platform = $agent->platform();
            $browser = $agent->browser();

            $deviceInfo = "$device on $platform using $browser";
            $activityLogger->log('Ticket updated successfully', Auth::user(), $deviceInfo);

            return response()->json(['message' => 'Ticket updated successfully.', 'status' => 'success'], 200);
        } catch (\Throwable $th) {
            Log::error('Ticket update failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json([
                'message' => 'Something went wrong. Try again later.',
                'status' => 'error',
                'error_detail' => $th->getMessage()
            ], 500);
        }
    }
    public function replyTicket(ActivityLogger $activityLogger)
    {
        try {
            $validated = request()->validate([
                'ticket_id' => 'nullable|string|exists:tickets,ticket_id',
                'title' => 'nullable|string|max:255',
                'subject' => 'nullable|string|max:255',
                'description' => 'required|string|max:1000',
                'file' => 'nullable|file|max:2056',
                'priority_level' => 'nullable|string|in:low,medium,high',
                'response_status' => 'nullable|string|in:open,close,ongoing',
                'agent_id' => 'nullable|integer|exists:users,id',
            ]);

            $ticketID = $validated['ticket_id'] ?? Str::uuid();

            $ticket = Ticket::where('ticket_id', $ticketID)->first();

            $newDescription = [];
            if ($ticket && !empty($ticket->description)) {
                $existingDescription = json_decode($ticket->description, true);
                if (is_array($existingDescription)) {
                    $newDescription = $existingDescription;
                }
            }

            $sender = $ticket ? 'agent' : 'reporter';
            if ($ticket && $ticket->agent_id && count($newDescription) % 2 === 1) {
                $sender = 'agent';
            } else {
                $sender = 'reporter';
            }

            // Append new structured message
            $incomingMessage = json_decode($validated['description'], true);

            if (is_array($incomingMessage) && isset($incomingMessage[0])) {
                $newDescription[] = $incomingMessage[0];
            } else {
                $newDescription[] = [
                    'sender' => $sender,
                    'message' => $validated['description'],
                    'timestamp' => now()->toISOString(),
                ];
            }


            // Handle file upload using Cloudinary
            $imageUrl = $ticket->file ?? null;
            $image_publicId = $ticket->file_public_id ?? null;

            if (request()->hasFile('file')) {
                $uploadedFile = request()->file('file')->getRealPath();
                $uploadResult = cloudinary()->upload($uploadedFile, [
                    'folder' => 'TicketFiles',
                    'transformation' => [
                        'width' => 300,
                        'height' => 300,
                        'crop' => 'fill',
                    ],
                ]);
                $imageUrl = $uploadResult->getSecurePath();
                $image_publicId = $uploadResult->getPublicId();
            }

            // Create or update ticket
            Ticket::updateOrCreate(
                ['ticket_id' => $ticketID],
                [
                    'title' => $validated['title'] ?? $ticket->title ?? null,
                    'subject' => $validated['subject'] ?? $ticket->subject ?? null,
                    'description' => json_encode($newDescription, JSON_FORCE_OBJECT),
                    'file' => $imageUrl ?? $ticket->file ?? null,
                    'file_public_id' => $image_publicId ?? $ticket->file_public_id ?? null,
                    'priority_level' => $validated['priority_level'] ?? $ticket->priority_level ?? 'low',
                    'response_status' => $validated['response_status'] ?? 'open',
                    'agent_id' => $validated['agent_id'] ?? null,
                    'reporter_id' => $reporter_id ?? 4,
                ]
            );

            $agent = new Agent();
            $device = $agent->device();
            $platform = $agent->platform();
            $browser = $agent->browser();

            $deviceInfo = "$device on $platform using $browser";
            $activityLogger->log('Ticket updated successfully', Auth::user(), $deviceInfo);

            return response()->json(['message' => 'Ticket updated successfully.', 'status' => 'success'], 200);
        } catch (\Throwable $th) {
            Log::error('Ticket update failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json([
                'message' => 'Something went wrong. Try again later.',
                'status' => 'error',
                'error_detail' => $th->getMessage()
            ], 500);
        }
    }


    public function reporterTickets()
    {
        try {
            $reporter_id = Auth::id();
            $tickets = Ticket::where('reporter_id', $reporter_id)->paginate(10);
            if ($tickets) {
                return response()->json(['message' => 'Tickets found.', 'status' => 'success', 'data' => $tickets], 200);
            } else {
                return response()->json(['message' => 'Ticket not found.', 'status' => 'error'], 404);
            }
        } catch (\Throwable $th) {
            Log::error('Ticket failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'Something went wrong. Try again later', 'status' => 'error', 'error_detail' => $th->getMessage()], 500);
        }
    }
    public function getTicket(Request $request)
    {
        try {
            $status = $request->query('status');

            $tickets = Ticket::with('reporter')
                ->when($status, fn($q) => $q->where('response_status', $status))
                ->paginate(10);

            if ($tickets->isNotEmpty()) {
                return response()->json([
                    'message' => 'Tickets found.',
                    'status' => 'success',
                    'data' => $tickets
                ], 200);
            } else {
                return response()->json([
                    'message' => 'No tickets found.',
                    'status' => 'error'
                ], 404);
            }
        } catch (\Throwable $th) {
            Log::error('Ticket fetch failed: ' . $th->getMessage(), ['exception' => $th]);

            return response()->json([
                'message' => 'Something went wrong. Try again later.',
                'status' => 'error',
                'error_detail' => $th->getMessage()
            ], 500);
        }
    }
    // get all tickets by agent
    public function vendorTickets()
    {
        try {
            $agent_id = Auth::id();
            $tickets = Ticket::where('agent_id', $agent_id)->paginate(10);
            if ($tickets) {
                return response()->json(['message' => 'Tickets found.', 'status' => 'success', 'data' => $tickets], 200);
            } else {
                return response()->json(['message' => 'Ticket not found.', 'status' => 'error'], 404);
            }
        } catch (\Throwable $th) {
            Log::error('Ticket failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'Something went wrong. Try again later', 'status' => 'error', 'error_detail' => $th->getMessage()], 500);
        }
    }
    public function deleteTicket($ticketId, ActivityLogger $activityLogger)
    {
        try {
            $ticket = Ticket::where('ticket_id', $ticketId)->first();
            $agent = new Agent();
            $device = $agent->device();
            $platform = $agent->platform();
            $browser = $agent->browser();

            $deviceInfo = "$device on $platform using $browser";
            $activityLogger->log('Ticket deleted successfully', Auth::user(), $deviceInfo);

            if ($ticket) {
                $ticket->delete();
                return response()->json(['message' => 'Ticket deleted successfully.', 'status' => 'success'], 200);
            } else {
                return response()->json(['message' => 'Ticket not found.', 'status' => 'error'], 404);
            }
        } catch (\Throwable $th) {
            Log::error('Ticket delete failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'Something went wrong. Try again later', 'status' => 'error', 'error_detail' => $th->getMessage()], 500);
        }
    }
    public function updateTicketStatus(Request $request, $ticketId, ActivityLogger $activityLogger)
    {
        try {
            $validated = $request->validate([
                'response_status' => 'required|string|in:open,close,ongoing',
            ]);

            $ticket = Ticket::where('ticket_id', $ticketId)->first();
            if ($ticket) {
                $ticket->update(['response_status' => $validated['response_status']]);
                $agent = new Agent();
                $device = $agent->device();
                $platform = $agent->platform();
                $browser = $agent->browser();

                $deviceInfo = "$device on $platform using $browser";
                $activityLogger->log('Ticket status updated successfully', Auth::user(), $deviceInfo);
                return response()->json(['message' => 'Ticket status updated successfully.', 'status' => 'success'], 200);
            } else {
                return response()->json(['message' => 'Ticket not found.', 'status' => 'error'], 404);
            }
        } catch (\Throwable $th) {
            Log::error('Ticket status update failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'Something went wrong. Try again later', 'status' => 'error', 'error_detail' => $th->getMessage()], 500);
        }
    }
    public function updateTicketPriority(Request $request, $ticketId, ActivityLogger $activityLogger)
    {
        try {
            $validated = $request->validate([
                'priority_level' => 'required|string|in:low,medium,high',
            ]);

            $ticket = Ticket::where('ticket_id', $ticketId)->first();
            if ($ticket) {
                $ticket->update(['priority_level' => $validated['priority_level']]);
                $agent = new Agent();
                $device = $agent->device();
                $platform = $agent->platform();
                $browser = $agent->browser();

                $deviceInfo = "$device on $platform using $browser";
                $activityLogger->log('Ticket priority updated successfully', Auth::user(), $deviceInfo);
                return response()->json(['message' => 'Ticket priority updated successfully.', 'status' => 'success'], 200);
            } else {
                return response()->json(['message' => 'Ticket not found.', 'status' => 'error'], 404);
            }
        } catch (\Throwable $th) {
            Log::error('Ticket priority update failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'Something went wrong. Try again later', 'status' => 'error', 'error_detail' => $th->getMessage()], 500);
        }
    }
    public function getTicketDetail($ticketId)
    {
        try {
            $ticket = Ticket::with('reporter', 'agent')->where('ticket_id', $ticketId)->first();
            if ($ticket) {
                return response()->json(['message' => 'Ticket found.', 'status' => 'success', 'data' => $ticket], 200);
            } else {
                return response()->json(['message' => 'Ticket not found.', 'status' => 'error'], 404);
            }
        } catch (\Throwable $th) {
            Log::error('Ticket retrieval failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'Something went wrong. Try again later', 'status' => 'error', 'error_detail' => $th->getMessage()], 500);
        }
    }

    public function getAllTickets(Request $request)
    {
        try {
            $limit = $request->get('limit', 20);
            $offset = $request->get('offset', 0);
            $status = $request->query('status');
            $priority = $request->query('priority');
            $search = $request->query('search');

            $query = Ticket::with(['reporter', 'agent']);

            if ($status) {
                $query->where('response_status', $status);
            }

            if ($priority) {
                $query->where('priority_level', $priority);
            }

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('subject', 'like', "%$search%")
                        ->orWhere('message', 'like', "%$search%");
                });
            }

            $total = $query->count();

            $tickets = $query->latest()
                ->skip($offset)
                ->take($limit)
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $tickets,
                'total' => $total,
                'limit' => $limit,
                'offset' => $offset,
            ]);
        } catch (\Throwable $th) {
            Log::error('Ticket retrieval failed: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong. Try again later',
                'error_detail' => $th->getMessage()
            ], 500);
        }
    }
}
