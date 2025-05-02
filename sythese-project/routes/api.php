<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\http\Controllers\AuthController;
use App\Http\Controllers\PrestataireController;
use App\Http\Controllers\UserController;
//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');

Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);
Route::post('/logout',[AuthController::class,'logout'])->middleware('auth:sanctum');
// routes/api.php



Route::post('users', [UserController::class, 'store']);  // Créer un utilisateur

// Routes pour les prestataires
Route::post('prestataires', [PrestataireController::class, 'store']);  // Créer un prestataire
Route::get('prestataires', [PrestataireController::class, 'index']);  // Récupérer tous les prestataires
Route::get('prestataires/{id}', [PrestataireController::class, 'show']);  // Récupérer un prestataire par ID
Route::put('prestataires/{id}', [PrestataireController::class, 'update']);  // Modifier un prestataire
Route::delete('prestataires/{id}', [PrestataireController::class, 'destroy']);  // Supprimer un prestataire