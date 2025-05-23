<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\PrestationController;
use App\Models\Paiement;






use App\Models\Prestation;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ContactController;

use App\Http\Controllers\Admin\PrestController;
use App\Http\Controllers\Admin\UserController;
use App\Models\User;
use App\Http\Controllers\Admin\PrestaController;
use App\Http\Controllers\Admin\ServController;
use Illuminate\Support\Facades\Storage;
use App\Models\Contact;
use App\Http\Controllers\Admin\ContaController;
use App\Http\Controllers\ReservationController;

use App\Http\Controllers\Admin\TyAbonnementController;
Route::prefix('type-abonnements')->group(function () {
    Route::get('/', [TyAbonnementController::class, 'index']);
    Route::post('/', [TyAbonnementController::class, 'store']);
    Route::put('/{id}', [TyAbonnementController::class, 'update']);
    Route::delete('/{id}', [TyAbonnementController::class, 'destroy']);
});
Route::apiResource('type-abonnements', TyAbonnementController::class);
//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');
Route::put('/users/update', function (Request $request) {
    $user = auth()->user(); // ou récupérer via session si pas de token

    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
    ]);

    $user->update([
        'name' => $request->name,
        'email' => $request->email,
    ]);

    return response()->json($user);
});
Route::put('/users/update', [UserController::class, 'update']);
Route::get('/services', [ServiceController::class, 'index']);


Route::get('/prestations', [PrestationController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);
Route::get('/prestataires/par-prestation/{id}', [PrestationController::class, 'parPrestation']);





Route::middleware('auth:sanctum')->post('/passer-commande', [CommandeController::class, 'store']);

Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);
// routes/api.php
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');


Route::get('/prestations', function () {
    return response()->json(Prestation::all());
});
Route::post('/user/{id}/update', [clientController::class, 'update']);

Route::put('users/{id}', [UserController::class, 'update']);

Route::get('/user/{id}', [clientController::class, 'show']);
Route::get('/user/{id}/reservations', [clientController::class, 'getUserReservations']);
Route::get('/user/{id}/paiements', [clientController::class, 'getUserPaiements']);


Route::post('/contact', [ContactController::class, 'store']);

///////////////////////////////////////////prestataire kawtar///////////////////////////////////////////////////////////

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Prestataire\ProfileController;
use App\Http\Controllers\Prestataire\AbonnementController;
Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout',[AuthController::class,'logout']);
    Route::get('/prestataire/prestations', [ProfileController::class, 'afficherPrestationsAvecAssociation']);
    Route::post('/prestataire/prestations', [ProfileController::class, 'ajouterPrestation']);
    Route::delete('/prestataire/{prestataireId}/prestation/{prestationId}', [ProfileController::class, 'supprimerAssociation']);
    Route::get('/prestataire/reservations', [ProfileController::class, 'reservationsDuPrestataire']);
    Route::get('/prestataire/profil', [ProfileController::class, 'profil']);
    Route::put('/prestataire/modifier', [ProfileController::class, 'modifierProfil']);
    // Récupérer la liste des types d'abonnements
    Route::get('/type-abonnements', [AbonnementController::class, 'getTypesAbonnements']);
    // Vérifier le statut de l'abonnement du prestataire connecté
    Route::get('/abonnement/check-status', [AbonnementController::class, 'checkStatusConnected']);
    // Créer (payer) un nouvel abonnement
    Route::post('/abonnement', [AbonnementController::class, 'store']);


    Route::get('/prestataire/dashboard', [ProfileController::class, 'dashboard']);
    

});
///////////////////////////////////////////prestataire kawtar///////////////////////////////////////////////////////////



use App\Http\Controllers\Admin\StatisticController;
use App\Http\Controllers\Admin\ReservController;

Route::get('/reservations', [ReservController::class, 'index']);

use App\Http\Controllers\Admin\ReservationStatController;





// Routes API dans routes/api.php

use App\Models\Service;
use App\Models\Reservation;



// routes/api.php
Route::apiResource('services', App\Http\Controllers\Admin\ServController::class);
Route::get('/prestations', function () {
    return App\Models\Prestation::where('disponible', 1)->get();
});

Route::get('/dashboard/stats', function () {
    return response()->json([
        'totalClients' => User::where('role', 'client')->count(),
        'totalPrestataires' => User::where('role', 'prestataire')->count(),
        'totalPrestations' => Prestation::count(),
        'totalServices' => Service::count(),
        'totalContacts' => Contact::count(),
        'totalReservations' => Reservation::count(),
    ]);
});

Route::get('/reservations/statistics', [ReservationStatController::class, 'index']);

Route::get('/reservations', [ReservController::class, 'index']);

Route::get('/contacts/latest', [ContaController::class, 'latest']);
Route::post('/contacts', [ContaController::class, 'store']);
Route::get('/contacts/{id}', [ContaController::class, 'show']); // si besoin

Route::get('/prestataires/photos/{filename}', function ($filename) {
    $path = storage_path('app/' . $filename);

    if (file_exists($path)) {
        return response()->file($path);
    }

    return response()->json(['message' => 'Image not found'], 404);
});


Route::get('/contacts/latest', function () {
    return Contact::orderBy('created_at', 'desc')->take(4)->get();
});
Route::get('/prestations-disponibles', [PrestaController::class, 'disponibles']);
Route::get('/users/latest-clients', function () {
    return User::where('role', 'client')
        ->latest()
        ->take(4)
        ->get(['id', 'name', 'email', 'created_at']);
});
Route::get('/user-stats', [StatisticController::class, 'index']);
// Routes API pour Service
Route::get('/services', [ServController::class, 'index']);       // Lister tous les services
Route::post('/services', [ServController::class, 'store']);      // Ajouter un nouveau service
Route::post('/services/{service}', [ServController::class, 'update']); // Modifier un service (via _method=PUT)
Route::delete('/services/{service}', [ServController::class, 'destroy']); // Supprimer un service

Route::delete('/users/{id}', [UserController::class, 'destroy']);
Route::apiResource('services', ServController::class);



Route::get('/users', function () {
    return User::all(); // renvoie tous les utilisateurs
});

Route::post('users', [UserController::class, 'store']);  // Créer un utilisateur

// Routes pour les prestataires
Route::post('prestataires', [PrestController::class, 'store']);  // Créer un prestataire
Route::get('prestataires', [PrestController::class, 'index']);  // Récupérer tous les prestataires
Route::get('prestataires/{id}', [PrestController::class, 'show']);  // Récupérer un prestataire par ID
Route::put('prestataires/{id}', [PrestController::class, 'update']);  // Modifier un prestataire
Route::delete('prestataires/{id}', [PrestController::class, 'destroy']);  // Supprimer un prestataire
Route::get('/prestations', function () {
    return \App\Models\Prestation::select('id', 'nom', 'disponible')->get();
});
Route::put('/prestataires/{prestataire}/prestations/{prestation}/status', [PrestController::class, 'updateStatus']);


Route::resource('prestataires', PrestController::class);

Route::get('/prestations', [PrestaController::class, 'index']);
Route::post('prestations', [PrestaController::class, 'store']);
Route::get('/prestations/{id}', [PrestaController::class, 'show']);
Route::delete('/prestations/{id}', [PrestaController::class, 'destroy']);
Route::resource('prestations', PrestaController::class);
Route::put('/prestations/{id}', 'PrestaController@update');

Route::middleware('auth:sanctum')->get('/client/profile', [ClientController::class, 'getProfile']);

Route::get('/disponibilite', [ReservationController::class, 'verifierDisponibilite']);

Route::middleware('auth:sanctum')->get('/client/last-payment', function (Request $request) {
    $clientId = $request->user()->client->id ?? null;

    if (!$clientId) {
        return response()->json(['message' => 'Client non trouvé'], 404);
    }

$reservationIds = Reservation::where('user_id', $clientId)->pluck('id');

    $paiement = Paiement::whereIn('reservation_id', $reservationIds)
        ->orderByDesc('created_at')
        ->first();

    if (!$paiement) {
        return response()->json(null, 204);
    }

    return response()->json($paiement);
});
