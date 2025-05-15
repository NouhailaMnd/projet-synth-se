<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TypeAbonnement;

class TyAbonnementController extends Controller
{
    // Déterminer la durée en fonction du type d'abonnement
    private function determineDuree($type)
    {
        return match($type) {
            'Abonnement mensuel' => 1,
            'Abonnement trimestriel' => 3,
            'Abonnement semestriel' => 6,
            'Abonnement annuel' => 12,
            default => 1, // Valeur par défaut
        };
    }

    // Liste tous les abonnements
    public function index()
    {
        return response()->json(TypeAbonnement::all());
    }

    // Créer un nouvel abonnement
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string|in:Abonnement mensuel,Abonnement trimestriel,Abonnement semestriel,Abonnement annuel',
            'prix' => 'required|numeric',
        ]);

        $duree = $this->determineDuree($request->type);

        $abonnement = TypeAbonnement::create([
            'type' => $request->type,
            'prix' => $request->prix,
            'duree_mois' => $duree,
        ]);

        return response()->json($abonnement, 201);
    }

    // Mettre à jour un abonnement existant
    public function update(Request $request, $id)
    {
        $request->validate([
            'type' => 'required|string|in:Abonnement mensuel,Abonnement trimestriel,Abonnement semestriel,Abonnement annuel',
            'prix' => 'required|numeric',
        ]);

        $abonnement = TypeAbonnement::findOrFail($id);
        $duree = $this->determineDuree($request->type);

        $abonnement->update([
            'type' => $request->type,
            'prix' => $request->prix,
            'duree_mois' => $duree,
        ]);

        return response()->json($abonnement);
    }

    // Supprimer un abonnement
    public function destroy($id)
    {
        $abonnement = TypeAbonnement::findOrFail($id);
        $abonnement->delete();

        return response()->json(null, 204);
    }
}
