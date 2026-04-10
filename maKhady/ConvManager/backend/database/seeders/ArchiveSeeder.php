<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Convention;
use App\Models\User;
use Carbon\Carbon;

class ArchiveSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@convmanager.com')->first();
        if (!$admin) return;

        $archives = [
            [
                'name' => 'Alliance Stratégique MIT-UIDT 2024',
                'type' => 'international',
                'partners' => 'MIT, UIDT, Ministère de l’Enseignement Supérieur',
                'start_date' => Carbon::parse('2024-01-01'),
                'end_date' => Carbon::parse('2024-12-31'),
                'status' => 'termine',
                'year' => 2024,
                'duration' => '12 mois',
                'user_id' => $admin->id,
            ],
            [
                'name' => 'Convention Cadre Orange Sénégal 2023',
                'type' => 'national',
                'partners' => 'Orange Sénégal, UIDT',
                'start_date' => Carbon::parse('2023-01-01'),
                'end_date' => Carbon::parse('2023-12-31'),
                'status' => 'termine',
                'year' => 2023,
                'duration' => '12 mois',
                'user_id' => $admin->id,
            ],
            [
                'name' => 'Projet Recherche Santé Sahel (Archivé)',
                'type' => 'international',
                'partners' => 'OMS, Institut Pasteur, UIDT',
                'start_date' => Carbon::parse('2022-06-01'),
                'end_date' => Carbon::parse('2023-06-01'),
                'status' => 'termine',
                'year' => 2022,
                'duration' => '12 mois',
                'user_id' => $admin->id,
            ],
        ];

        foreach ($archives as $archive) {
            Convention::create($archive);
        }
    }
}
