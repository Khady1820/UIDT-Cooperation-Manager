<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Convention;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ConventionTest extends TestCase
{
    use RefreshDatabase;
    /**
     * Teste si une convention est considérée comme active quand elle a le bon statut
     * et que la date de fin est dans le futur.
     */
    public function test_convention_is_active_when_status_is_en_cours_and_date_is_future()
    {
        // On crée une instance sans l'enregistrer en BDD (Unit test)
        $convention = new Convention([
            'status' => 'en cours',
            'end_date' => Carbon::now()->addDays(10)->toDateString()
        ]);

        $this->assertTrue($convention->isActive());
    }

    /**
     * Teste qu'une convention n'est pas active si son statut n'est pas 'en cours'.
     */
    public function test_convention_is_not_active_when_status_is_different()
    {
        $convention = new Convention([
            'status' => 'terminé',
            'end_date' => Carbon::now()->addDays(10)->toDateString()
        ]);

        $this->assertFalse($convention->isActive());
    }

    /**
     * Teste qu'une convention n'est pas active si la date de fin est passée.
     */
    public function test_convention_is_not_active_when_date_is_past()
    {
        $convention = new Convention([
            'status' => 'en cours',
            'end_date' => Carbon::now()->subDays(1)->toDateString()
        ]);

        $this->assertFalse($convention->isActive());
    }

    /**
     * Teste la génération automatique du numéro de dossier.
     */
    public function test_num_dossier_is_generated_on_creation()
    {
        $convention = Convention::create([
            'name' => 'Test Convention',
            'start_date' => '2026-01-01',
            'end_date' => '2027-01-01'
        ]);

        $this->assertNotNull($convention->num_dossier);
        $this->assertStringStartsWith('UIDT-2026-', $convention->num_dossier);
    }

    /**
     * Teste le calcul du taux de réalisation basé sur les KPIs.
     */
    public function test_refresh_completion_rate_calculates_average_of_kpis()
    {
        $convention = Convention::factory()->create();
        
        $convention->kpis()->create([
            'name' => 'KPI 1',
            'valeur_cible' => 100,
            'valeur_atteinte' => 50
        ]);

        $convention->kpis()->create([
            'name' => 'KPI 2',
            'valeur_cible' => 200,
            'valeur_atteinte' => 150
        ]);

        // (50/100)*100 = 50%
        // (150/200)*100 = 75%
        // Moyenne = (50 + 75) / 2 = 62.5%

        $convention->refreshCompletionRate();

        $this->assertEquals(62.5, $convention->completion_rate);
    }
}
