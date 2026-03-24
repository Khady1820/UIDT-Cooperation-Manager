<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Convention;
use App\Models\Kpi;
use Carbon\Carbon;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        $conventions = [
            [
                'name' => 'Convention Tech Africa 2026',
                'partners' => 'Google, Microsoft, Orange',
                'start_date' => Carbon::parse('2026-06-10'),
                'end_date' => Carbon::parse('2026-06-15'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Participants Attendus', 'value' => 5000, 'description' => 'Nombre cible de visiteurs.'],
                    ['name' => 'Sponsors Confirmés', 'value' => 45, 'description' => 'Objectif B2B.'],
                    ['name' => 'Couverture Média', 'value' => 120, 'description' => 'Articles et passages TV attendus.'],
                ]
            ],
            [
                'name' => 'Sommet Santé et Innovation',
                'partners' => 'OMS, Ministère de la Santé',
                'start_date' => Carbon::parse('2025-10-01'),
                'end_date' => Carbon::parse('2025-10-05'),
                'status' => 'terminé',
                'kpis' => [
                    ['name' => 'Participants', 'value' => 3200, 'description' => 'Médecins et chercheurs présents.'],
                    ['name' => 'Ateliers Réalisés', 'value' => 15, 'description' => 'Ateliers pratiques organisés.'],
                    ['name' => 'Taux de Satisfaction', 'value' => 94, 'description' => 'En pourcentage (%).'],
                    ['name' => 'Partenariats Signés', 'value' => 8, 'description' => 'Accords B2B clôturés.'],
                ]
            ],
            [
                'name' => 'Forum de l\'Agriculture Durable',
                'partners' => 'FAO, AGRA, Coopératives locales',
                'start_date' => Carbon::parse('2026-03-20'),
                'end_date' => Carbon::parse('2026-03-25'),
                'status' => 'en cours',
                'kpis' => [
                    ['name' => 'Visiteurs Actuels', 'value' => 1850, 'description' => 'Score à mi-parcours.'],
                    ['name' => 'Stands', 'value' => 80, 'description' => 'Agriculteurs exposant.'],
                    ['name' => 'Ventes (K FCFA)', 'value' => 45000, 'description' => 'Estimation des transactions.'],
                ]
            ],
            [
                'name' => 'Festival des Arts Numériques',
                'partners' => 'Institut Français, Sony',
                'start_date' => Carbon::parse('2026-08-05'),
                'end_date' => Carbon::parse('2026-08-12'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Artistes Inscrits', 'value' => 120, 'description' => 'Créatifs participants.'],
                    ['name' => 'Billets Vendus', 'value' => 8500, 'description' => 'Préventes actuelles.'],
                ]
            ],
            [
                'name' => 'Salon de l\'Habitat',
                'partners' => 'BHS, CSTT, Eiffage',
                'start_date' => Carbon::parse('2025-12-10'),
                'end_date' => Carbon::parse('2025-12-15'),
                'status' => 'terminé',
                'kpis' => [
                    ['name' => 'Constructeurs', 'value' => 60, 'description' => 'Entreprises de BTP.'],
                    ['name' => 'Contrats Signés', 'value' => 310, 'description' => 'Maisons / Parcelles.'],
                    ['name' => 'Visiteurs', 'value' => 14000, 'description' => 'Grand public.'],
                ]
            ]
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
