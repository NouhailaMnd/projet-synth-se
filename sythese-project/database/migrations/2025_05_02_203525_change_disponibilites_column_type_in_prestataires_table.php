<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeDisponibilitesColumnTypeInPrestatairesTable extends Migration
{
    public function up()
    {
        Schema::table('prestataires', function (Blueprint $table) {
            $table->json('disponibilites')->change();
        });
    }

    public function down()
    {
        Schema::table('prestataires', function (Blueprint $table) {
            $table->text('disponibilites')->change();
        });
    }
}
