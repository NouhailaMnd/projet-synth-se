<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceReservation;
use Illuminate\Http\Request;

class ReservController extends Controller
{
    public function index()
    {
        $reservations = ServiceReservation::with([
            'service',
            'service.prestation',       // Ajouté ici
            'reservation.user', // si tu as bien défini la relation "reservation" dans le modèle
            'prestataire.user'  // si tu as bien défini la relation "prestataire" dans le modèle
        ])->get();

        return response()->json($reservations);
    }
}
