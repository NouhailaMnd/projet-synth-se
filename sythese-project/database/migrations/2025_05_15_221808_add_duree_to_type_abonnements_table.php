<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // database/migrations/xxxx_xx_xx_add_duree_to_type_abonnements_table.php

public function up()
{
    Schema::table('type_abonnements', function (Blueprint $table) {
        $table->integer('duree')->default(1);
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('type_abonnements', function (Blueprint $table) {
            //
        });
    }
};
