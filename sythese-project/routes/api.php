<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\PrestationController;
use App\Http\Controllers\AuthController;
use App\Models\Prestation;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ContactController;


//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');

Route::get('/services', [ServiceController::class, 'index']);


Route::get('/prestations', [PrestationController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);
// routes/api.php
Route::get('/prestataires/par-prestation/{id}', [PrestationController::class, 'parPrestation']);





Route::middleware('auth:sanctum')->post('/passer-commande', [CommandeController::class, 'store']);

Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);
// routes/api.php
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');


Route::get('/prestations', function () {
    return response()->json(Prestation::all());
});
Route::post('/user/{id}/update', [UserController::class, 'update']);



Route::get('/user/{id}', [UserController::class, 'show']);
Route::get('/user/{id}/reservations', [UserController::class, 'getUserReservations']);
Route::get('/user/{id}/paiements', [UserController::class, 'getUserPaiements']);


Route::post('/contact', [ContactController::class, 'store']);

