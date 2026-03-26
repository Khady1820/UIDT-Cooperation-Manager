<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Convention;
use Carbon\Carbon;

class ThirteenConventionsSeeder extends Seeder
{
    public function run(): void
    {
        $conventions = [
            [
                'name' => 'Éducation Numérique pour Tous',
                'partners' => 'UNESCO, Microsoft, Gouvernement',
                'start_date' => Carbon::parse('2026-01-15'),
                'end_date' => Carbon::parse('2026-01-20'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Écoles Connectées', 'value' => 150, 'description' => 'Nombre d\'établissements équipés.'],
                    ['name' => 'Enseignants Formés', 'value' => 450, 'description' => 'Formation aux outils numériques.'],
                ]
            ],
            [
                'name' => 'Protection des Océans 2026',
                'partners' => 'Greenpeace, Ocean Cleanup, Marine Policy',
                'start_date' => Carbon::parse('2026-05-22'),
                'end_date' => Carbon::parse('2026-05-28'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Déchets Collectés (T)', 'value' => 25, 'description' => 'Tonnes de plastique retirées.'],
                    ['name' => 'Zones Protégées', 'value' => 5, 'description' => 'Nouvelles aires marines.'],
                ]
            ],
            [
                'name' => 'Sommet Africain de l\'IA',
                'partners' => 'Tech Hub, Google AI, African Union',
                'start_date' => Carbon::parse('2026-09-10'),
                'end_date' => Carbon::parse('2026-09-12'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Startups Exposantes', 'value' => 85, 'description' => 'Projets IA locaux.'],
                    ['name' => 'Investissements (M$)', 'value' => 12, 'description' => 'Promesses de financement.'],
                ]
            ],
            [
                'name' => 'Plan Énergies Renouvelables',
                'partners' => 'Senelec, TotalEnergies, NGO Sol',
                'start_date' => Carbon::parse('2025-11-05'),
                'end_date' => Carbon::parse('2025-11-10'),
                'status' => 'terminé',
                'kpis' => [
                    ['name' => 'MW Installés', 'value' => 50, 'description' => 'Capacité solaire ajoutée.'],
                    ['name' => 'Foyers Alimentés', 'value' => 12000, 'description' => 'Nouveaux raccordements.'],
                ]
            ],
            [
                'name' => 'Festival International du Cinéma',
                'partners' => 'CinéAfrique, Canal+, Ministère Culture',
                'start_date' => Carbon::parse('2026-02-14'),
                'end_date' => Carbon::parse('2026-02-21'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Films Projetés', 'value' => 42, 'description' => 'Sélection officielle.'],
                    ['name' => 'Nombre de Spectateurs', 'value' => 25000, 'description' => 'Total des entrées.'],
                ]
            ],
            [
                'name' => 'Tournoi de Basketball Régional',
                'partners' => 'FIBA, NBA Africa, Sponsor Sport',
                'start_date' => Carbon::parse('2026-04-10'),
                'end_date' => Carbon::parse('2026-04-15'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Équipes Participantes', 'value' => 16, 'description' => 'Clubs engagés.'],
                    ['name' => 'Nouveaux Terrains', 'value' => 4, 'description' => 'Rénovations urbaines.'],
                ]
            ],
            [
                'name' => 'Forum de l\'Emploi Jeunesse',
                'partners' => 'ANPEJ, Grandes Entreprises, CCI',
                'start_date' => Carbon::parse('2026-03-01'),
                'end_date' => Carbon::parse('2026-03-03'),
                'status' => 'en cours',
                'kpis' => [
                    ['name' => 'CV Déposés', 'value' => 1200, 'description' => 'Candidatures enregistrées.'],
                    ['name' => 'Promesses d\'Emploi', 'value' => 150, 'description' => 'Contrats en vue.'],
                ]
            ],
            [
                'name' => 'Salon de la Gastronomie Locale',
                'partners' => 'Chefs Ass., Agence Tourisme',
                'start_date' => Carbon::parse('2025-08-20'),
                'end_date' => Carbon::parse('2025-08-23'),
                'status' => 'terminé',
                'kpis' => [
                    ['name' => 'Exposants', 'value' => 65, 'description' => 'Producteurs locaux.'],
                    ['name' => 'Plats Dégustés', 'value' => 5000, 'description' => 'Estimation.'],
                ]
            ],
            [
                'name' => 'Projet de Reforestation Sahel',
                'partners' => 'Eaux et Forêts, UNCCD, NGO Green',
                'start_date' => Carbon::parse('2026-07-01'),
                'end_date' => Carbon::parse('2026-10-30'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Arbres Plantés', 'value' => 100000, 'description' => 'Objectif annuel.'],
                    ['name' => 'Hectares Restaurés', 'value' => 1200, 'description' => 'Surface couverte.'],
                ]
            ],
            [
                'name' => 'Sommet de la Cybersécurité',
                'partners' => 'ADIE, Interpol, Cyber Security Firm',
                'start_date' => Carbon::parse('2026-06-05'),
                'end_date' => Carbon::parse('2026-06-07'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Délégués', 'value' => 400, 'description' => 'Experts présents.'],
                    ['name' => 'Alertes Neutralisées', 'value' => 0, 'description' => 'Simulation live.'],
                ]
            ],
            [
                'name' => 'Exposition d\'Art Contemporain',
                'partners' => 'Musée Dakar, Fondation X',
                'start_date' => Carbon::parse('2025-09-15'),
                'end_date' => Carbon::parse('2025-10-15'),
                'status' => 'terminé',
                'kpis' => [
                    ['name' => 'Œuvres Exposées', 'value' => 110, 'description' => 'Peintures et sculptures.'],
                    ['name' => 'Ventes (K$)', 'value' => 45, 'description' => 'Total des transactions.'],
                ]
            ],
            [
                'name' => 'Conférence Climat COP-Local',
                'partners' => 'Mairie, ONG Climat, Universités',
                'start_date' => Carbon::parse('2026-11-12'),
                'end_date' => Carbon::parse('2026-11-15'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Résolutions Adoptées', 'value' => 12, 'description' => 'Engagements municipaux.'],
                    ['name' => 'Nombre de Participants', 'value' => 800, 'description' => 'Citoyens engagés.'],
                ]
            ],
            [
                'name' => 'Marathon de la Paix',
                'partners' => 'Fédération Athlétisme, Croix-Rouge',
                'start_date' => Carbon::parse('2026-12-20'),
                'end_date' => Carbon::parse('2026-12-20'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Coureurs Inscrits', 'value' => 3500, 'description' => 'Toutes catégories.'],
                    ['name' => 'Fonds Récoltés (K$)', 'value' => 15, 'description' => 'Pour les réfugiés.'],
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
