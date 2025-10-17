<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WithdrawalStatusUpdated extends Mailable
{
    use Queueable, SerializesModels;
    public $user;
    public $withdrawal;

    public function __construct($user, $withdrawal)
    {
        $this->user = $user;
        $this->withdrawal = $withdrawal;
    } 
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Withdrawal Status Updated',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'mail.withdrawal-status-updated',
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
