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
    Schema::table('prestataires', function (Blueprint $table) {
        $table->string('genre')->change(); // Si vous voulez un champ de texte de longueur appropriée
    });
}

public function down()
{
    Schema::table('prestataires', function (Blueprint $table) {
        $table->enum('genre', ['Masculin', 'Féminin'])->change(); // Si vous utilisez un enum
    });
}

};
