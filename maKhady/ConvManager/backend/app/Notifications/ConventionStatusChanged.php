<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Convention;

class ConventionStatusChanged extends Notification implements ShouldQueue
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
        return ['database', 'mail'];
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
            'message' => $this->getNotificationMessage($notifiable),
        ];
    }

    protected function getNotificationMessage($notifiable)
    {
        $role = $notifiable->role->name ?? '';
        $projectName = $this->convention->name;

        switch ($this->status) {
            case 'soumis':
            case 'en attente':
                if ($role === 'chef_division') return "Nouveau dossier \"$projectName\" soumis. Action requise de votre part.";
                if ($role === 'admin') return "Le dossier \"$projectName\" a été soumis par " . $this->actor->name;
                return "Dossier \"$projectName\" en attente d'instruction.";

            case 'valide_chef_division':
                if ($role === 'directeur_cooperation') return "Avis favorable du Chef de Division pour \"$projectName\". Dossier prêt pour validation.";
                if ($role === 'porteur_projet') return "Votre dossier \"$projectName\" a été pré-validé par le Chef de Division.";
                if ($role === 'admin') return "Pré-validation effectuée par le Chef pour \"$projectName\".";
                return "Dossier \"$projectName\" pré-validé.";

            case 'valide_dir_initial':
                if ($role === 'service_juridique') return "Dossier \"$projectName\" transmis pour votre visa juridique.";
                if ($role === 'admin') return "Examen juridique en cours pour le dossier \"$projectName\".";
                return "Dossier \"$projectName\" en attente de visa juridique.";

            case 'valide_juridique':
                if ($role === 'directeur_cooperation') return "Visa juridique accordé pour \"$projectName\". Vous pouvez finaliser le dossier.";
                if ($role === 'admin') return "Conformité juridique validée pour le dossier \"$projectName\".";
                return "Visa juridique accordé pour \"$projectName\".";

            case 'attente_sg':
                if ($role === 'secretaire_general') return "Dossier \"$projectName\" transmis pour votre visa (SG).";
                return "Dossier \"$projectName\" transmis au Secrétariat Général.";

            case 'pret_pour_signature':
            case 'en cours':
                if ($role === 'recteur') return "Dossier \"$projectName\" prêt pour votre signature officielle.";
                if ($role === 'admin') return "Signature Rectorale attendue pour le dossier \"$projectName\".";
                return "Dossier \"$projectName\" prêt pour signature.";

            case 'termine':
                return "Le protocole \"$projectName\" a été officiellement signé par le Recteur.";

            case 'brouillon':
                if ($role === 'porteur_projet') return "Votre dossier \"$projectName\" a été rejeté pour correction.";
                return "Dossier \"$projectName\" rejeté pour correction par " . $this->actor->name;

            default:
                return "Le statut du dossier \"$projectName\" a été mis à jour.";
        }
    }
}
