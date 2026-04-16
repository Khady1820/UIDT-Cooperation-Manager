<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Convention;
use App\Models\ConventionLog;
use App\Models\User;
use Carbon\Carbon;

class UIDTInstitutionalSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::whereHas('role', function($q) { $q->where('name', 'admin'); })->first();
        $porteur = User::where('email', 'porteur@uidt.sn')->first();
        $directeur = User::where('email', 'directeur@uidt.sn')->first();
        $juridique = User::whereHas('role', function($q) { $q->where('name', 'service_juridique'); })->first();

        $conventions = [
            [
                'name' => 'Convention Cadre UIDT - Sonatel Orange',
                'partners' => 'Sonatel Orange Sénégal',
                'type' => 'national',
                'status' => 'termine',
                'indicator' => 'Campus Connectés',
                'target' => 20,
                'actual_value' => 15,
                'start_date' => Carbon::now()->subYear(),
                'end_date' => Carbon::now()->addYear(),
                'description' => 'Digitalisation du campus et stages pour les étudiants en informatique.'
            ],
            [
                'name' => 'Partenariat Stratégique Erasmus+ Mobilité',
                'partners' => 'Union Européenne, Université de Montpellier',
                'type' => 'international',
                'status' => 'termine',
                'indicator' => 'Etudiants en Mobilité',
                'target' => 50,
                'actual_value' => 42,
                'start_date' => Carbon::now()->subMonths(6),
                'end_date' => Carbon::now()->addMonths(18),
                'description' => 'Programme de mobilité pour les étudiants et enseignants-chercheurs de l\'UIDT.'
            ],
            [
                'name' => 'Partenariat Académique UIDT - Polytechnique Montréal',
                'partners' => 'Polytechnique Montréal (Canada)',
                'type' => 'international',
                'status' => 'valide_juridique',
                'indicator' => 'Doctorants en Co-tutelle',
                'target' => 12,
                'actual_value' => 4,
                'start_date' => Carbon::now()->subMonths(4),
                'end_date' => Carbon::now()->addYears(4),
                'description' => 'Co-tutelle de thèses et échanges scientifiques en génie civil.'
            ],
            [
                'name' => 'Centre d\'Excellence en Énergies Renouvelables',
                'partners' => 'GIZ (Coopération Allemande), ANER',
                'type' => 'international',
                'status' => 'valide_dir_initial',
                'indicator' => 'Bâtiments Équipés en Solaire',
                'target' => 30,
                'actual_value' => 12,
                'start_date' => Carbon::now()->subMonths(2),
                'end_date' => Carbon::now()->addYears(3),
                'description' => 'Appui technique et financier pour la création d\'un laboratoire de recherche solaire.'
            ],
        ];

        foreach ($conventions as $data) {
            $data['user_id'] = $porteur->id;
            $data['completion_rate'] = ($data['target'] > 0) ? ($data['actual_value'] / $data['target']) * 100 : 0;
            
            $convention = Convention::create($data);

            // Add realistic KPIs based on convention name/type
            if ($convention->name === 'Partenariat Stratégique Erasmus+ Mobilité') {
                $convention->kpis()->create(['name' => 'Mobilité Étudiante', 'value' => 85, 'description' => 'Taux de réalisation des départs prévus.']);
                $convention->kpis()->create(['name' => 'Formation Staff', 'value' => 70, 'description' => 'Sessions de renforcement de capacités.']);
            } elseif ($convention->name === 'Convention Cadre UIDT - Sonatel Orange') {
                $convention->kpis()->create(['name' => 'Stages II/Informatique', 'value' => 95, 'description' => 'Taux d\'accueil des stagiaires.']);
                $convention->kpis()->create(['name' => 'Équipement Labo', 'value' => 40, 'description' => 'Installation des serveurs dédiés.']);
            } elseif ($convention->name === 'Centre d\'Excellence en Énergies Renouvelables') {
                $convention->kpis()->create(['name' => 'Installation Panneaux', 'value' => 25, 'description' => 'Mise en place de la ferme solaire.']);
            } elseif ($convention->name === 'Partenariat Académique UIDT - Polytechnique Montréal') {
                $convention->kpis()->create(['name' => 'Co-tutelles de Thèse', 'value' => 50, 'description' => 'Doctorants inscrits dans les deux pays.']);
            }

            // Add some logs
            ConventionLog::create([
                'convention_id' => $convention->id,
                'user_id' => $porteur->id,
                'action' => 'creation',
                'comment' => 'Dossier initialisé par le porteur de projet.'
            ]);

            if ($convention->status !== 'en attente' && $convention->status !== 'brouillon') {
                ConventionLog::create([
                    'convention_id' => $convention->id,
                    'user_id' => $directeur->id,
                    'action' => 'validation_directeur',
                    'comment' => 'Validé par la Direction de la Coopération.'
                ]);
            }

            if ($convention->status === 'valide_juridique' || $convention->status === 'signale_recteur' || $convention->status === 'termine') {
                ConventionLog::create([
                    'convention_id' => $convention->id,
                    'user_id' => $juridique->id,
                    'action' => 'visa_juridique',
                    'comment' => 'Conformité juridique validée.'
                ]);
            }

            if ($convention->status === 'termine') {
                ConventionLog::create([
                    'convention_id' => $convention->id,
                    'user_id' => $admin->id,
                    'action' => 'signature_recteur',
                    'comment' => 'Signature finale du Recteur.'
                ]);
            }
        }
    }
}
