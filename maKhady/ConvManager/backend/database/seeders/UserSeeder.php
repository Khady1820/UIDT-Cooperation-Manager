<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = \App\Models\Role::where('name', 'admin')->first();

        \App\Models\User::firstOrCreate(
            ['email' => 'admin@convmanager.com'],
            [
                'name' => 'Admin ConvManager',
                'password' => bcrypt('password'), // password
                'role_id' => $adminRole->id ?? null,
            ]
        );
    }
}
