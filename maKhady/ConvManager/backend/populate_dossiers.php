<?php

use App\Models\Convention;
use Illuminate\Support\Facades\DB;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$conventions = Convention::whereNull('num_dossier')->orderBy('created_at')->get();

foreach ($conventions as $conv) {
    $year = $conv->created_at->format('Y');
    // Count how many we have in that year so far (including already numbered ones)
    $count = Convention::whereYear('created_at', $year)
        ->whereNotNull('num_dossier')
        ->count() + 1;
    
    $numDossier = "UIDT-{$year}-" . str_pad($count, 3, '0', STR_PAD_LEFT);
    $conv->update(['num_dossier' => $numDossier]);
    echo "Updated Convention #{$conv->id} with Dossier: {$numDossier}\n";
}

echo "Finished populating dossier numbers.\n";
