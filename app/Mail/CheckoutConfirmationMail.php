<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Contracts\Queue\ShouldQueue;

class CheckoutConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public Order $order;
    public string $recipientType; // 'customer' or 'vendor'

    public function __construct(Order $order, string $recipientType)
    {
        $this->order = $order;
        $this->recipientType = $recipientType;
    }

    /**
     * Get the message envelope.
     */
  public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->recipientType === 'vendor'
                ? 'New Order from Customer'
                : 'Your Order Confirmation'
        );
    }

    /**
     * Get the message content definition.
     */
 

     public function content(): Content
    {
        return new Content(
            markdown: 'mail.checkout-confirmation-mail',
            with: [
                'order' => $this->order,
                'recipientType' => $this->recipientType,
            ]
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
