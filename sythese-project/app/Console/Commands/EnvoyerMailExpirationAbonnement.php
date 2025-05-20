<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Abonnement;
use App\Mail\AbonnementExpireBientotMail;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class EnvoyerMailExpirationAbonnement extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'abonnement:mail-expiration';
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Envoie un mail aux prestataires dont l\'abonnement expire dans 2 jours.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $dateCible = Carbon::now()->addDays(2)->toDateString();

        $abonnements = Abonnement::where('date_fin', $dateCible)
            ->where('status', 'actif')
            ->with('prestataire.user')
            ->get();

        foreach ($abonnements as $abonnement) {
            $prestataire = $abonnement->prestataire;

            if ($prestataire && $prestataire->user && $prestataire->user->email) {
                Mail::to($prestataire->user->email)
                    ->send(new AbonnementExpireBientotMail($abonnement, $prestataire));

                $this->info("Email envoyé à {$prestataire->user->email}");
            }
        }

        return 0;
    }
    
}
