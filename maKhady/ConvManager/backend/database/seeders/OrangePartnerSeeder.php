<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Convention;
use Carbon\Carbon;

class OrangePartnerSeeder extends Seeder
{
    public function run(): void
    {
        $role = Role::where('name', 'partenaire')->first();
        
        $user = User::firstOrCreate(
            ['email' => 'orange@partner.com'],
            [
                'name' => 'Orange Sénégal',
                'password' => bcrypt('password'),
                'role_id' => $role->id,
            ]
        );

        $conventions = [
            [
                'name' => 'Transformation Digitale des Collectivités Locales',
                'partners' => 'Orange Sénégal, Ministère des Collectivités Territoriales',
                'start_date' => Carbon::parse('2026-01-10'),
                'end_date' => Carbon::parse('2027-01-10'),
                'status' => 'en cours',
                'kpis' => [
                    ['name' => 'Mairies Digitalisées', 'value' => 120, 'description' => 'Déploiement solutions e-gov.'],
                    ['name' => 'Citoyens Enrôlés', 'value' => 200000, 'description' => 'Usage des services en ligne.'],
                ]
            ],
            [
                'name' => 'Extension Fibre Optique Haute Performance (UIDT)',
                'partners' => 'Orange Sénégal, UIDT',
                'start_date' => Carbon::parse('2026-03-01'),
                'end_date' => Carbon::parse('2026-08-30'),
                'status' => 'en cours',
                'kpis' => [
                    ['name' => 'Bâtiments Connectés', 'value' => 18, 'description' => 'FTTH/FTTO.'],
                    ['name' => 'Bande Passante (Gbps)', 'value' => 10, 'description' => 'Capacité réseau.'],
                ]
            ],
            [
                'name' => 'Incubateur Orange Fab - Promotion 2026',
                'partners' => 'Orange Sénégal, Startups Locales',
                'start_date' => Carbon::parse('2026-02-15'),
                'end_date' => Carbon::parse('2026-11-15'),
                'status' => 'en cours',
                'kpis' => [
                    ['name' => 'Startups Accompagnées', 'value' => 15, 'description' => 'Accélération business.'],
                    ['name' => 'Levée de Fonds (Mio CFA)', 'value' => 500, 'description' => 'Investissement.'],
                ]
            ],
            [
                'name' => 'Programme Orange Digital Center - Inclusions',
                'partners' => 'Orange Sénégal, Fondation Orange',
                'start_date' => Carbon::parse('2026-01-01'),
                'end_date' => Carbon::parse('2026-12-31'),
                'status' => 'en cours',
                'kpis' => [
                    ['name' => 'Jeunes Formés au Code', 'value' => 3000, 'description' => 'ODC Dakar & Thiès.'],
                    ['name' => 'Taux d\'Insertion Pro', 'value' => 75, 'description' => 'Employabilité.'],
                ]
            ],
            [
                'name' => 'Modernisation du Paiement Mobile (Orange Money)',
                'partners' => 'Orange Sénégal, Commerçants Partenaires',
                'start_date' => Carbon::parse('2026-05-01'),
                'end_date' => Carbon::parse('2027-05-01'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Volume Transactions (Md CFA)', 'value' => 1500, 'description' => 'Flux financier.'],
                    ['name' => 'Utilisateurs Actifs', 'value' => 5000000, 'description' => 'Adoption services.'],
                ]
            ],
            [
                'name' => 'Cybersecurity Awareness Program 2026',
                'partners' => 'Orange Sénégal, Entreprises du CAC25',
                'start_date' => Carbon::parse('2026-04-20'),
                'end_date' => Carbon::parse('2026-10-20'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Salariés Sensibilisés', 'value' => 12000, 'description' => 'Formations en ligne.'],
                    ['name' => 'Tests d\'Intrusion Réussis', 'value' => 0, 'description' => 'Indice de résilience.'],
                ]
            ],
            [
                'name' => 'Green IT - Décarbonation du Réseau Fixe',
                'partners' => 'Orange Sénégal, Senelec',
                'start_date' => Carbon::parse('2026-06-01'),
                'end_date' => Carbon::parse('2030-01-01'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Taux d\'Energies Propres (%)', 'value' => 60, 'description' => 'Transition énergétique.'],
                    ['name' => 'Recyclage Terminaux (Kg)', 'value' => 5000, 'description' => 'Economie circulaire.'],
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
