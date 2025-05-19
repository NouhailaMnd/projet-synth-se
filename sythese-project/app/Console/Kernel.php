<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Déclare les commandes artisan personnalisées.
     *
     * @var array
     */
    protected $commands = [
        \App\Console\Commands\UpdateReservationStatus::class,
        \App\Console\Commands\UpdateAbonnementStatus::class,
        \App\Console\Commands\NotifierExpirationAbonnement::class, // ajoute ici ta commande de notification
    ];

    /**
     * Définir le planning des tâches artisan.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('reservations:update-status')->daily();
        $schedule->command('abonnement:update-status')->daily();
        $schedule->command('abonnement:check-expiration')->daily(); // ligne importante ajoutée
    }

    /**
     * Enregistrer les commandes dans Artisan.
     *
     * @return void
     */
  
}
