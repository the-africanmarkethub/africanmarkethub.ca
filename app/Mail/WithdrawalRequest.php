<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WithdrawalRequest extends Mailable
{
    use Queueable, SerializesModels;

    public $recipientType; // 'vendor' or 'admin'
    public $vendor;
    public $amount;

    public function __construct($recipientType, $vendor, $amount)
    {
        $this->recipientType = $recipientType;
        $this->vendor = $vendor;
        $this->amount = number_format($amount, 2);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->recipientType === 'admin'
                ? 'New Vendor Withdrawal Request'
                : 'Withdrawal Request Received'
        );
    }
    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'mail.withdrawal-request',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
