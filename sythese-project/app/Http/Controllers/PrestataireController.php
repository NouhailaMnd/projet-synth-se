<?php

namespace App\Http\Controllers;

use App\Models\Prestation;
use App\Models\Prestataire;
use App\Models\User;
use Illuminate\Http\Request;

class PrestataireController extends Controller
{
    public function index()
    {
        return response()->json([
            'prestataires' => Prestataire::with('user')->get(),
            'prestations' => Prestation::select('id', 'nom', 'disponible')->get(),
        ]);
    }

    public function store(Request $request)
    {
        // Validation des données envoyées par la requête
        $validatedData = $request->validate([
            'email' => 'required|email|unique:users,email',
            'name' => 'required|string',
            'telephone' => 'required|string',
            'prestation_id' => 'nullable|exists:prestations,id',
            'password' => 'required|string|min:8',
            'genre' => 'nullable|string',
            'pays' => 'nullable|string',
            'ville' => 'nullable|string',
            'quartier' => 'nullable|string',
            'code_postal' => 'nullable|string',
        ]);

        // Création de l'utilisateur avec les données validées
        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => bcrypt($validatedData['password']),
            'role' => 'prestataire', // Définir le rôle
        ]);

        // Création du prestataire associé à l'utilisateur
        $prestataire = Prestataire::create([
            'user_id' => $user->id,
            'telephone' => $validatedData['telephone'],
            'prestation_id' => $validatedData['prestation_id'],
            'genre' => $validatedData['genre'],
            'pays' => $validatedData['pays'],
            'ville' => $validatedData['ville'],
            'quartier' => $validatedData['quartier'],
            'code_postal' => $validatedData['code_postal'],
        ]);

        // Retourner la réponse avec les informations du prestataire créé
        return response()->json($prestataire, 201);
    }

    public function update(Request $request, $id)
    {
        // Trouver le prestataire existant par son ID
        $prestataire = Prestataire::findOrFail($id);
        $user = $prestataire->user;

        // Validation des données envoyées par la requête pour la mise à jour
        $validatedData = $request->validate([
            'telephone' => 'required|string',
            'genre' => 'nullable|string',
            'prestation_id' => 'required|exists:prestations,id',
            'pays' => 'nullable|string',
            'ville' => 'nullable|string',
            'quartier' => 'nullable|string',
            'code_postal' => 'nullable|string',
        ]);

        // Mise à jour des informations de l'utilisateur
        $user->update([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
        ]);

        // Mise à jour des informations du prestataire
        $prestataire->update($validatedData);

        // Retourner la réponse avec les informations du prestataire mis à jour
        return response()->json($prestataire->load('user'));
    }

    public function destroy($id)
    {
        // Trouver et supprimer le prestataire
        $prestataire = Prestataire::findOrFail($id);
        $prestataire->delete();

        // Retourner une réponse confirmant la suppression
        return response()->json(['message' => 'Prestataire supprimé avec succès']);
    }
}
