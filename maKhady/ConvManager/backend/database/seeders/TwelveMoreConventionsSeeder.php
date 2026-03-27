<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Convention;
use Carbon\Carbon;

class TwelveMoreConventionsSeeder extends Seeder
{
    public function run(): void
    {
        $partnerName = 'Ami Ndiaye';
        $conventions = [
            [
                'name' => 'Promotion de l\'Artisanat Local',
                'partners' => "UNESCO, $partnerName, Ministère de l'Artisanat",
                'start_date' => Carbon::parse('2026-03-15'),
                'end_date' => Carbon::parse('2026-06-15'),
                'status' => 'en cours',
                'kpis' => [
                    ['name' => 'Artisans Formés', 'value' => 120, 'description' => 'Formation aux techniques modernes.'],
                    ['name' => 'Expositions Organisées', 'value' => 3, 'description' => 'Salons régionaux.'],
                ]
            ],
            [
                'name' => 'Santé Maternelle en Milieu Rural',
                'partners' => "OMS, $partnerName, Croix-Rouge",
                'start_date' => Carbon::parse('2026-04-01'),
                'end_date' => Carbon::parse('2026-12-31'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Cliniques Mobiles', 'value' => 5, 'description' => 'Déplacements mensuels.'],
                    ['name' => 'Bénéficiaires', 'value' => 2500, 'description' => 'Femmes accompagnées.'],
                ]
            ],
            [
                'name' => 'Modernisation de la Pêche Artisanale',
                'partners' => "Gouvernement, $partnerName, World Fish",
                'start_date' => Carbon::parse('2026-01-10'),
                'end_date' => Carbon::parse('2026-05-10'),
                'status' => 'en cours',
                'kpis' => [
                    ['name' => 'Gilets de Sauvetage', 'value' => 300, 'description' => 'Distribution aux pêcheurs.'],
                    ['name' => 'Nouveaux Moteurs', 'value' => 50, 'description' => 'Moteurs hors-bord équipés.'],
                ]
            ],
            [
                'name' => 'Reboisement de la Grande Muraille Verte',
                'partners' => "African Union, $partnerName, FAO",
                'start_date' => Carbon::parse('2026-07-20'),
                'end_date' => Carbon::parse('2027-07-20'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Plants Mis en Terre', 'value' => 50000, 'description' => 'Objectif semestriel.'],
                    ['name' => 'Taux de Survie (%)', 'value' => 85, 'description' => 'Suivi des plants.'],
                ]
            ],
            [
                'name' => 'Électrification Solaire Villageoise',
                'partners' => "Solar Africa, $partnerName",
                'start_date' => Carbon::parse('2025-10-01'),
                'end_date' => Carbon::parse('2026-03-31'),
                'status' => 'en cours',
                'kpis' => [
                    ['name' => 'Kits Solaires', 'value' => 450, 'description' => 'Installations domestiques.'],
                    ['name' => 'Indice de Satisfaction', 'value' => 4, 'description' => 'Sur une échelle de 1 à 5.'],
                ]
            ],
            [
                'name' => 'Soutien à l\'Entrepreneuriat Féminin',
                'partners' => "ONU Femmes, $partnerName, Banque Locale",
                'start_date' => Carbon::parse('2026-02-01'),
                'end_date' => Carbon::parse('2026-08-01'),
                'status' => 'en cours',
                'kpis' => [
                    ['name' => 'Micro-crédits Octroyés', 'value' => 200, 'description' => 'Prêts à taux préférentiel.'],
                    ['name' => 'Sessions de Coaching', 'value' => 40, 'description' => 'Gestion d\'entreprise.'],
                ]
            ],
            [
                'name' => 'Accès à l\'Eau Potable (Sud)',
                'partners' => "WaterAid, $partnerName",
                'start_date' => Carbon::parse('2025-12-15'),
                'end_date' => Carbon::parse('2026-06-15'),
                'status' => 'en cours',
                'kpis' => [
                    ['name' => 'Forages Réalisés', 'value' => 12, 'description' => 'Nouveaux points d\'eau.'],
                    ['name' => 'Maintenance Locaux', 'value' => 8, 'description' => 'Comités de gestion formés.'],
                ]
            ],
            [
                'name' => 'Numérisation du Patrimoine Historique',
                'partners' => "Archives Nationales, $partnerName, Google Arts",
                'start_date' => Carbon::parse('2026-05-01'),
                'end_date' => Carbon::parse('2026-11-01'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Documents Scannés', 'value' => 15000, 'description' => 'Archives haute résolution.'],
                    ['name' => 'Visites Virtuelles', 'value' => 5, 'description' => 'Sites reconstitués en 3D.'],
                ]
            ],
            [
                'name' => 'Lutte contre l\'Insalubrité Urbaine',
                'partners' => "Mairie, $partnerName, NGO Clean",
                'start_date' => Carbon::parse('2026-01-05'),
                'end_date' => Carbon::parse('2026-04-05'),
                'status' => 'en cours',
                'kpis' => [
                    ['name' => 'Bacs à Ordures', 'value' => 500, 'description' => 'Installés dans les quartiers.'],
                    ['name' => 'Campagnes de Sensibilisation', 'value' => 20, 'description' => 'Émissions radio et TV.'],
                ]
            ],
            [
                'name' => 'Formation aux Métiers du Rail',
                'partners' => "Société des Chemins de Fer, $partnerName, SNCF",
                'start_date' => Carbon::parse('2026-09-01'),
                'end_date' => Carbon::parse('2027-06-01'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Techniciens Formés', 'value' => 80, 'description' => 'Certifications ferroviaires.'],
                    ['name' => 'Taux d\'Insertion (%)', 'value' => 95, 'description' => 'Embauche après formation.'],
                ]
            ],
            [
                'name' => 'Développement de l\'Aquaculture Marine',
                'partners' => "Ifremer, $partnerName",
                'start_date' => Carbon::parse('2026-03-20'),
                'end_date' => Carbon::parse('2026-10-20'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Cages Flottantes', 'value' => 25, 'description' => 'Installations en mer.'],
                    ['name' => 'Production (T)', 'value' => 15, 'description' => 'Objectif première récolte.'],
                ]
            ],
            [
                'name' => 'Promotion du Tourisme Éco-responsable',
                'partners' => "Agence Tourisme, $partnerName, NGO Nature",
                'start_date' => Carbon::parse('2025-11-20'),
                'end_date' => Carbon::parse('2026-05-20'),
                'status' => 'en cours',
                'kpis' => [
                    ['name' => 'Éco-lodges Labellisés', 'value' => 15, 'description' => 'Certification durable.'],
                    ['name' => 'Guides Formés', 'value' => 45, 'description' => 'Spécialistes flore et faune.'],
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
