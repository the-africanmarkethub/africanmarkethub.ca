<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\Notification;
use Illuminate\Support\Facades\Mail;
use App\Mail\GenericNotificationMail;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\{InteractsWithQueue, SerializesModels};

class SendEmailNotificationJob implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    public Notification $notification;
    public array $customRecipients;

    public function __construct(Notification $notification, array $emails = [])
    {
        $this->notification = $notification;
        $this->customRecipients = $emails;
    }

    public function handle(): void
    {
        $recipients = $this->customRecipients ?: $this->resolveRecipients($this->notification->receiver);

        try {
            foreach ($recipients as $email) {
                Mail::to($email)->send(new GenericNotificationMail($this->notification));
            }

            $this->notification->update([
                'delivery_status' => 'delivered',
                'delivered_to' => $this->buildDeliverToSummary($recipients),
            ]);
            logger()->info('Email notification sent successfully', [
                'notification_id' => $this->notification->id,
                'recipients_count' => count($recipients),
            ]);
        } catch (\Throwable $e) {
            logger()->error('Email delivery failed', ['error' => $e->getMessage()]);
            $this->notification->update(['delivery_status' => 'failed']);
        }
    }

    protected function resolveRecipients($receiver): array
    {
        return match ($receiver) {
            'customer' => User::where('type', 'customer')->pluck('email')->toArray(),
            'vendor' => User::where('type', 'vendor')->pluck('email')->toArray(),
            'all' => User::pluck('email')->toArray(),
            default => [],
        };
    }

    protected function buildDeliverToSummary(array $recipients): string
    {
        $count = count($recipients);

        if (!empty($this->customRecipients)) {
            return $count;
        }

        return $count;
    }
}
