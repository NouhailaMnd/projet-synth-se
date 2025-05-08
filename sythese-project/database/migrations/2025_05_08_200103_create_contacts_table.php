<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();             // Colonne id
            $table->string('nom');     // Colonne nom
            $table->string('email');   // Colonne email
            $table->text('message');   // Colonne message
            $table->timestamps();      // Colonnes created_at et updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
