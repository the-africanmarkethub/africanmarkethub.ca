<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\Notification;
use App\Services\SmsService;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\{InteractsWithQueue, SerializesModels};

class SendSmsNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public Notification $notification;
    public array $customRecipients;

    public function __construct(Notification $notification, array $emails = [])
    {
        $this->notification = $notification;
        $this->customRecipients = $emails;
    }

    public function handle(SmsService $sms): void
    {
        $recipients = $this->customRecipients ?: $this->resolveRecipients($this->notification->receiver);
        $successfulCount = 0;

        try {
            foreach ($recipients as $phone) {
                $status = $sms->send($phone, $this->notification->body);
                if ($status === 'success') {
                    $successfulCount++;
                }
            }

            $this->notification->update([
                'delivery_status' => $status,
                'delivered_to' => $successfulCount,
            ]);
            logger()->info('SMS notification sent successfully', [
                'notification_id' => $this->notification->id,
                'recipients_count' => count($recipients),
                'successful_count' => $successfulCount,
            ]);
        } catch (\Throwable $e) {
            logger()->error('SMS delivery failed', ['error' => $e->getMessage()]);

            $this->notification->update([
                'delivery_status' => 'failed',
                'delivered_to' => 0,
            ]);
        }
    }

    protected function resolveRecipients($receiver): array
    {
        return match ($receiver) {
            'customer' => User::where('type', 'customer')->pluck('phone')->toArray(),
            'vendor' => User::where('type', 'vendor')->pluck('phone')->toArray(),
            'all' => User::pluck('phone')->toArray(),
            default => [],
        };
    }
}
