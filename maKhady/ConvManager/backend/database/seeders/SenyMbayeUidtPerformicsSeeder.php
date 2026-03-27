<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Convention;
use Carbon\Carbon;

class SenyMbayeUidtPerformicsSeeder extends Seeder
{
    public function run(): void
    {
        $conventions = [
            [
                'name' => 'Programme Innovation Numérique UIDT',
                'partners' => 'UIDT, Sény Mbaye',
                'start_date' => Carbon::parse('2026-03-01'),
                'end_date' => Carbon::parse('2026-12-31'),
                'status' => 'en cours',
                'kpis' => [
                    ['name' => 'Projets Étudiants Accompagnés', 'value' => 15, 'description' => 'Mentorat technique.'],
                    ['name' => 'Plateformes Développées', 'value' => 2, 'description' => 'Outils internes UIDT.'],
                ]
            ],
            [
                'name' => 'Transformation Digitale Performics',
                'partners' => 'Performics, Sény Mbaye',
                'start_date' => Carbon::parse('2026-02-15'),
                'end_date' => Carbon::parse('2026-08-15'),
                'status' => 'en cours',
                'kpis' => [
                    ['name' => 'Processus Automatisés', 'value' => 8, 'description' => 'Optimisation workflow.'],
                    ['name' => 'Collaborateurs Formés', 'value' => 12, 'description' => 'Outils de productivité.'],
                ]
            ],
            [
                'name' => 'Synergie Académique & Professionnelle UIDT-Performics',
                'partners' => 'UIDT, Performics, Sény Mbaye',
                'start_date' => Carbon::parse('2026-04-10'),
                'end_date' => Carbon::parse('2027-04-10'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Stages de Fin d\'Études', 'value' => 10, 'description' => 'Etudiants UIDT chez Performics.'],
                    ['name' => 'Séminaires Conjoints', 'value' => 4, 'description' => 'Partage d\'expertise.'],
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
