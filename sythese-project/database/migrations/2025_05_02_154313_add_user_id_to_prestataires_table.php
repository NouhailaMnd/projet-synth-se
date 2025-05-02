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
        if (!Schema::hasColumn('prestataires', 'user_id')) {
            Schema::table('prestataires', function (Blueprint $table) {
                $table->unsignedBigInteger('user_id');
            });
        }
        
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prestataires', function (Blueprint $table) {
            //
        });
    }
};
