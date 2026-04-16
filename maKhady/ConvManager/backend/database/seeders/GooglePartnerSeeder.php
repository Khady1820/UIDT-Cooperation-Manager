<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Convention;
use Carbon\Carbon;

class GooglePartnerSeeder extends Seeder
{
    public function run(): void
    {
        $role = Role::where('name', 'partenaire')->first();
        $admin = User::whereHas('role', function($q){ $q->where('name', 'admin'); })->first();
        
        $user = User::firstOrCreate(
            ['email' => 'google@partner.com'],
            [
                'name' => 'Google Cloud',
                'password' => bcrypt('password'),
                'role_id' => $role->id,
            ]
        );

        $conventions = [
            [
                'name' => 'Google Cloud Academy - Sénégal Edition',
                'partners' => 'Google Cloud, UIDT, UCAD',
                'start_date' => Carbon::parse('2026-02-01'),
                'end_date' => Carbon::parse('2026-12-15'),
                'status' => 'en cours',
                'indicator' => 'Certifications Cloud Délivrées',
                'target' => 1000,
                'actual_value' => 850,
                'kpis' => [
                    ['name' => 'Certifications GCP délilvrées', 'value' => 850, 'description' => 'Cloud Digital Leader & Associate.'],
                    ['name' => 'Laboratoires Pratiques (Qwiklabs)', 'value' => 5000, 'description' => 'Engagement technique.'],
                ]
            ],
            [
                'name' => 'IA Générative pour l\'Efficacité Administrative',
                'partners' => 'Google Cloud, ADIE',
                'start_date' => Carbon::parse('2026-04-15'),
                'end_date' => Carbon::parse('2026-10-15'),
                'status' => 'en cours',
                'indicator' => 'Projets IA Administratifs',
                'target' => 15,
                'actual_value' => 12,
                'kpis' => [
                    ['name' => 'Cas d\'Usage Déployés', 'value' => 12, 'description' => 'Vertex AI.'],
                    ['name' => 'Réduction Temps Traitement (%)', 'value' => 40, 'description' => 'Productivité.'],
                ]
            ],
            [
                'name' => 'Data Literacy Program - Public Sector',
                'partners' => 'Google Cloud, ENA Sénégal',
                'start_date' => Carbon::parse('2026-03-10'),
                'end_date' => Carbon::parse('2026-07-10'),
                'status' => 'en cours',
                'indicator' => 'Agents de l\'État Formés',
                'target' => 300,
                'actual_value' => 250,
                'kpis' => [
                    ['name' => 'Hauts Fonctionnaires Formés', 'value' => 250, 'description' => 'Culture de la donnée.'],
                    ['name' => 'Dashboards Décisionnels Créés', 'value' => 30, 'description' => 'Looker Studio.'],
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
