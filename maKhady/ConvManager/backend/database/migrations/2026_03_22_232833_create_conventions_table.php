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
        Schema::create('conventions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('name');
            $table->enum('type', ['regional', 'national', 'international'])->default('international');
            $table->text('description')->nullable();
            $table->text('objectives')->nullable();
            $table->text('partners')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['brouillon', 'soumis', 'valide_dir', 'signe_recteur', 'rejete', 'termine', 'archive', 'en cours', 'en attente'])->default('brouillon');
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conventions');
    }
};
