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

        $conventions = [
            [
                'name' => 'Partenariat Stratégique Erasmus+ Mobilité',
                'partners' => 'Union Européenne, Université de Montpellier',
                'type' => 'international',
                'status' => 'termine',
                'target' => 50,
                'actual_value' => 42,
                'start_date' => Carbon::now()->subMonths(6),
                'end_date' => Carbon::now()->addMonths(18),
                'description' => 'Programme de mobilité pour les étudiants et enseignants-chercheurs de l\'UIDT.'
            ],
            [
                'name' => 'Convention Cadre UIDT - Sonatel Orange',
                'partners' => 'Sonatel Orange Sénégal',
                'type' => 'national',
                'status' => 'termine',
                'target' => 20,
                'actual_value' => 15,
                'start_date' => Carbon::now()->subYear(),
                'end_date' => Carbon::now()->addYear(),
                'description' => 'Digitalisation du campus et stages pour les étudiants en informatique.'
            ],
            [
                'name' => 'Accord de Recherche Mines et Environnement',
                'partners' => 'Industries Chimiques du Sénégal (ICS)',
                'type' => 'national',
                'status' => 'termine',
                'target' => 10,
                'actual_value' => 8,
                'start_date' => Carbon::now()->subMonths(3),
                'end_date' => Carbon::now()->addMonths(21),
                'description' => 'Étude de l\'impact environnemental de l\'extraction minière dans la région de Thiès.'
            ],
            [
                'name' => 'Plateforme d\'E-learning Inter-universitaire',
                'partners' => 'Université Virtuelle du Sénégal (UVS), AUF',
                'type' => 'regional',
                'status' => 'termine',
                'target' => 100,
                'actual_value' => 75,
                'start_date' => Carbon::now()->subMonths(9),
                'end_date' => Carbon::now()->addMonths(3),
                'description' => 'Mutualisation des ressources pédagogiques numériques.'
            ],
            [
                'name' => 'Centre d\'Excellence en Énergies Renouvelables',
                'partners' => 'GIZ (Coopération Allemande), ANER',
                'type' => 'international',
                'status' => 'en cours',
                'target' => 30,
                'actual_value' => 12,
                'start_date' => Carbon::now()->subMonths(2),
                'end_date' => Carbon::now()->addYears(3),
                'description' => 'Appui technique et financier pour la création d\'un laboratoire de recherche solaire.'
            ],
            [
                'name' => 'Convention de Stage et Alternance BTP',
                'partners' => 'Eiffage Sénégal, CSE',
                'type' => 'national',
                'status' => 'en attente',
                'target' => 40,
                'actual_value' => 0,
                'start_date' => Carbon::now()->addMonth(),
                'end_date' => Carbon::now()->addYears(2),
                'description' => 'Facilitation de l\'insertion professionnelle des techniciens supérieurs de l\'UIDT.'
            ],
            [
                'name' => 'Projet de Télémédecine Région Thiès',
                'partners' => 'Hôpital Régional de Thiès, Ministère de la Santé',
                'type' => 'regional',
                'status' => 'en attente',
                'target' => 15,
                'actual_value' => 0,
                'start_date' => Carbon::now()->addMonths(2),
                'end_date' => Carbon::now()->addYears(3),
                'description' => 'Mise en place d\'un réseau de consultation à distance piloté par l\'UFR Santé.'
            ],
            [
                'name' => 'Partenariat Académique UIDT - Polytechnique Montréal',
                'partners' => 'Polytechnique Montréal (Canada)',
                'type' => 'international',
                'status' => 'en cours',
                'target' => 12,
                'actual_value' => 4,
                'start_date' => Carbon::now()->subMonths(4),
                'end_date' => Carbon::now()->addYears(4),
                'description' => 'Co-tutelle de thèses et échanges scientifiques en génie civil.'
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
            } elseif ($convention->name === 'Accord de Recherche Mines et Environnement') {
                $convention->kpis()->create(['name' => 'Analyses de Sols', 'value' => 100, 'description' => 'Prélèvements effectués sur site.']);
                $convention->kpis()->create(['name' => 'Indice de Reforestation', 'value' => 30, 'description' => 'Surfaces réhabilitées.']);
            } elseif ($convention->name === 'Plateforme d\'E-learning Inter-universitaire') {
                $convention->kpis()->create(['name' => 'Cours en Ligne', 'value' => 75, 'description' => 'Modules pédagogiques finalisés.']);
                $convention->kpis()->create(['name' => 'Taux de Connectivité', 'value' => 90, 'description' => 'Accès des étudiants au portail.']);
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

            if ($convention->status !== 'en attente') {
                ConventionLog::create([
                    'convention_id' => $convention->id,
                    'user_id' => $directeur->id,
                    'action' => 'validation_directeur',
                    'comment' => 'Validé par la Direction de la Coopération.'
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
