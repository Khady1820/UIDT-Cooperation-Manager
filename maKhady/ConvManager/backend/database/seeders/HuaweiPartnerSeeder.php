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
                'indicator' => 'Sites 5G Activés',
                'target' => 200,
                'actual_value' => 150,
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
                'indicator' => 'Salles de Classe Connectées',
                'target' => 50,
                'actual_value' => 45,
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
                'indicator' => 'Certifications Délivrées',
                'target' => 1500,
                'actual_value' => 1200,
                'kpis' => [
                    ['name' => 'Certifications Délivrées', 'value' => 1200, 'description' => 'HCIA & HCIP.'],
                    ['name' => 'Instructeurs Formés', 'value' => 50, 'description' => 'Transfert de compétences.'],
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
