<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\http\Controllers\AuthController;
use App\Http\Controllers\PrestataireController;
use App\Http\Controllers\UserController;
use App\Models\User;
use App\Http\Controllers\PrestationController;
use App\Http\Controllers\ServiceController;

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');



use App\Http\Controllers\StatisticController;
Route::get('/prestations-disponibles', [PrestationController::class, 'disponibles']);

Route::get('/user-stats', [StatisticController::class, 'index']);
// Routes API pour Service
Route::get('/services', [ServiceController::class, 'index']);       // Lister tous les services
Route::post('/services', [ServiceController::class, 'store']);      // Ajouter un nouveau service
Route::post('/services/{service}', [ServiceController::class, 'update']); // Modifier un service (via _method=PUT)
Route::delete('/services/{service}', [ServiceController::class, 'destroy']); // Supprimer un service

Route::delete('/users/{id}', [UserController::class, 'destroy']);
Route::apiResource('services', ServiceController::class);

Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);
Route::post('/logout',[AuthController::class,'logout'])->middleware('auth:sanctum');
// routes/api.php

Route::get('/users', function () {
    return User::all(); // renvoie tous les utilisateurs
});

Route::post('users', [UserController::class, 'store']);  // Créer un utilisateur

// Routes pour les prestataires
Route::post('prestataires', [PrestataireController::class, 'store']);  // Créer un prestataire
Route::get('prestataires', [PrestataireController::class, 'index']);  // Récupérer tous les prestataires
Route::get('prestataires/{id}', [PrestataireController::class, 'show']);  // Récupérer un prestataire par ID
Route::put('prestataires/{id}', [PrestataireController::class, 'update']);  // Modifier un prestataire
Route::delete('prestataires/{id}', [PrestataireController::class, 'destroy']);  // Supprimer un prestataire
Route::get('/prestations', function () {
    return \App\Models\Prestation::select('id', 'nom', 'disponible')->get();
});

Route::resource('prestataires', PrestataireController::class);


Route::get('/prestations', [PrestationController::class, 'index']);
Route::post('prestations', [PrestationController::class, 'store']);
Route::get('/prestations/{id}', [PrestationController::class, 'show']);
Route::delete('/prestations/{id}', [PrestationController::class, 'destroy']);
Route::resource('prestations', PrestationController::class);
Route::put('/prestations/{id}', 'PrestationController@update');