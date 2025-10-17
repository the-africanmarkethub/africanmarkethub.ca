<?php

namespace App\Http\Controllers\Administration;

use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Jobs\SendSmsNotificationJob;
use Illuminate\Support\Facades\Auth;
use App\Jobs\SendEmailNotificationJob;

class NotificationController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $role = $user->role;

        if (!in_array($role, ['vendor', 'customer', 'single', 'all'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid user role.',
                'data' => [],
            ], 403);
        }

        $notifications = Notification::whereIn('receiver', ['all', $role])
            ->latest()
            ->limit(10)
            ->get();

        return response()->json([
            'status' => 'success',
            'message' => $notifications->isNotEmpty() ? 'Notifications found' : 'No notifications found',
            'data' => $notifications,
        ], 200);
    }

    public function lists(Request $request)
    {
        $limit = $request->get('limit', 20);
        $offset = $request->get('offset', 0);
        $receiver = $request->get('receiver');

        $query = Notification::query()->latest();

        if (in_array($receiver, ['customer', 'vendor', 'single', 'all'])) {
            $query->where('receiver', $receiver);
        }

        $total = $query->count();

        $notifications = $query
            ->offset($offset)
            ->limit($limit)
            ->get();

        // notification stats
        $notificationStats = [
            'total' => $total,
            'email' => $notifications->where('channel', 'email')->count(),
            'sms' => $notifications->where('channel', 'sms')->count(),
            'pending' => $notifications->where('delivery_status', 'pending')->count(),
            'delivered' => $notifications->where('delivery_status', 'delivered')->count(),
            'failed' => $notifications->where('delivery_status', 'failed')->count(),
            'vendor' => $notifications->where('receiver', 'vendor')->count(),
            'customer' => $notifications->where('receiver', 'customer')->count(),
            'single' => $notifications->where('receiver', 'single')->count(),
        ];
        return response()->json([
            'status' => 'success',
            'message' => $notifications->isEmpty() ? 'No notifications found' : 'Notifications found',
            'data' => $notifications,
            'total' => $total,
            'offset' => $offset,
            'limit' => $limit,
            'stats' => $notificationStats,
        ], 200);
    }

    public function send(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'receiver' => 'required|in:customer,vendor,all,single',
            'user_id' => 'required_if:receiver,single|exists:users,id',
            'body' => 'required|string',
            'image' => 'nullable|file|max:5025',
            'cta' => 'nullable|url',
            'channel' => 'nullable|in:email,sms',
        ], [
            'image.max' => 'The image file size should not exceed 5MB.',
        ]);

        // Custom validation after default rules
        $validator = validator($request->all());

        $validator->after(function ($validator) use ($request) {
            $channel = $request->input('channel');
            $bodyLength = strlen($request->input('body', ''));

            if ($channel === 'sms' && $bodyLength > 165) {
                $validator->errors()->add('body', 'The body can not be greater than 165 characters for SMS.');
            } elseif ($channel !== 'sms' && $bodyLength > 1000) {
                $validator->errors()->add('body', 'The body can not be greater than 1000 characters.');
            }
        });

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Create the notification
            $notification = Notification::withoutEvents(function () use ($validated) {
                return Notification::create([
                    'receiver' => $validated['receiver'],
                    'body' => $validated['body'],
                    'cta' => $validated['cta'] ?? '',
                    'channel' => $validated['channel'] ?? 'email',
                    'user_id' => $validated['receiver'] === 'single' ? $validated['user_id'] : null,
                    'delivery_status' => 'pending',
                    'delivered_to' => 0,
                    'image' => null,
                    'image_public_id' => null,
                ]);
            });

            // Log the notification creation
            // Log::info('Notification created successfully', ['notification_id' => $notification->id]);

            // Handle image upload if there is an image
            if ($request->hasFile('image')) {
                defer(function () use ($request, $notification) {
                    $uploadedFile = $request->file('image')->getRealPath();
                    $uploadResult = cloudinary()->upload($uploadedFile, [
                        'folder' => 'notificaionImage',
                        'transformation' => [
                            'width' => 1000,
                            'height' => 1000,
                            'crop' => 'fill',
                        ],
                    ]);
                    // Update the notification with the image details
                    $notification->update([
                        'image' => $uploadResult->getSecurePath(),
                        'image_public_id' => $uploadResult->getPublicId(),
                    ]);
                });
            }
            // Single user case
            $receiver = $validated['receiver'];
            $channel = $validated['channel'] ?? null;

            if ($receiver === 'single') {
                $user = User::find($validated['user_id']);

                if (!$user) {
                    return response()->json(['status' => 'error', 'message' => 'User not found.'], 404);
                }

                if ($channel === 'email') {
                    dispatch(new SendEmailNotificationJob($notification, [$user->email]));
                } elseif ($channel === 'sms') {
                    dispatch(new SendSmsNotificationJob($notification, [$user->phone]));
                }
            } else {
                // Bulk cases
                if ($channel === 'email') {
                    dispatch(new SendEmailNotificationJob($notification));
                } elseif ($channel === 'sms') {
                    dispatch(new SendSmsNotificationJob($notification));
                }
            }

            return response()->json(['status' => 'success', 'message' => 'Notification sent successfully.', 'data' => $notification], 201);
        } catch (\Throwable $exception) {
            Log::error('Notification send failed: ' . $exception->getMessage(), ['exception' => $exception]);
            return response()->json(['status' => 'error', 'message' => 'Notification not sent successfully.', 'error_detail' => $exception->getMessage()], 500);
        }
    }

    public function delete(Request $request)
    {
        $validated = $request->validate([
            'notification_id' => 'required|exists:notifications,id',
        ]);

        try {
            $notification = Notification::find($validated['notification_id']);

            if (!$notification) {
                return response()->json(['status' => 'error', 'message' => 'Notification not found.'], 404);
            }

            if (!empty($notification->image_public_id)) {
                cloudinary()->destroy($notification->image_public_id);
            }

            $notification->delete();

            return response()->json(['status' => 'success', 'message' => 'Notification deleted successfully.'], 200);
        } catch (\Throwable $exception) {
            Log::error('Notification delete failed: ' . $exception->getMessage(), ['exception' => $exception]);
            return response()->json([
                'status' => 'error',
                'message' => 'Notification not deleted successfully.',
                'error_detail' => $exception->getMessage()
            ], 500);
        }
    }
}
