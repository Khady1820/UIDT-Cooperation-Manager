<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Convention;
use Carbon\Carbon;

class SenyMbayeSeeder extends Seeder
{
    public function run(): void
    {
        $role = Role::where('name', 'responsable')->first();
        
        $user = User::firstOrCreate(
            ['email' => 'seny.mbaye@convmanager.com'],
            [
                'name' => 'Sény Mbaye',
                'password' => bcrypt('password'),
                'role_id' => $role->id,
            ]
        );

        $conventions = [
            [
                'name' => 'Formation Fullstack JavaScript',
                'partners' => 'Université, Simplon, Sény Mbaye',
                'start_date' => Carbon::parse('2026-04-01'),
                'end_date' => Carbon::parse('2026-07-31'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Étudiants Certifiés', 'value' => 25, 'description' => 'Objectif de réussite.'],
                    ['name' => 'Projets Déployés', 'value' => 10, 'description' => 'Applications web réelles.'],
                ]
            ],
            [
                'name' => 'Développement Mobile Cross-Platform',
                'partners' => 'Tech Hub, Sény Mbaye',
                'start_date' => Carbon::parse('2026-05-15'),
                'end_date' => Carbon::parse('2026-09-15'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'App Store Submissions', 'value' => 5, 'description' => 'iOS & Android.'],
                    ['name' => 'Heures de Mentorat', 'value' => 120, 'description' => 'Accompagnement technique.'],
                ]
            ],
            [
                'name' => 'Audit Sécurité Web 2026',
                'partners' => 'ANSSI, Sény Mbaye',
                'start_date' => Carbon::parse('2026-08-01'),
                'end_date' => Carbon::parse('2026-10-01'),
                'status' => 'en attente',
                'kpis' => [
                    ['name' => 'Vulnérabilités Corrigées', 'value' => 15, 'description' => 'Critiques et majeures.'],
                    ['name' => 'Rapports d\'Audit', 'value' => 3, 'description' => 'Certification sécurité.'],
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
