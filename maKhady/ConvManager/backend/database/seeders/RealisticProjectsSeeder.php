<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Convention;
use App\Models\User;
use App\Models\ConventionLog;
use Carbon\Carbon;

class RealisticProjectsSeeder extends Seeder
{
    public function run(): void
    {
        $porteur = User::where('email', 'porteur@uidt.sn')->first();
        if (!$porteur) return;

        $projects = [
            [
                'name' => 'Digitalisation Intégrale du Campus UIDT',
                'partners' => 'Sonatel Orange, Huawei',
                'type' => 'national',
                'status' => 'en cours',
                'indicator' => 'Couverture WiFi (%)',
                'target' => 100,
                'actual_value' => 75,
                'description' => 'Déploiement de la fibre optique et du WiFi haute performance dans tous les pavillons et salles de cours.',
                'kpis' => [
                    ['name' => 'Points d\'accès installés', 'value' => 85, 'description' => 'Installation des équipements réseau.'],
                    ['name' => 'Utilisateurs connectés', 'value' => 90, 'description' => 'Nombre d\'étudiants utilisant le réseau.'],
                ]
            ],
            [
                'name' => 'Centre de Recherche en Agriculture Durable (CRAD)',
                'partners' => 'FAO, AGRA',
                'type' => 'international',
                'status' => 'en attente',
                'indicator' => 'Hectares Expérimentaux',
                'target' => 50,
                'actual_value' => 10,
                'description' => 'Création d\'un centre de recherche sur les techniques agricoles adaptées au climat du Sénégal.',
                'kpis' => [
                    ['name' => 'Systèmes d\'irrigation', 'value' => 20, 'description' => 'Mise en place de l\'arrosage automatique.'],
                ]
            ],
            [
                'name' => 'Programme de Mobilité Académique "Pont vers l\'Europe"',
                'partners' => 'Erasmus+, Université de Montpellier',
                'type' => 'international',
                'status' => 'termine',
                'indicator' => 'Bourses Octroyées',
                'target' => 25,
                'actual_value' => 25,
                'description' => 'Échange d\'étudiants et d\'enseignants pour renforcer la coopération académique internationale.',
                'kpis' => [
                    ['name' => 'Étudiants en départ', 'value' => 100, 'description' => 'Taux de départ des boursiers.'],
                    ['name' => 'Accords signés', 'value' => 100, 'description' => 'Validation des conventions spécifiques.'],
                ]
            ],
            [
                'name' => 'Incubateur de Startups "Thiès Tech Hub"',
                'partners' => 'DER, Gainde 2000',
                'type' => 'national',
                'status' => 'en cours',
                'indicator' => 'Startups Incubées',
                'target' => 15,
                'actual_value' => 8,
                'description' => 'Accompagnement des étudiants entrepreneurs dans la création de solutions numériques innovantes.',
                'kpis' => [
                    ['name' => 'Mentors recrutés', 'value' => 60, 'description' => 'Experts accompagnant les projets.'],
                ]
            ],
            [
                'name' => 'Modernisation du Laboratoire de Génie Civil',
                'partners' => 'Eiffage Sénégal, CSTT',
                'type' => 'national',
                'status' => 'valide_juridique',
                'indicator' => 'Équipements de pointe',
                'target' => 10,
                'actual_value' => 4,
                'description' => 'Acquisition de matériel de test pour les matériaux de construction et formation des techniciens.',
                'kpis' => [
                    ['name' => 'Livraison matériel', 'value' => 40, 'description' => 'Réception des machines de test.'],
                ]
            ],
            [
                'name' => 'Projet Énergie Solaire pour l\'Autonomie Énergétique',
                'partners' => 'ANER, GIZ',
                'type' => 'international',
                'status' => 'en cours',
                'indicator' => 'Économie Énergie (%)',
                'target' => 40,
                'actual_value' => 15,
                'description' => 'Installation de panneaux solaires sur les toits des bâtiments administratifs pour réduire la facture électrique.',
                'kpis' => [
                    ['name' => 'Panneaux posés', 'value' => 30, 'description' => 'Installation physique des capteurs.'],
                ]
            ],
            [
                'name' => 'Réseau d\'Alumni UIDT Connect',
                'partners' => 'Association des Diplômés',
                'type' => 'national',
                'status' => 'en cours',
                'indicator' => 'Membres Inscrits',
                'target' => 2000,
                'actual_value' => 450,
                'description' => 'Mise en place d\'une plateforme pour connecter les anciens étudiants avec le monde professionnel.',
                'kpis' => [
                    ['name' => 'Entreprises partenaires', 'value' => 25, 'description' => 'Accords de stage via les alumni.'],
                ]
            ],
            [
                'name' => 'Bibliothèque Virtuelle et Accès aux Ressources Numériques',
                'partners' => 'AUF, UNESCO',
                'type' => 'international',
                'status' => 'termine',
                'indicator' => 'Ouvrages Accessibles',
                'target' => 50000,
                'actual_value' => 48000,
                'description' => 'Abonnement à des bases de données scientifiques et numérisation des thèses de l\'université.',
                'kpis' => [
                    ['name' => 'Base de données', 'value' => 100, 'description' => 'Accès aux revues internationales.'],
                ]
            ],
            [
                'name' => 'Unité de Soins et de Santé Universitaire',
                'partners' => 'Ministère de la Santé, Croix Rouge',
                'type' => 'national',
                'status' => 'en attente',
                'indicator' => 'Consultations Mensuelles',
                'target' => 300,
                'actual_value' => 0,
                'description' => 'Amélioration de la prise en charge médicale des étudiants et du personnel au sein du campus.',
                'kpis' => [
                    ['name' => 'Ambulances reçues', 'value' => 0, 'description' => 'Dotation en matériel de transport.'],
                ]
            ],
            [
                'name' => 'Observatoire de l\'Eau et de l\'Environnement',
                'partners' => 'IRD, Université de Dakar',
                'type' => 'national',
                'status' => 'en cours',
                'indicator' => 'Stations de Mesure',
                'target' => 8,
                'actual_value' => 3,
                'description' => 'Suivi de la qualité de l\'eau dans la région de Thiès et sensibilisation aux enjeux environnementaux.',
                'kpis' => [
                    ['name' => 'Analyses publiées', 'value' => 20, 'description' => 'Rapports scientifiques produits.'],
                ]
            ],
        ];

        foreach ($projects as $proj) {
            $kpis = $proj['kpis'] ?? [];
            unset($proj['kpis']);
            
            $proj['user_id'] = $porteur->id;
            $proj['num_dossier'] = 'UIDT-2026-' . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);
            $proj['completion_rate'] = ($proj['target'] > 0) ? ($proj['actual_value'] / $proj['target']) * 100 : 0;
            $proj['start_date'] = Carbon::now()->subMonths(rand(1, 12));
            $proj['end_date'] = Carbon::now()->addMonths(rand(12, 36));

            $convention = Convention::create($proj);

            foreach ($kpis as $kpi) {
                $convention->kpis()->create($kpi);
            }

            // Log creation
            ConventionLog::create([
                'convention_id' => $convention->id,
                'user_id' => $porteur->id,
                'action' => 'creation',
                'comment' => 'Dossier créé automatiquement pour démonstration.'
            ]);
        }
    }
}
