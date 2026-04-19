<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewUserWelcome extends Notification
{
    use Queueable;

    protected $password;

    /**
     * Create a new notification instance.
     */
    public function __construct($password = null)
    {
        $this->password = $password;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject('Bienvenue sur CoopManager UIDT')
            ->greeting('Bonjour ' . $notifiable->name . ',')
            ->line('Votre compte a été créé avec succès sur CoopManager, la plateforme de gestion des conventions de l\'Université Iba Der Thiam.')
            ->line('Voici vos informations de connexion :')
            ->line('Email : ' . $notifiable->email);

        if ($this->password) {
            $message->line('Mot de passe : ' . $this->password);
        }

        return $message
            ->action('Accéder à la plateforme', config('app.frontend_url') . '/login')
            ->line('Pour des raisons de sécurité, nous vous recommandons de changer votre mot de passe dès votre première connexion.')
            ->line('Merci d\'utiliser notre application !');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
