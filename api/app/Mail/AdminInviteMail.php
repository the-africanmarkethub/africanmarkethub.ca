<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminInviteMail extends Mailable
{
    use Queueable, SerializesModels;

    public $admin;
    public $invitee;
    public $plainPassword;
    public function __construct($admin, $invitee, $plainPassword)
    {
        $this->invitee = $invitee;
        $this->admin = $admin;
        $this->plainPassword = $plainPassword;
    }
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'You are invited to African Hub Marketplace as ' . $this->admin->role . ' by ' . $this->invitee,
            tags: ['admin-invite', 'african-hub-marketplace'],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'mail.admin-invite-mail',
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
