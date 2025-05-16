<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UpdateReservationStatus extends Command
{
    protected $signature = 'reservations:update-status';
    protected $description = 'Met à jour automatiquement les statuts des réservations';

    public function handle()
    {
        $today = Carbon::today()->toDateString();

        // Mettre à jour les réservations en attente dont la date est aujourd'hui
        DB::table('reservations')
            ->where('status', 'enattente')
            ->whereDate('date_reservation', $today)
            ->update(['status' => 'encoure']);

        // Mettre à jour les réservations en cours dont la date est dépassée
        DB::table('reservations')
            ->where('status', 'encoure')
            ->whereDate('date_reservation', '<', $today)
            ->update(['status' => 'terminé']);

        $this->info('Les statuts des réservations ont été mis à jour avec succès.');
    }
}
