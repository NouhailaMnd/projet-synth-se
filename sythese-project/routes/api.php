<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\PrestationController;

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');

Route::get('/services', [ServiceController::class, 'index']);


Route::get('/prestations', [PrestationController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);
// routes/api.php
Route::get('/prestataires/par-prestation/{id}', [PrestationController::class, 'parPrestation']);



