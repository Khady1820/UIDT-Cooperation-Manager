<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Convention;
use Carbon\Carbon;

class SenyMbayeTwoMoreSeeder extends Seeder
{
    public function run(): void
    {
        $conventions = [
            [
                'name' => 'Gouvernance IT & Stratégie Institutionnelle UIDT',
                'partners' => 'UIDT, Sény Mbaye',
                'start_date' => Carbon::parse('2026-06-01'),
                'end_date' => Carbon::parse('2026-12-31'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Schéma Directeur Informatique', 'value' => 1, 'description' => 'Document de référence.'],
                    ['name' => 'Comités de Pilotage', 'value' => 6, 'description' => 'Réunions de suivi.'],
                ]
            ],
            [
                'name' => 'Partenariat Technologique Performics Global Search',
                'partners' => 'Performics, Sény Mbaye',
                'start_date' => Carbon::parse('2026-01-20'),
                'end_date' => Carbon::parse('2026-04-20'),
                'status' => 'en cours',
                'kpis' => [
                    ['name' => 'Campagnes Digitales Optimisées', 'value' => 50, 'description' => 'Performance SEO/SEA.'],
                    ['name' => 'Infrastructures Cloud Search', 'value' => 2, 'description' => 'Clusters scalables.'],
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
