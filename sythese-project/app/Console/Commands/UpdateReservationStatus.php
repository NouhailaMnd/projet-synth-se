<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Reservation;
use Carbon\Carbon;

class UpdateReservationStatus extends Command
{
    protected $signature = 'reservations:update-status';
    protected $description = 'Met à jour automatiquement les statuts des réservations';

    public function handle()
{
    $today = now()->toDateString();

    // Mettre à jour les réservations en cours
    DB::table('reservations')
        ->where('status', 'enattente')
        ->whereDate('date_reservation', $today)
        ->update(['status' => 'encoure']);

    // Mettre à jour les réservations terminées
    DB::table('reservations')
        ->where('status', 'encoure')
        ->whereDate('date_reservation', '<', $today)
        ->update(['status' => 'terminé']);
}

}
