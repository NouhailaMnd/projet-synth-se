<?php

namespace App\Http\Controllers\Prestataire;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Prestation;
use App\Models\Prestataire;
use App\Models\Service;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\Abonnement;

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
    
    // Récupérer les prestations associées au prestataire avec les données de la table pivot
    $prestationsAssociees = $prestataire->prestations()
        ->withPivot('document_justificatif')
        ->get()
        ->keyBy('id');
    
    // Associer le statut 'est_associee' et le document à chaque prestation
    $prestations = $prestations->map(function ($prestation) use ($prestationsAssociees) {
        $prestationAssociee = $prestationsAssociees->get($prestation->id);
        
        $prestation->est_associee = $prestationAssociee ? true : false;
        $prestation->document_justificatif = $prestationAssociee ? $prestationAssociee->pivot->document_justificatif : null;
        
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

    // Valider la requête
    $request->validate([
        'prestation_id' => 'required|exists:prestations,id',
        'document_justificatif' => 'required|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:2048',
    ]);

    $prestationId = $request->prestation_id;

    // Vérifier si la prestation est déjà associée au prestataire
    if ($prestataire->prestations()->where('prestation_id', $prestationId)->exists()) {
        return response()->json(['message' => 'Cette prestation est déjà associée à ce prestataire.'], 400);
    }

    // Enregistrer le document
    $documentPath = $request->file('document_justificatif')->store('documents_justificatifs', 'public');

    // Ajouter la prestation au prestataire avec le document
    $prestataire->prestations()->attach($prestationId, [
        'document_justificatif' => $documentPath,
    ]);

    // Mettre à jour la disponibilité
    DB::table('prestations')
    ->join('prestation_prestataire', 'prestations.id', '=', 'prestation_prestataire.prestation_id')
    ->where('prestation_prestataire.status_validation', 'valide')
    ->where('prestations.id', $prestationId)
    ->update(['prestations.disponible' => 1]);

    return response()->json([
        'message' => 'Prestation ajoutée avec succès !',
        'document_path' => $documentPath
    ]);
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
                'clients.region',
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
            'region' => $prestataire->region,
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
            'region' => 'nullable|string',
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
            'region' => $request->region,
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
    




    public function dashboard(Request $request)
{
    $user = $request->user();

    // Trouver le prestataire correspondant
    $prestataire = Prestataire::where('user_id', $user->id)->firstOrFail();

    // 🔁 Compter les prestations associées à ce prestataire
    $totalPrestations = DB::table('prestation_prestataire')
        ->where('prestataire_id', $prestataire->id)
        ->count();

    // 🛠️ Compter les services liés aux prestations du prestataire
    $serviceCount = DB::table('services')
        ->join('prestation_prestataire', 'services.prestation_id', '=', 'prestation_prestataire.prestation_id')
        ->where('prestation_prestataire.prestataire_id', $prestataire->id)
        ->count();

    // 📊 Statistiques des réservations faites auprès de ce prestataire
    $reservationStats = DB::table('service_reservation')
        ->join('reservations', 'service_reservation.reservation_id', '=', 'reservations.id')
        ->where('service_reservation.prestataire_id', $prestataire->id)
        ->select('reservations.status', DB::raw('count(*) as total'))
        ->groupBy('reservations.status')
        ->get();

    // 📅 Réservations par mois
    $reservationsByMonth = DB::table('service_reservation')
        ->join('reservations', 'service_reservation.reservation_id', '=', 'reservations.id')
        ->where('service_reservation.prestataire_id', $prestataire->id)
        ->select(DB::raw('MONTH(reservations.date_reservation) as month'), DB::raw('count(*) as total'))
        ->groupBy(DB::raw('MONTH(reservations.date_reservation)'))
        ->get();

    // 📦 Dernier abonnement avec type
    $abonnement = Abonnement::where('prestataire_id', $prestataire->id)
        ->with('typeAbonnement')
        ->latest()
        ->first();

    return response()->json([
        'total_prestations' => $totalPrestations,
        'total_services' => $serviceCount,
        'reservations_stats' => $reservationStats,
        'reservations_by_month' => $reservationsByMonth,
        'abonnement' => $abonnement,
        'prestataire_info' => $prestataire
    ]);
}




}
