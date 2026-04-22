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

                'password' => bcrypt('password'),
                'role_id' => \App\Models\Role::where('name', 'admin')->first()->id ?? null,
            ]
        );

        \App\Models\User::firstOrCreate(
            ['email' => 'porteur@uidt.sn'],
            [
                'name' => 'Dr. Moussa Ndiaye',
                'password' => bcrypt('password'),
                'role_id' => \App\Models\Role::where('name', 'porteur_projet')->first()->id ?? null,
            ]
        );

        \App\Models\User::firstOrCreate(
            ['email' => 'directeur@uidt.sn'],
            [
                'name' => 'Directeur Coopération',
                'password' => bcrypt('password'),
                'role_id' => \App\Models\Role::where('name', 'directeur_cooperation')->first()->id ?? null,
            ]
        );

        \App\Models\User::firstOrCreate(
            ['email' => 'recteur@uidt.sn'],
            [
                'name' => 'Recteur UIDT',
                'password' => bcrypt('password'),
                'role_id' => \App\Models\Role::where('name', 'recteur')->first()->id ?? null,
            ]
        );

        \App\Models\User::firstOrCreate(
            ['email' => 'juridique@uidt.sn'],
            [
                'name' => 'Service Juridique',
                'password' => bcrypt('password'),
                'role_id' => \App\Models\Role::where('name', 'service_juridique')->first()->id ?? null,
            ]
        );

        \App\Models\User::firstOrCreate(
            ['email' => 'chef@uidt.sn'],
            [
                'name' => 'Chef de Division',
                'password' => bcrypt('password'),
                'role_id' => \App\Models\Role::where('name', 'chef_division')->first()->id ?? null,
            ]
        );

        \App\Models\User::firstOrCreate(
            ['email' => 'secretariat@uidt.sn'],
            [
                'name' => 'Secrétariat Général',
                'password' => bcrypt('password'),
                'role_id' => \App\Models\Role::where('name', 'secretariat')->first()->id ?? null,
            ]
        );
    }
}
