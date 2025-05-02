<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Vérifier si les colonnes existent avant de les supprimer
            if (Schema::hasColumn('users', 'nom')) {
                $table->dropColumn('nom');
            }
            if (Schema::hasColumn('users', 'prenom')) {
                $table->dropColumn('prenom');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            // Ajouter les colonnes si nécessaire
            $table->string('nom')->nullable();
            $table->string('prenom')->nullable();
        });
    }
};
