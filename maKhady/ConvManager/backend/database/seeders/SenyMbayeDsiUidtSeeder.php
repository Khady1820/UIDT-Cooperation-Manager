<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Convention;
use Carbon\Carbon;

class SenyMbayeDsiUidtSeeder extends Seeder
{
    public function run(): void
    {
        $conventions = [
            [
                'name' => 'Modernisation de l\'Infrastructure Réseau DSI UIDT',
                'partners' => 'DSI UIDT, Cisco, Sény Mbaye',
                'start_date' => Carbon::parse('2026-05-01'),
                'end_date' => Carbon::parse('2026-11-30'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Débit Moyen (Gbps)', 'value' => 10, 'description' => 'Amélioration de la bande passante.'],
                    ['name' => 'Points d\'Accès WIFI', 'value' => 120, 'description' => 'Couverture campus étendue.'],
                ]
            ],
            [
                'name' => 'Migration vers le Cloud Souverain (DSI UIDT)',
                'partners' => 'DSI UIDT, SENUM SA, Sény Mbaye',
                'start_date' => Carbon::parse('2026-07-15'),
                'end_date' => Carbon::parse('2026-12-15'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Données Migrées (TB)', 'value' => 50, 'description' => 'Base de données et archives.'],
                    ['name' => 'Taux de Disponibilité (%)', 'value' => 99.9, 'description' => 'SLA garanti.'],
                ]
            ],
            [
                'name' => 'Audit de Cybersécurité et Renforcement (DSI UIDT)',
                'partners' => 'DSI UIDT, Experts Externes, Sény Mbaye',
                'start_date' => Carbon::parse('2026-09-01'),
                'end_date' => Carbon::parse('2026-10-31'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Tests d\'Intrusion Réalisés', 'value' => 3, 'description' => 'Simulation d\'attaques.'],
                    ['name' => 'Pare-feux (Firewalls) Upgradés', 'value' => 4, 'description' => 'Protection périmétrique.'],
                ]
            ],
            [
                'name' => 'Déploiement de l\'ERP Académique (DSI UIDT)',
                'partners' => 'DSI UIDT, Editeur Logiciel, Sény Mbaye',
                'start_date' => Carbon::parse('2026-04-20'),
                'end_date' => Carbon::parse('2027-04-20'),
                'status' => 'en cours',
                'kpis' => [
                    ['name' => 'Modules Opérationnels', 'value' => 5, 'description' => 'Scolarité, RH, Finance...'],
                    ['name' => 'Utilisateurs Formés', 'value' => 200, 'description' => 'Personnel administratif.'],
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
