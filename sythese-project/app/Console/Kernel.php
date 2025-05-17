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
    }

    /**
     * Enregistrer les commandes dans Artisan.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
