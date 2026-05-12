<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class UserApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::create(['name' => 'admin']);
    }

    public function test_admin_can_list_users()
    {
        $admin = User::factory()->create([
            'role_id' => Role::where('name', 'admin')->first()->id
        ]);
        
        User::factory()->count(2)->create();

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/users');

        $response->assertStatus(200)
                 ->assertJsonCount(3); // 1 admin + 2 created users
    }

    public function test_non_admin_cannot_list_users()
    {
        Role::create(['name' => 'porteur_projet']);
        $user = User::factory()->create([
            'role_id' => Role::where('name', 'porteur_projet')->first()->id
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/users');

        $response->assertStatus(403);
    }
}
