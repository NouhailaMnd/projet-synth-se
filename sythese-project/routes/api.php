<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\PrestController;
use App\Http\Controllers\Admin\UserController;
use App\Models\User;
use App\Http\Controllers\Admin\PrestaController;
use App\Http\Controllers\Admin\ServController;
use Illuminate\Support\Facades\Storage;
//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');



use App\Http\Controllers\Admin\StatisticController;
// routes/api.php
use App\Http\Controllers\Admin\ReservController;

Route::get('/reservations', [ReservController::class, 'index']);

Route::get('/prestataires/photos/{filename}', function ($filename) {
    $path = storage_path('app/' . $filename);

    if (file_exists($path)) {
        return response()->file($path);
    }

    return response()->json(['message' => 'Image not found'], 404);
});

Route::get('/prestations-disponibles', [PrestaController::class, 'disponibles']);

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

Route::resource('prestataires', PrestController::class);


Route::get('/prestations', [PrestaController::class, 'index']);
Route::post('prestations', [PrestaController::class, 'store']);
Route::get('/prestations/{id}', [PrestaController::class, 'show']);
Route::delete('/prestations/{id}', [PrestaController::class, 'destroy']);
Route::resource('prestations', PrestaController::class);
Route::put('/prestations/{id}', 'PrestaController@update');