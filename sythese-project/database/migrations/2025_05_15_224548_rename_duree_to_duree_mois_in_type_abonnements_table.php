<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

public function up()
{
    Schema::table('type_abonnements', function (Blueprint $table) {
        $table->renameColumn('duree', 'duree_mois');
    });
}

public function down()
{
    Schema::table('type_abonnements', function (Blueprint $table) {
        $table->renameColumn('duree_mois', 'duree');
    });
}

};
