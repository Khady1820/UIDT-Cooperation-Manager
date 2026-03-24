<?php

use App\Models\Convention;
use App\Models\Kpi;

$conventions = [
    [
        'name' => 'Partenariat Technologique Innovant',
        'type' => 'Technique',
        'partners' => 'Google, Microsoft',
        'status' => 'en cours',
        'start_date' => '2024-01-15',
        'end_date' => '2025-12-31',
        'description' => 'Collaboration sur l\'IA et le Cloud.',
        'kpis' => [
            ['name' => 'Taux d\'intégration Cloud', 'value' => 85, 'description' => 'Progression du déploiement cloud.'],
            ['name' => 'Formation IA', 'value' => 70, 'description' => 'Personnel formé aux nouveaux outils.']
        ]
    ],
    [
        'name' => 'Coopération Académique Internationale',
        'type' => 'Académique',
        'partners' => 'Sorbonne, MIT',
        'status' => 'terminé',
        'start_date' => '2023-09-01',
        'end_date' => '2024-06-30',
        'description' => 'Echange d\'étudiants et de chercheurs.',
        'kpis' => [
            ['name' => 'Mobilité étudiante', 'value' => 95, 'description' => 'Objectif d\'échanges atteint.'],
            ['name' => 'Publications conjointes', 'value' => 80, 'description' => 'Articles de recherche publiés.']
        ]
    ],
    [
        'name' => 'Accord de Recherche et Développement',
        'type' => 'R&D',
        'partners' => 'CNRS, Tesla',
        'status' => 'en attente',
        'start_date' => '2024-03-01',
        'end_date' => '2026-03-01',
        'description' => 'Recherche sur les batteries nouvelle génération.',
        'kpis' => [
            ['name' => 'Transfert de technologie', 'value' => 45, 'description' => 'Brevets en cours de transfert.'],
            ['name' => 'Efficacité énergétique', 'value' => 30, 'description' => 'Amélioration des prototypes.']
        ]
    ]
];

foreach ($conventions as $cData) {
    $kpisData = $cData['kpis'];
    unset($cData['kpis']);
    
    $convention = Convention::create($cData);
    
    foreach ($kpisData as $kData) {
        $kData['convention_id'] = $convention->id;
        Kpi::create($kData);
    }
}

echo "3 conventions et leurs KPIs ont été ajoutés avec succès.";
