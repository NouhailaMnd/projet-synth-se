<?php

namespace App\Http\Controllers\Prestataire;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Prestation;
use App\Models\Prestataire;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function afficherPrestationsAvecAssociation()
{
    // Récupérer le prestataire de l'utilisateur authentifié
    $prestataire = auth()->user()->prestataire;
    
    // Vérifier si le prestataire existe
    if (!$prestataire) {
        return response()->json(['message' => 'Aucun prestataire lié à cet utilisateur'], 404);
    }
    
    // Récupérer toutes les prestations
    $prestations = Prestation::all();
    
    // Récupérer les prestations associées au prestataire
    $prestationsAssociees = $prestataire->prestations->pluck('id')->toArray();
    
    // Associer le statut 'est_associee' à chaque prestation
    $prestations = $prestations->map(function ($prestation) use ($prestationsAssociees) {
        $prestation->est_associee = in_array($prestation->id, $prestationsAssociees);
        return $prestation;
    });
    
    // Retourner le prestataire avec ses prestations associées
    return response()->json([
        'prestataire' => $prestataire,
        'prestations' => $prestations
    ]);
}
    

    public function ajouterPrestation(Request $request)
    {
        // Récupérer l'utilisateur authentifié
        $user = auth()->user();
        
        // Vérifier si l'utilisateur a un prestataire associé
        $prestataire = $user->prestataire;

        if (!$prestataire) {
            return response()->json(['error' => 'Aucun prestataire associé à cet utilisateur.'], 400);
        }

        // Valider l'ID de la prestation
        $request->validate([
            'prestation_id' => 'required|exists:prestations,id',
        ]);

        $prestationId = $request->prestation_id;

        // Vérifier si la prestation est déjà associée au prestataire
        if ($prestataire->prestations()->where('prestation_id', $prestationId)->exists()) {
            return response()->json(['message' => 'Cette prestation est déjà associée à ce prestataire.']);
        }

        // Ajouter la prestation au prestataire
        $prestataire->prestations()->attach($prestationId);

        // Mettre à jour la colonne 'disponible' à 1 pour la prestation
        Prestation::where('id', $prestationId)->update(['disponible' => 1]);

        return response()->json(['message' => 'Prestation ajoutée avec succès !']);
    }

    public function supprimerAssociation($prestataireId, $prestationId)
    {
        // Récupérer le prestataire
        $prestataire = Prestataire::find($prestataireId);

        if (!$prestataire) {
            return response()->json(['message' => 'Prestataire non trouvé'], 404);
        }

        // Vérifier si la prestation existe
        $prestation = Prestation::find($prestationId);

        if (!$prestation) {
            return response()->json(['message' => 'Prestation non trouvée'], 404);
        }

        // Supprimer l'association entre le prestataire et la prestation
        $prestataire->prestations()->detach($prestationId);

        // Vérifier s'il reste encore des prestataires associés à cette prestation
        $nombrePrestataires = $prestation->prestataires()->count();

        // Mettre à jour la disponibilité en fonction du nombre d'associations restantes
        $prestation->update(['disponible' => $nombrePrestataires > 0 ? 1 : 0]);

        return response()->json(['message' => 'Association supprimée avec succès']);
    }

    public function reservationsDuPrestataire()
    {
        $user = auth()->user(); // L'utilisateur connecté
    
        // Récupérer le prestataire lié à cet utilisateur
        $prestataire = Prestataire::where('user_id', $user->id)->first();
    
        if (!$prestataire) {
            return response()->json(['message' => 'Prestataire non trouvé'], 404);
        }
    
        // Récupérer les réservations liées à ce prestataire avec info client et adresse
        $reservations = DB::table('service_reservation')
            ->join('reservations', 'service_reservation.reservation_id', '=', 'reservations.id')
            ->join('users', 'reservations.user_id', '=', 'users.id') // jointure avec le client
            ->join('clients', 'users.id', '=', 'clients.user_id') // jointure avec la table clients pour l'adresse
            ->join('services', 'service_reservation.service_id', '=', 'services.id')
            ->join('prestations', 'services.prestation_id', '=', 'prestations.id')
            ->select(
                'reservations.id as reservation_id',
                'reservations.date_reservation',
                'reservations.status',
    
                // Infos client
                'users.name as client_nom',
                'users.email as client_email',
                'clients.numero_telephone',
                'clients.pays',
                'clients.ville',
                'clients.quartier',
                'clients.code_postal',
    
                // Infos prestation
                'services.nom as service_nom',
                'prestations.nom as prestation_nom',
                'service_reservation.duree'
            )
            ->where('service_reservation.prestataire_id', $prestataire->id)
            ->get();
    
        return response()->json($reservations);
    }



    public function profil(Request $request)
    {
        $user = $request->user();
    
        $prestataire = $user->prestataire;
    
        return response()->json([
            'name' => $user->name,
            'email' => $user->email,
            'telephone' => $prestataire->telephone,
            'genre' => $prestataire->genre,
            'pays' => $prestataire->pays,
            'ville' => $prestataire->ville,
            'quartier' => $prestataire->quartier,
            'code_postal' => $prestataire->code_postal,
            'photo' => $prestataire->photo,
        ]);
    }
    


    public function modifierProfil(Request $request)
    {
        $user = $request->user();
        $prestataire = $user->prestataire;
    
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'telephone' => 'nullable|string',
            'genre' => 'nullable|in:homme,femme',
            'pays' => 'nullable|string',
            'ville' => 'nullable|string',
            'quartier' => 'nullable|string',
            'code_postal' => 'nullable|string',
            'motDePasseActuel' => 'nullable|string',
            'nouveauMotDePasse' => 'nullable|string|min:6|same:confirmationMotDePasse',
        ]);
    
        // Update User
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);
    
        // Update Prestataire
        $prestataire->update([
            'telephone' => $request->telephone,
            'genre' => $request->genre,
            'pays' => $request->pays,
            'ville' => $request->ville,
            'quartier' => $request->quartier,
            'code_postal' => $request->code_postal,
        ]);
    
        // Update Password
        if ($request->motDePasseActuel && $request->nouveauMotDePasse) {
            if (!Hash::check($request->motDePasseActuel, $user->password)) {
                return response()->json(['message' => 'Mot de passe actuel incorrect'], 422);
            }
    
            $user->update([
                'password' => Hash::make($request->nouveauMotDePasse)
            ]);
        }
    
        return response()->json(['message' => 'Profil mis à jour avec succès.']);
    }
    


}
