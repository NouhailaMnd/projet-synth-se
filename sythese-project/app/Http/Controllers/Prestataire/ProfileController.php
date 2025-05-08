<?php

namespace App\Http\Controllers\Prestataire;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Prestation;
use App\Models\Prestataire;

class ProfileController extends Controller
{
    public function afficherPrestationsAvecAssociation()
    {
        $prestataire = auth()->user()->prestataire;
    
        if (!$prestataire) {
            return response()->json(['message' => 'Aucun prestataire lié à cet utilisateur'], 404);
        }
    
        $prestations = Prestation::all();
    
        $prestationsAssociees = $prestataire->prestations->pluck('id')->toArray();
    
        $prestations = $prestations->map(function ($prestation) use ($prestationsAssociees) {
            $prestation->est_associee = in_array($prestation->id, $prestationsAssociees);
            return $prestation;
        });
        
    
        return response()->json($prestations);
    }
    

    public function ajouterPrestation(Request $request)
    {
        $prestataire = auth()->user();

        // Valider l'ID de la prestation
        $request->validate([
            'prestation_id' => 'required|exists:prestations,id',
        ]);

        // Ajouter la prestation au prestataire
        $prestataire->prestations()->attach($request->prestation_id);

        return response()->json(['message' => 'Prestation ajoutée avec succès !']);
    }


}
