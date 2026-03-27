<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Convention;
use Carbon\Carbon;

class GooglePartnerSeeder extends Seeder
{
    public function run(): void
    {
        $role = Role::where('name', 'partenaire')->first();
        
        $user = User::firstOrCreate(
            ['email' => 'google@partner.com'],
            [
                'name' => 'Google Cloud',
                'password' => bcrypt('password'),
                'role_id' => $role->id,
            ]
        );

        $conventions = [
            [
                'name' => 'Google Cloud Academy - Sénégal Edition',
                'partners' => 'Google Cloud, UIDT, UCAD',
                'start_date' => Carbon::parse('2026-02-01'),
                'end_date' => Carbon::parse('2026-12-15'),
                'status' => 'en cours',
                'kpis' => [
                    ['name' => 'Certifications GCP délilvrées', 'value' => 850, 'description' => 'Cloud Digital Leader & Associate.'],
                    ['name' => 'Laboratoires Pratiques (Qwiklabs)', 'value' => 5000, 'description' => 'Engagement technique.'],
                ]
            ],
            [
                'name' => 'IA Générative pour l\'Efficacité Administrative',
                'partners' => 'Google Cloud, ADIE',
                'start_date' => Carbon::parse('2026-04-15'),
                'end_date' => Carbon::parse('2026-10-15'),
                'status' => 'en cours',
                'kpis' => [
                    ['name' => 'Cas d\'Usage Déployés', 'value' => 12, 'description' => 'Vertex AI.'],
                    ['name' => 'Réduction Temps Traitement (%)', 'value' => 40, 'description' => 'Productivité.'],
                ]
            ],
            [
                'name' => 'Data Literacy Program - Public Sector',
                'partners' => 'Google Cloud, ENA Sénégal',
                'start_date' => Carbon::parse('2026-03-10'),
                'end_date' => Carbon::parse('2026-07-10'),
                'status' => 'en cours',
                'kpis' => [
                    ['name' => 'Hauts Fonctionnaires Formés', 'value' => 250, 'description' => 'Culture de la donnée.'],
                    ['name' => 'Dashboards Décisionnels Créés', 'value' => 30, 'description' => 'Looker Studio.'],
                ]
            ],
            [
                'name' => 'Startup Cloud Program - Senegal Hub',
                'partners' => 'Google Cloud, DER/FJ',
                'start_date' => Carbon::parse('2026-01-15'),
                'end_date' => Carbon::parse('2026-12-31'),
                'status' => 'en cours',
                'kpis' => [
                    ['name' => 'Crédits Cloud Distribués (k$)', 'value' => 500, 'description' => 'Soutien aux startups.'],
                    ['name' => 'Startups Tier-1 Accompagnées', 'value' => 25, 'description' => 'Mentorship.'],
                ]
            ],
            [
                'name' => 'Modernisation Data Warehouse National (BigQuery)',
                'partners' => 'Google Cloud, ANSD',
                'start_date' => Carbon::parse('2026-06-01'),
                'end_date' => Carbon::parse('2027-06-01'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Volume de Données (TB)', 'value' => 50, 'description' => 'Centralisation.'],
                    ['name' => 'Vitesse de Requêtage (x)', 'value' => 10, 'description' => 'Performance analytique.'],
                ]
            ],
            [
                'name' => 'Google Workspace for Education - Full Rollout',
                'partners' => 'Google Cloud, Ministère de l\'Education',
                'start_date' => Carbon::parse('2026-09-01'),
                'end_date' => Carbon::parse('2028-09-01'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Comptes Elèves Activés', 'value' => 1000000, 'description' => 'Outils collaboratifs.'],
                    ['name' => 'Etablissements Formés', 'value' => 500, 'description' => 'Accompagnement.'],
                ]
            ],
            [
                'name' => 'Infrastructure Cloud Souveraine Hybrid (Anthos)',
                'partners' => 'Google Cloud, SENUM SA',
                'start_date' => Carbon::parse('2026-05-15'),
                'end_date' => Carbon::parse('2027-05-15'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Clusters Déployés', 'value' => 5, 'description' => 'Multi-cloud strategy.'],
                    ['name' => 'Disponibilité (%)', 'value' => 99.99, 'description' => 'SLA.'],
                ]
            ],
        ];

        foreach ($conventions as $convData) {
            $kpis = $convData['kpis'];
            unset($convData['kpis']);
            
            $convention = Convention::create($convData);

            foreach ($kpis as $kpiData) {
                $convention->kpis()->create($kpiData);
            }
        }
    }
}
