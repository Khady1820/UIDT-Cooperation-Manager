<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Convention;
use App\Models\User;
use Carbon\Carbon;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $porteur = User::whereHas('role', function($q) { $q->where('name', 'porteur_projet'); })->first();

        if (!$porteur) return;

        $convention = Convention::create([
            'name' => 'Projet de Démonstration : Modernisation du Réseau',
            'partners' => 'Partenaire Demo Tech',
            'type' => 'national',
            'status' => 'en cours',
            'indicator' => 'Postes Connectés',
            'target' => 100,
            'actual_value' => 65,
            'start_date' => Carbon::now()->subMonths(2),
            'end_date' => Carbon::now()->addMonths(10),
            'description' => 'Un exemple simple pour illustrer le suivi des indicateurs.',
            'user_id' => $porteur->id,
            'completion_rate' => 65
        ]);

        $convention->kpis()->create([
            'name' => 'Installation Matériel',
            'value' => 80,
            'description' => 'Taux d\'installation des équipements physiques.'
        ]);

        $convention->kpis()->create([
            'name' => 'Formation Utilisateurs',
            'value' => 40,
            'description' => 'Nombre d\'agents formés sur les nouveaux outils.'
        ]);
    }
}
