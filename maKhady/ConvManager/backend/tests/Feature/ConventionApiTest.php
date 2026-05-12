<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Convention;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class ConventionApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // On crée les rôles de base
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'porteur_projet']);
    }

    public function test_user_can_list_conventions()
    {
        $user = User::factory()->create([
            'role_id' => Role::where('name', 'porteur_projet')->first()->id
        ]);
        
        Convention::factory()->count(3)->create(['user_id' => $user->id]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/conventions');

        $response->assertStatus(200)
                 ->assertJsonCount(3);
    }

    public function test_porteur_can_create_convention()
    {
        $user = User::factory()->create([
            'role_id' => Role::where('name', 'porteur_projet')->first()->id
        ]);

        Sanctum::actingAs($user);

        \Illuminate\Support\Facades\Storage::fake('public');

        $file = \Illuminate\Http\UploadedFile::fake()->create('convention.docx', 100);

        $data = [
            'name' => 'Convention de test API',
            'type' => 'national',
            'start_date' => '2026-01-01',
            'end_date' => '2027-01-01',
            'status' => 'brouillon',
            'file' => $file
        ];

        $response = $this->postJson('/api/conventions', $data);

        $response->assertStatus(201)
                 ->assertJsonPath('name', 'Convention de test API');

        $this->assertDatabaseHas('conventions', [
            'name' => 'Convention de test API',
            'user_id' => $user->id
        ]);
    }

    public function test_guest_cannot_list_conventions()
    {
        $response = $this->getJson('/api/conventions');

        $response->assertStatus(401);
    }
}
