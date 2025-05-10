<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Reservation;
use App\Models\ServiceReservation;
use App\Models\Paiement;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CommandeController extends Controller
{
    public function store(Request $request)
    {
        $user = Auth::user(); // Déplacé ici AVANT utilisation
        $cart = $request->input('cart');

        Log::info('Payload reçu pour commande', [
            'user' => $user ? $user->id : null,
            'cart' => $cart,
            'methode' => $request->input('methode_paiment')
        ]);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non authentifié.'], 401);
        }

        if (!$cart || count($cart) === 0) {
            return response()->json(['message' => 'Le panier est vide.'], 400);
        }

        try {
            DB::beginTransaction();
            $dateChoisie = $cart[0]['date'] ;

            // 1. Créer la réservation
            $reservation = new Reservation();
            $reservation->user_id = $user->id;
            $reservation->date_reservation = $dateChoisie;
            $reservation->status = 'enattente';
            $reservation->save();

            // 2. Créer les services liés à la réservation
            foreach ($cart as $item) {
                $heures = floor($item['duree']);
                $minutes = ($item['duree'] - $heures) * 60;
                $duree = sprintf('%02d:%02d:00', $heures, $minutes);

                $serviceReservation = new ServiceReservation();
                $serviceReservation->service_id = $item['id'];
                $serviceReservation->reservation_id = $reservation->id;
                $serviceReservation->prestataire_id = $item['prestataire_id'];
                $serviceReservation->duree = $duree;
                $serviceReservation->save();
            }

            // 3. Ajouter le paiement
            $montantTotal = array_reduce($cart, function ($total, $item) {
                return $total + floatval($item['total']);
            }, 0);

            $paiement = new Paiement();
            $paiement->reservation_id = $reservation->id;
            $paiement->montant = $montantTotal;
            $paiement->methode_paiment = $request->input('methode_paiment', 'carte');
            $paiement->date_paiement = Carbon::now()->format('Y-m-d');
            $paiement->status = 'payé';
            $paiement->save();

            DB::commit();

            return response()->json([
                'message' => 'Commande enregistrée avec succès.',
                'reservation_id' => $reservation->id
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Erreur commande: " . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de l’enregistrement de la commande.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
