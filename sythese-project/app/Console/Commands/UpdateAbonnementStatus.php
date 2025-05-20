<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Abonnement;
use Carbon\Carbon;

class UpdateAbonnementStatus extends Command
{
    /**
     * Nom de la commande artisan.
     *
     * @var string
     */
    protected $signature = 'abonnement:update-status';

    /**
     * Description de la commande.
     *
     * @var string
     */
    protected $description = 'Met à jour le statut des abonnements expirés';

    /**
     * Exécution de la commande.
     */
    public function handle()
    {
        $today = Carbon::today();

        // Mettre à jour tous les abonnements dont la date de fin est passée
        $updated = Abonnement::where('status', 'actif')
            ->whereDate('date_fin', '<', $today)
            ->update(['status' => 'expiré']);

        $this->info("$updated abonnement(s) mis à jour comme expiré(s).");
    }
}
