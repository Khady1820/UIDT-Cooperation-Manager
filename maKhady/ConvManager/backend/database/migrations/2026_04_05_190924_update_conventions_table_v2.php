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
        Schema::table('conventions', function (Blueprint $table) {
            $table->string('partner_type')->nullable()->after('type');
            $table->integer('year')->nullable()->after('partners');
            $table->string('duration')->nullable()->after('year');
            $table->string('indicator')->nullable()->after('duration');
            $table->decimal('target', 15, 2)->nullable()->after('indicator');
            $table->decimal('actual_value', 15, 2)->nullable()->after('target');
            $table->decimal('completion_rate', 8, 2)->nullable()->after('actual_value');
            $table->text('observations')->nullable()->after('completion_rate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('conventions', function (Blueprint $table) {
            $table->dropColumn(['partner_type', 'year', 'duration', 'indicator', 'target', 'actual_value', 'completion_rate', 'observations']);
        });
    }
};
