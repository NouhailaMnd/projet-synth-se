<?php

namespace App\Http\Controllers\Prestataire;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Abonnement;
use App\Models\TypeAbonnement;
use Carbon\Carbon;

use App\Models\Prestataire;

class AbonnementController extends Controller
{
    public function getTypesAbonnements()
    {
        $types = TypeAbonnement::all();
        return response()->json($types);
    }




    public function checkStatusConnected()
    {
         $user = auth()->user();

        $prestataireId = $user->prestataire->id;  // Ou la bonne méthode pour récupérer l'id du prestataire connecté

        $abonnement = Abonnement::where('prestataire_id', $prestataireId)
            ->orderBy('date_fin', 'desc')
            ->first();

        if (!$abonnement) {
            return response()->json([
                'status' => 'none',
                'message' => 'Aucun abonnement trouvé.'
            ]);
        }

        $aujourdhui = Carbon::today();
        $dateFin = Carbon::parse($abonnement->date_fin);

        $joursRestants = $aujourdhui->diffInDays($dateFin, false);

        if ($joursRestants < 0) {
            return response()->json([
                'status' => 'expiré',
                'message' => 'Votre abonnement est expiré.',
                'jours_restants' => 0,
            ]);
        } else {
            return response()->json([
                'status' => $abonnement->status,
                'jours_restants' => $joursRestants,
            ]);
        }
    }



    public function store(Request $request)
    {
        $request->validate([
            'type_abonnement_id' => 'required|exists:type_abonnements,id',
        ]);

        $user = auth()->user();
        if (!$user) {
            return response()->json([
                'error' => 'Utilisateur non authentifié.'
            ], 401);
        }

        $prestataire = $user->prestataire;
        if (!$prestataire) {
            return response()->json([
                'error' => 'Prestataire non trouvé pour cet utilisateur.'
            ], 404);
        }

        $prestataireId = $prestataire->id;

        // Vérification s'il a déjà un abonnement actif
        $abonnementActif = Abonnement::where('prestataire_id', $prestataireId)
        ->where(function ($query) {
            $query->where('status', 'actif')
                ->orWhere('date_fin', '>=',Carbon::today());
        })
        ->first();

        if ($abonnementActif) {
            $abonnementActif->load('typeAbonnement');  // Charge la relation typeAbonnement
            return response()->json([
                'message' => 'Vous avez déjà un abonnement actif.',
                'abonnement' => $abonnementActif,
                'user' => $user,
            ], 400);
        }

        // Création du nouvel abonnement
        $typeAbonnement = TypeAbonnement::findOrFail($request->type_abonnement_id);

        $dateDebut = Carbon::today();
        $dateFin = $dateDebut->copy()->addMonths($typeAbonnement->duree_mois);

        $abonnement = Abonnement::create([
            'prestataire_id' => $prestataireId,
            'type_abonnement_id' => $typeAbonnement->id,
            'date_debut' => $dateDebut,
            'date_fin' => $dateFin,
            'status' => 'actif',
        ]);

        $abonnement->load('typeAbonnement'); // Charge la relation typeAbonnement

        return response()->json([
            'message' => 'Abonnement créé avec succès.',
            'abonnement' => $abonnement,
            'user' => $user,
        ]);
    }


}
