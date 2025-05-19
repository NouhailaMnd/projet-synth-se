<?php

use Illuminate\Support\Facades\Route;

use App\Models\Abonnement;
use App\Mail\AbonnementExpireBientot;
use Illuminate\Support\Facades\Mail;

Route::get('/test-mail', function () {
    $abonnement = \App\Models\Abonnement::with('prestataire.user')->first();

    if (!$abonnement || !$abonnement->prestataire || !$abonnement->prestataire->user) {
        return "Aucun abonnement avec prestataire + user trouvé.";
    }

    $user = $abonnement->prestataire->user;

    Mail::to($user->email)->send(new AbonnementExpireBientot($abonnement));

    return "Email envoyé à " . $user->email;
});

Route::get('/', function () {
    return view('welcome');
});
