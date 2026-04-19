<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Convention;

class ConventionStatusChanged extends Notification
{
    use Queueable;

    protected $convention;
    protected $status;
    protected $actor;

    public function __construct(Convention $convention, $status, $actor)
    {
        $this->convention = $convention;
        $this->status = $status;
        $this->actor = $actor;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject('Mise à jour Dossier Coopération : ' . $this->convention->name)
            ->greeting('Bonjour ' . $notifiable->name . ',')
            ->line('Le statut du dossier de coopération "' . $this->convention->name . '" a évolué.');

        switch ($this->status) {
            case 'en attente':
            case 'soumis':
                $message->line('Un nouveau dossier a été soumis par ' . $this->actor->name . ' et est en attente de votre instruction.');
                break;
            case 'valide_dir_initial':
                $message->line('Le Directeur de la Coopération a validé la première étape. Le dossier est maintenant en attente de votre avis juridique.');
                break;
            case 'valide_juridique':
                $message->line('Le Service Juridique a certifié la conformité. Le dossier est retourné à la Direction pour contrôle final.');
                break;
            case 'pret_pour_signature':
            case 'en cours':
                $message->line('Le dossier a été validé par la Direction de la Coopération et est prêt pour signature Rectorale.');
                break;
            case 'termine':
                $message->line('Félicitations, le protocole a été officiellement signé par le Recteur.');
                break;
            case 'brouillon':
                $message->line('Le dossier a été renvoyé pour correction avec le motif suivant :')
                        ->line('"' . $this->convention->rejection_reason . '"');
                break;
        }

        return $message
            ->action('Voir le dossier', config('app.frontend_url') . '/conventions/' . $this->convention->id)
            ->line('Merci d\'utiliser CoopManager UIDT.');
    }

    public function toArray($notifiable): array
    {
        return [
            'convention_id' => $this->convention->id,
            'convention_name' => $this->convention->name,
            'status' => $this->status,
            'actor_name' => $this->actor->name,
            'message' => $this->getNotificationMessage(),
        ];
    }

    protected function getNotificationMessage()
    {
        switch ($this->status) {
            case 'soumis':
            case 'en attente': return 'Un nouveau dossier est en attente de votre instruction.';
            case 'valide_dir_initial': return 'Dossier en attente de visa juridique.';
            case 'valide_juridique': return 'Visa juridique accordé, retour à la Direction.';
            case 'pret_pour_signature':
            case 'en cours': return 'Dossier validé par la Direction, en attente de signature.';
            case 'termine': return 'Le dossier a été signé par le Recteur.';
            case 'brouillon': return 'Le dossier a été rejeté pour correction.';
            default: return 'Le statut du dossier a été mis à jour.';
        }
    }
}
