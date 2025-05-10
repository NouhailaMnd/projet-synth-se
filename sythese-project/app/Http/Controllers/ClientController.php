<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Reservation;
use App\Models\Paiement;
use Illuminate\Http\Request;
use App\Models\Client;

class ClientController extends Controller
{
    public function show($id)
    {
        $user = User::with('client')->find($id);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        return response()->json([
            'user' => $user,
            'client' => $user->client,
        ]);
    }

    public function getUserReservations($id)
{
    $user = User::find($id);
    if (!$user) {
        return response()->json(['message' => 'Utilisateur non trouvé'], 404);
    }

    $reservations = Reservation::with('services.service', 'services.prestataire')
        ->where('user_id', $id)
        ->get();

    $formatted = [];

    foreach ($reservations as $reservation) {
        foreach ($reservation->services as $s) {
            $formatted[] = [
                'reservation_id' => $reservation->id,
                'date_reservation' => $reservation->date_reservation,
                'status' => $reservation->status,
                'duree' => $s->duree,
                'service_nom' => $s->service->nom ?? 'Non spécifié',
                'prestataire_nom' => $s->prestataire && $s->prestataire->user 
                    ? $s->prestataire->user->name 
                    : 'Non spécifié',
            ];
            
        }
    }

    return response()->json($formatted);
}


    public function getUserPaiements($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        $paiements = Paiement::whereHas('reservation', function ($q) use ($id) {
            $q->where('user_id', $id);
        })->get();

        return response()->json($paiements);
    }
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
    
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'numero_telephone' => 'nullable|string|max:255',
            'pays' => 'nullable|string|max:255',
            'ville' => 'nullable|string|max:255',
            'quartier' => 'nullable|string|max:255',
            'code_postal' => 'nullable|string|max:255',
        ]);
    
        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);
    
        $client = Client::firstOrNew(['user_id' => $user->id]);
        $client->fill([
            'numero_telephone' => $validated['numero_telephone'] ?? null,
            'pays' => $validated['pays'] ?? null,
            'ville' => $validated['ville'] ?? null,
            'quartier' => $validated['quartier'] ?? null,
            'code_postal' => $validated['code_postal'] ?? null,
        ]);
        $client->save();
    
        return response()->json(['message' => 'Profil mis à jour avec succès']);
    }
    

}
