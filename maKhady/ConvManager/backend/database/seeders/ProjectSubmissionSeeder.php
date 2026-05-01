<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Convention;
use App\Models\User;

class ProjectSubmissionSeeder extends Seeder
{
    public function run(): void
    {
        // Supprimer les conventions existantes pour éviter les doublons de num_dossier
        Convention::query()->delete();

        $idrissa = User::where('email', 'idrissa.gaye@uidt.sn')->first();
        $moussa = User::where('email', 'porteur@uidt.sn')->first();

        $year = date('Y');
        $globalCount = 0;

        if ($idrissa) {
            for ($i = 1; $i <= 6; $i++) {
                $globalCount++;
                $numDossier = "UIDT-{$year}-" . str_pad($globalCount, 3, '0', STR_PAD_LEFT);

                try {
                    Convention::create([
                        'name' => "Projet UIDT-IDR-00$i",
                        'type' => 'national',
                        'description' => "Description détaillée du projet $i de Dr. Idrissa Gaye.",
                        'objectives' => "Objectifs stratégiques du projet $i.",
                        'partners' => "Partenaire Académique $i",
                        'start_date' => now(),
                        'end_date' => now()->addYears(2),
                        'status' => 'soumis',
                        'user_id' => $idrissa->id,
                        'partner_type' => 'Public',
                        'year' => $year,
                        'duration' => 24,
                        'indicator' => 'Taux de réalisation',
                        'valeur_reference' => 0,
                        'target' => 100,
                        'num_dossier' => $numDossier
                    ]);
                } catch (\Exception $e) {
                    $this->command->error("Erreur Idrissa $i: " . $e->getMessage());
                }
            }
        }

        if ($moussa) {
            for ($i = 1; $i <= 7; $i++) {
                $globalCount++;
                $numDossier = "UIDT-{$year}-" . str_pad($globalCount, 3, '0', STR_PAD_LEFT);

                try {
                    Convention::create([
                        'name' => "Projet UIDT-MOU-00$i",
                        'type' => 'international',
                        'description' => "Description détaillée du projet $i de Dr. Moussa Ndiaye.",
                        'objectives' => "Développement de la coopération internationale pour le projet $i.",
                        'partners' => "Université Partenaire $i",
                        'start_date' => now(),
                        'end_date' => now()->addYears(3),
                        'status' => 'soumis',
                        'user_id' => $moussa->id,
                        'partner_type' => 'Public',
                        'year' => $year,
                        'duration' => 36,
                        'indicator' => 'Nombre d\'échanges',
                        'valeur_reference' => 0,
                        'target' => 10,
                        'num_dossier' => $numDossier
                    ]);
                } catch (\Exception $e) {
                    $this->command->error("Erreur Moussa $i: " . $e->getMessage());
                }
            }
        }
    }
}
