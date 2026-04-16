<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;

class LegalUserSeeder extends Seeder
{
    public function run(): void
    {
        $legalRole = Role::where('name', 'service_juridique')->first();

        User::firstOrCreate(
            ['email' => 'juridique@uidt.sn'],
            [
                'name' => 'Service Juridique UIDT',
                'password' => bcrypt('password'),
                'role_id' => $legalRole->id ?? null,
            ]
        );
    }
}
