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
    Schema::table('services', function (Blueprint $table) {
        $table->string('photo')->nullable(false)->change(); // Annule la modification de la colonne photo
    });
}

public function down()
{
    Schema::table('services', function (Blueprint $table) {
        $table->string('photo')->nullable()->change(); // Annule la modification si nécessaire
    });
}

};
