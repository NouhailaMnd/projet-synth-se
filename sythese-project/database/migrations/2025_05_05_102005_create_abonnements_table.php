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
        Schema::create('abonnements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prestataire_id')->constrained()->onDelete('cascade');
            $table->foreignId('type_abonnement_id')->constrained('type_abonnements')->onDelete('cascade');
            $table->date('date_debut');
            $table->date('date_fin');
            $table->enum('status', ['actif', 'expiré'])->default('actif');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('abonnements');
    }
};
