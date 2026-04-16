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
                'indicator' => 'Mairies Digitalisées',
                'target' => 200,
                'actual_value' => 120,
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
                'indicator' => 'Bâtiments Campus Raccordés',
                'target' => 25,
                'actual_value' => 18,
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
                'indicator' => 'Startups Accélérées',
                'target' => 20,
                'actual_value' => 15,
                'kpis' => [
                    ['name' => 'Startups Accompagnées', 'value' => 15, 'description' => 'Accélération business.'],
                    ['name' => 'Levée de Fonds (Mio CFA)', 'value' => 500, 'description' => 'Investissement.'],
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
