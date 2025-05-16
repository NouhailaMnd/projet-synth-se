<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Abonnement;
use Carbon\Carbon;

class UpdateAbonnementStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-abonnement-status';
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Met à jour les statuts des abonnements expirés';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Abonnement::where('status', 'actif')
            ->where('date_fin', '<', Carbon::today())
            ->update(['status' => 'expiré']);

        $this->info('Statuts des abonnements mis à jour.');
    }
}
