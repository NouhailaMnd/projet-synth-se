<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reservation;
use App\Models\ServiceReservation;

class ReservationController extends Controller
{
    /**
     * Vérifie si une réservation existe déjà pour un utilisateur
     * pour un service, un prestataire et une date donnés.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
 public function verifierDisponibilite(Request $request)
{
    $serviceId = $request->service_id;
    $prestataireId = $request->prestataire_id;
    $date = $request->date;

    $existe = Reservation::where('date_reservation', $date)
        ->whereIn('status', ['enattente', 'encoure'])
        ->whereHas('serviceReservations', function ($q) use ($serviceId, $prestataireId) {
            $q->where('service_id', $serviceId)
              ->where('prestataire_id', $prestataireId);
        })
        ->exists(); // 🔁 Supprimé le filtre sur user_id

    return response()->json(['disponible' => !$existe]);
}

}
