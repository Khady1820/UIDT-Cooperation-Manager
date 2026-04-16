<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Convention;
use Carbon\Carbon;

class FixDossierNumbers extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $conventions = Convention::whereNull('num_dossier')
            ->orWhere('num_dossier', 'N/A')
            ->orderBy('created_at')
            ->get();

        foreach ($conventions as $convention) {
            $year = $convention->start_date ? Carbon::parse($convention->start_date)->year : ($convention->created_at->year ?? date('Y'));
            $count = Convention::where('num_dossier', 'like', "UIDT-{$year}-%")->count() + 1;
            $num = "UIDT-{$year}-" . str_pad($count, 3, '0', STR_PAD_LEFT);
            
            $convention->update(['num_dossier' => $num]);
            $this->command->info("Assigned {$num} to {$convention->name}");
        }
    }
}
