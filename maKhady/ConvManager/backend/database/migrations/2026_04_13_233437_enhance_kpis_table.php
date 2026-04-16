<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('kpis', function (Blueprint $table) {
            $table->string('valeur_reference')->nullable();
            $table->string('valeur_cible')->nullable();
            $table->string('valeur_atteinte')->nullable();
            $table->string('frequence_mesure')->nullable(); // Ex: Annuel, Mensuel
            $table->string('responsable')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kpis', function (Blueprint $table) {
            $table->dropColumn([
                'valeur_reference', 
                'valeur_cible', 
                'valeur_atteinte', 
                'frequence_mesure', 
                'responsable'
            ]);
        });
    }
};
