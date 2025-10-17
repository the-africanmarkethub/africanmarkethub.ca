<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public $otp;
    public $user;

    public function __construct($otp, $user)
    {
        $this->otp = $otp;
        $this->user = $user;
    }


    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Email Confirmation from ' . env('APP_NAME'),
        );
    }
 
    public function content(): Content
    {
        return new Content(
            markdown: 'mail.otp-mail',
        );
    }
 
    public function attachments(): array
    {
        return [];
    }
}
