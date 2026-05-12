<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Role;
use App\Models\Convention;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ConventionWorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Initialisation des rôles nécessaires
        $roles = [
            'admin', 'porteur_projet', 'chef_division', 
            'directeur_cooperation', 'service_juridique', 
            'secretaire_general', 'recteur'
        ];
        
        foreach ($roles as $role) {
            Role::create(['name' => $role]);
        }
    }

    public function test_full_convention_lifecycle_workflow()
    {
        Storage::fake('public');

        // 1. Création par le Porteur de Projet
        $porteur = User::factory()->create(['role_id' => Role::where('name', 'porteur_projet')->first()->id]);
        Sanctum::actingAs($porteur);

        $file = UploadedFile::fake()->create('projet.docx', 500);
        $response = $this->postJson('/api/conventions', [
            'name' => 'Convention de Recherche Alpha',
            'type' => 'national',
            'start_date' => now()->toDateString(),
            'end_date' => now()->addYear()->toDateString(),
            'file' => $file
        ]);

        $response->assertStatus(201);
        $conventionId = $response->json('id');

        // Soumission
        $this->postJson("/api/conventions/{$conventionId}/submit")->assertStatus(200);
        $this->assertDatabaseHas('conventions', ['id' => $conventionId, 'status' => 'soumis']);

        // 2. Pré-validation par le Chef de Division
        $chef = User::factory()->create(['role_id' => Role::where('name', 'chef_division')->first()->id]);
        Sanctum::actingAs($chef);
        $this->postJson("/api/conventions/{$conventionId}/validate-chef", ['comment' => 'Avis favorable'])->assertStatus(200);

        // 3. Validation par le Directeur
        $directeur = User::factory()->create(['role_id' => Role::where('name', 'directeur_cooperation')->first()->id]);
        Sanctum::actingAs($directeur);
        $this->postJson("/api/conventions/{$conventionId}/validate-director")->assertStatus(200);

        // 4. Visa du Service Juridique
        $juridique = User::factory()->create(['role_id' => Role::where('name', 'service_juridique')->first()->id]);
        Sanctum::actingAs($juridique);
        $this->postJson("/api/conventions/{$conventionId}/validate-legal")->assertStatus(200);

        // 5. Finalisation par le Directeur (envoi au SG)
        Sanctum::actingAs($directeur);
        $this->postJson("/api/conventions/{$conventionId}/finalize-director")->assertStatus(200);

        // 6. Visa du Secrétaire Général (SG)
        $sg = User::factory()->create(['role_id' => Role::where('name', 'secretaire_general')->first()->id]);
        Sanctum::actingAs($sg);
        $this->postJson("/api/conventions/{$conventionId}/validate-sg", ['comment' => 'Visa accordé'])->assertStatus(200);

        // 7. Signature par le Recteur
        $recteur = User::factory()->create(['role_id' => Role::where('name', 'recteur')->first()->id]);
        Sanctum::actingAs($recteur);
        
        $signedFile = UploadedFile::fake()->create('convention_signee.pdf', 1000);
        $this->postJson("/api/conventions/{$conventionId}/sign-rector", [
            'signed_file' => $signedFile
        ])->assertStatus(200);

        // Vérification finale
        $this->assertDatabaseHas('conventions', [
            'id' => $conventionId,
            'status' => 'termine'
        ]);
    }
}
