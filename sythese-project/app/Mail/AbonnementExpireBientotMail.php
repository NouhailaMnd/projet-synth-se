<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AbonnementExpireBientotMail extends Mailable
{
    use Queueable, SerializesModels;


    public $abonnement;
    public $prestataire;

    /**
     * Create a new message instance.
     */
    public function __construct($abonnement, $prestataire)
    {
        $this->abonnement = $abonnement;
        $this->prestataire = $prestataire;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Abonnement Expire Bientot Mail',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.abonnement.expire',
            with: [
            'abonnement' => $this->abonnement,
            'prestataire' => $this->prestataire,
        ],
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
