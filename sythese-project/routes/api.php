<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\http\Controllers\AuthController;
use App\Http\Controllers\PrestataireController;
use App\Http\Controllers\UserController;
use App\Models\User;
use App\Http\Controllers\PrestationController;
//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');
Route::delete('/users/{id}', [UserController::class, 'destroy']);

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