<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Convention;
use App\Notifications\ConventionStatusChanged;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();
        if (!$user) return;
        
        $convention = Convention::first();
        if (!$convention) return;

        // Status: Soumis
        $user->notify(new ConventionStatusChanged($convention, 'soumis', $user));
        
        // Status: Validé par Direction
        $user->notify(new ConventionStatusChanged($convention, 'valide_dir', $user));
        
        // Status: Signé par le Recteur
        $user->notify(new ConventionStatusChanged($convention, 'signe_recteur', $user));
        
        // Let's add an unread one
        $user->notify(new ConventionStatusChanged($convention, 'brouillon', $user));
    }
}
