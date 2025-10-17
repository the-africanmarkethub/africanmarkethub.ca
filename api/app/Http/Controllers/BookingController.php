<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Booking;
use Illuminate\Support\Str;
use Jenssegers\Agent\Agent;
use Illuminate\Http\Request;
use App\Services\ActivityLogger;
use App\Services\Clik2PayService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class BookingController extends Controller
{
    /**
     * List all bookings for the authenticated user
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        $query = Booking::with(['service', 'vendor', 'customer', 'address'])
            ->latest();

        if ($user->role === 'customer') {
            $query->where('customer_id', $user->id);
        } elseif ($user->role === 'vendor') {
            $query->where('vendor_id', $user->id);
        }

        $perPage = (int) $request->query('per_page', 15);

        $bookings = $query->paginate($perPage);

        return response()->json($bookings, 200);
    }


    /**
     * Create a new booking
     */
    public function store(Request $request, ActivityLogger $activityLogger)
    {
        try {
            $validated = $request->validate([
                'service_id'       => 'required|exists:products,id',
                'vendor_id'        => 'required|exists:users,id',
                'address_id'       => 'nullable|exists:address_books,id',
                'scheduled_at'     => 'nullable|date|after_or_equal:now',
                'delivery_method'  => 'required|string|in:' . implode(',', Booking::DELIVERY_METHODS),
                'total'            => 'required|numeric|min:0',
            ]);

            $booking = Booking::create([
                'customer_id'                     => Auth::id(),
                'vendor_id'                       => $validated['vendor_id'],
                'service_id'                      => $validated['service_id'],
                'address_id'                      => $validated['address_id'] ?? null,
                'scheduled_at'                    => $validated['scheduled_at'] ?? null,
                'delivery_method'                 => $validated['delivery_method'],
                'delivery_status'                 => 'processing',
                'payment_status'                  => 'pending',
                'vendor_payment_settlement_status' => 'unpaid',
                'total'                           => $validated['total'],
            ]);

            // Device info
            try {
                $agent = new Agent();
                $deviceInfo = $agent->device() . ' on ' . $agent->platform() . ' using ' . $agent->browser();
            } catch (\Throwable $th) {
                $deviceInfo = 'Unknown Device';
            }

            $activityLogger->log('Customer created booking successfully', Auth::user(), $deviceInfo);

            $this->createTicket($booking->service, $booking);

            // Generate payment link safely
            $payment_link = null;
            try {
                $payment_link = $this->paymentLink($booking, app(\App\Services\Clik2PayService::class));
            } catch (\Throwable $th) {
                Log::error("Payment link generation failed for booking {$booking->id}: " . $th->getMessage());
            }

            return response()->json([
                'message'      => 'Booking created successfully',
                'booking'      => $booking->load(['service', 'vendor']),
                'payment_link' => $payment_link,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Throwable $th) {
            Log::error('Booking creation error: ' . $th->getMessage(), ['exception' => $th]);
            return response()->json(['message' => 'Server error. Please try again later.'], 500);
        }
    }

    private function createTicket($service, $booking)
    {
        if (!$service) {
            return;
        }
        $ticketID = Str::uuid();
        Ticket::updateOrCreate(['ticket_id' => $ticketID], ['title' => $service->title, 'subject' => $service->description, 'description' => $service->description, 'file' => $service->images[0] ?? null, 'file_public_id' => $service->image_public_ids[0] ?? null, 'priority_level' => 'low', 'response_status' => 'open', 'agent_id' => $booking->vendor_id, 'reporter_id' => $booking->customer_id,]);
    }

    private function paymentLink($booking, Clik2PayService $clik2PayService)
    {
        $customer = $booking->customer;

        $payload = [
            "merchantTransactionId" => "BOK-{$booking->id}-" . uniqid(),
            "amount"                => (float) $booking->total,
            "type"                  => "ECOMM",
            "dueDate"               => now()->addDays(3)->toDateString(),
            "currency"              => "CAD",
            "description"           => "Payment for Order #{$booking->id}",
            "displayMessage"        => "Complete your payment for Order {$booking->id}",
            "invoiceNumber"         => "INV-{$booking->id}",
            "businessUnit"          => "OnlineStore",
            "callbackUrl"           => route('clik2pay.callback'),
            "successUrl"            => route('checkout.success', $booking->id),
            "cancelUrl"             => route('checkout.cancel', $booking->id),

            "payer" => [
                "name"         => trim("{$customer->first_name} {$customer->last_name}"),
                "email"        => $customer->email,
                "mobileNumber" => $customer->phone ?? null,
            ],

            "merchant" => [
                "name"  => config('app.name'),
                "email" => config('mail.from.address'),
            ],
        ];

        return $clik2PayService->createPaymentRequest($payload);
    }


    /**
     * Show a single booking
     */
    public function show(Booking $booking)
    {
        $this->authorizeAccess($booking);

        return response()->json($booking->load(['service', 'vendor', 'customer', 'address']));
    }

    /**
     * Update booking (reschedule, change address, etc.)
     */
    public function update(Request $request, Booking $booking)
    {
        $this->authorizeAccess($booking);

        $validated = $request->validate([
            'scheduled_at' => 'nullable|date|after_or_equal:now',
            'delivery_method' => 'nullable|string|in:' . implode(',', Booking::DELIVERY_METHODS),
            'cancel_reason' => 'nullable|string|max:255',
        ]);

        $booking->update($validated);

        return response()->json([
            'message' => 'Booking updated successfully',
            'booking' => $booking->fresh(),
        ]);
    }

    /**
     * Cancel a booking
     */
    public function cancelBooking(Request $request, $id)
    {
        try {
            $booking = Booking::findOrFail($id);

            $this->authorizeAccess($booking);

            $validated = $request->validate([
                'cancel_reason' => 'sometimes|string|max:255',
            ]);

            $booking->update([
                'delivery_status' => 'cancelled',
                'cancel_reason'   => $validated['cancel_reason'] ?? 'Others',
                'cancelled_by'    => Auth::id(),
            ]);

            return response()->json([
                'message' => 'Booking cancelled successfully',
                'booking' => $booking->fresh(),
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Booking not found',
            ], 404);
        } catch (\Throwable $th) {
            Log::error('Booking cancellation failed: ' . $th->getMessage(), ['exception' => $th]);

            return response()->json([
                'status'  => 'error',
                'message' => 'Something went wrong, please try again later.',
            ], 500);
        }
    }

    /**
     * Vendor can mark booking as started/completed
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            // Find booking first
            $booking = Booking::findOrFail($id);

            // Authorize vendor (assuming you have a policy or custom method)
            $this->authorizeVendor($booking);

            // Validate input
            $validated = $request->validate([
                'status' => 'required|string|in:' . implode(',', Booking::DELIVERY_STATUSES),
            ]);

            // Update booking safely
            $booking->update([
                'delivery_status' => $validated['status'],
                'started_at'      => $validated['status'] === 'ongoing' ? now() : $booking->started_at,
                'completed_at'    => $validated['status'] === 'delivered' ? now() : $booking->completed_at,
            ]);

            return response()->json([
                'message' => 'Booking status updated successfully.',
                'booking' => $booking->fresh(), // return updated instance
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Booking not found',
            ], 404);
        } catch (\Throwable $th) {
            Log::error('Booking status update failed: ' . $th->getMessage(), ['exception' => $th]);

            return response()->json([
                'status'  => 'error',
                'message' => 'Something went wrong, please try again later.',
            ], 500);
        }
    }


    /**
     * Protect customer/vendor access to bookings
     */
    protected function authorizeAccess(Booking $booking)
    {
        if ($booking->customer_id !== Auth::id() && $booking->vendor_id !== Auth::id()) {
            abort(403, 'Unauthorized access to booking');
        }
    }

    protected function authorizeVendor(Booking $booking)
    {
        if ($booking->vendor_id !== Auth::id()) {
            abort(403, 'Only the vendor can perform this action');
        }
    }
}
