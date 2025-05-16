<?php
namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;


class TypeAbonnementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('type_abonnements')->insert([
        [
            'type' => 'Mensuel',
            'prix' => '100',
            'duree_mois' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ],
        [
            'type' => 'Trimestriel',
            'prix' => '270',
            'duree_mois' => 3,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ],
        [
            'type' => 'Annuel',
            'prix' => '1000',
            'duree_mois' => 12,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ],
    ]);
    }
}
