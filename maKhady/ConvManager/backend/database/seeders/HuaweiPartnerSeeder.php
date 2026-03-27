<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Convention;
use Carbon\Carbon;

class HuaweiPartnerSeeder extends Seeder
{
    public function run(): void
    {
        $role = Role::where('name', 'partenaire')->first();
        
        $user = User::firstOrCreate(
            ['email' => 'huawei@partner.com'],
            [
                'name' => 'Huawei Technologies',
                'password' => bcrypt('password'),
                'role_id' => $role->id,
            ]
        );

        $conventions = [
            [
                'name' => 'Déploiement National Infrastructure 5G',
                'partners' => 'Huawei Technologies, Etat du Sénégal, ARTP',
                'start_date' => Carbon::parse('2026-01-01'),
                'end_date' => Carbon::parse('2027-12-31'),
                'status' => 'en cours',
                'kpis' => [
                    ['name' => 'Sites 5G Activés', 'value' => 150, 'description' => 'Couverture zones urbaines.'],
                    ['name' => 'Débit Moyen (Mbps)', 'value' => 500, 'description' => 'Performance réseau.'],
                ]
            ],
            [
                'name' => 'Smart Campus UIDT - Phase 1',
                'partners' => 'Huawei Technologies, UIDT',
                'start_date' => Carbon::parse('2026-03-15'),
                'end_date' => Carbon::parse('2026-09-15'),
                'status' => 'en cours',
                'kpis' => [
                    ['name' => 'Salles Connectées', 'value' => 45, 'description' => 'Equipement IoT.'],
                    ['name' => 'Taux d\'Adoption Etudiants', 'value' => 85, 'description' => 'Utilisation services digitaux.'],
                ]
            ],
            [
                'name' => 'Huawei ICT Academy 2026',
                'partners' => 'Huawei Technologies, Universités Publiques',
                'start_date' => Carbon::parse('2026-02-01'),
                'end_date' => Carbon::parse('2026-12-15'),
                'status' => 'en cours',
                'kpis' => [
                    ['name' => 'Certifications Délivrées', 'value' => 1200, 'description' => 'HCIA & HCIP.'],
                    ['name' => 'Instructeurs Formés', 'value' => 50, 'description' => 'Transfert de compétences.'],
                ]
            ],
            [
                'name' => 'Data Center National - Upgrade',
                'partners' => 'Huawei Technologies, SENUM SA',
                'start_date' => Carbon::parse('2026-05-20'),
                'end_date' => Carbon::parse('2026-11-20'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Capacité de Stockage (PB)', 'value' => 10, 'description' => 'Evolution infrastructure.'],
                    ['name' => 'Consommation Energétique (PUE)', 'value' => 1.4, 'description' => 'Efficacité énergétique.'],
                ]
            ],
            [
                'name' => 'Rural Star - Connectivité Zones Reculées',
                'partners' => 'Huawei Technologies, Fond de Développement Universel',
                'start_date' => Carbon::parse('2026-04-10'),
                'end_date' => Carbon::parse('2027-04-10'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Villages Désenclavés', 'value' => 300, 'description' => 'Accès voix et data.'],
                    ['name' => 'Population Couverte', 'value' => 50000, 'description' => 'Impact social.'],
                ]
            ],
            [
                'name' => 'Programme "Seeds for the Future" 2026',
                'partners' => 'Huawei Technologies, Ministère de l\'Enseignement Supérieur',
                'start_date' => Carbon::parse('2026-07-01'),
                'end_date' => Carbon::parse('2026-08-30'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Etudiants Sélectionnés', 'value' => 20, 'description' => 'Immersion technologique.'],
                    ['name' => 'Projets Innovants Pitchés', 'value' => 5, 'description' => 'Concours Tech4Good.'],
                ]
            ],
            [
                'name' => 'Solution Safe City - Extension Dakar',
                'partners' => 'Huawei Technologies, Ministère de l\'Intérieur',
                'start_date' => Carbon::parse('2026-06-01'),
                'end_date' => Carbon::parse('2027-06-01'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Caméras Intelligentes', 'value' => 500, 'description' => 'Vidéoprotection urbaine.'],
                    ['name' => 'Temps de Réponse (Min)', 'value' => 5, 'description' => 'Optimisation secours.'],
                ]
            ],
            [
                'name' => 'Modernisation du Core Network Fixe',
                'partners' => 'Huawei Technologies, Sonatel',
                'start_date' => Carbon::parse('2026-01-15'),
                'end_date' => Carbon::parse('2026-06-15'),
                'status' => 'terminé',
                'kpis' => [
                    ['name' => 'Taux de Migration IP', 'value' => 100, 'description' => 'Sortie du legacy.'],
                    ['name' => 'Latence Moyenne (ms)', 'value' => 15, 'description' => 'Fibre optique.'],
                ]
            ],
            [
                'name' => 'Programme Digital Truck - Education Mobile',
                'partners' => 'Huawei Technologies, Close the Gap',
                'start_date' => Carbon::parse('2026-03-01'),
                'end_date' => Carbon::parse('2026-12-31'),
                'status' => 'en cours',
                'kpis' => [
                    ['name' => 'Heures de Formation', 'value' => 2500, 'description' => 'Inclusion numérique.'],
                    ['name' => 'Zones Rurales Visitées', 'value' => 25, 'description' => 'Mobilité.'],
                ]
            ],
            [
                'name' => 'Cloud Strategy & Sovereign AI',
                'partners' => 'Huawei Technologies, Gouvernance Digitale',
                'start_date' => Carbon::parse('2026-08-15'),
                'end_date' => Carbon::parse('2027-08-15'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Algorithmes Locaux', 'value' => 3, 'description' => 'Intelligence Artificielle.'],
                    ['name' => 'Serveurs Déployés', 'value' => 10, 'description' => 'Infrastructure Cloud.'],
                ]
            ],
            [
                'name' => 'Digital Power - Solar Hybrid Base Stations',
                'partners' => 'Huawei Technologies, Opérateurs Mobiles',
                'start_date' => Carbon::parse('2026-02-10'),
                'end_date' => Carbon::parse('2027-02-10'),
                'status' => 'en cours',
                'kpis' => [
                    ['name' => 'Réduction CO2 (Tonnes)', 'value' => 1200, 'description' => 'Impact écologique.'],
                    ['name' => 'Station Solaire (%)', 'value' => 40, 'description' => 'Energie renouvelable.'],
                ]
            ],
            [
                'name' => 'Innovation Lab - Fintech & Digital Payment',
                'partners' => 'Huawei Technologies, Banques Locales',
                'start_date' => Carbon::parse('2026-09-01'),
                'end_date' => Carbon::parse('2027-03-01'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Transactions/Sec (TPS)', 'value' => 5000, 'description' => 'Plateforme mobile money.'],
                    ['name' => 'Nouveaux Services lancés', 'value' => 4, 'description' => 'Micro-crédit, Assurances.'],
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
