<?php

namespace App\Http\Controllers;

use App\Models\Prestation;
use App\Models\PrestationPrestataire;
use App\Models\Prestataire;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class PrestataireController extends Controller
{
    // Récupérer tous les prestataires avec les prestations associées
    public function index()
    {
        $prestataires = Prestataire::with('user', 'prestations')->get();
        return response()->json($prestataires);
    }

    // Ajouter un nouveau prestataire
    public function store(Request $request)
    {
        // Validation des données
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'telephone' => 'required|string|max:15',
            'genre' => 'required|string|max:10',
            'pays' => 'required|string|max:100',
            'ville' => 'required|string|max:100',
            'quartier' => 'required|string|max:100',
            'code_postal' => 'required|string|max:10',
            'prestations' => 'required|array|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Création de l'utilisateur
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'prestataire',  // Assignation du rôle "prestataire"
        ]);

        // Création du prestataire
        $prestataire = Prestataire::create([
            'user_id' => $user->id,
            'telephone' => $request->telephone,
            'genre' => $request->genre,
            'pays' => $request->pays,
            'ville' => $request->ville,
            'quartier' => $request->quartier,
            'code_postal' => $request->code_postal,
        ]);

        // Ajout des prestations associées au prestataire
        $prestataire->prestations()->attach($request->prestations);

        return response()->json([
            'message' => 'Prestataire ajouté avec succès.',
            'prestataire' => $prestataire
        ], 201);
    }

  // Exemple d'un contrôleur Laravel qui met à jour un prestataire avec des prestations
  public function update(Request $request, $id)
  {
      try {
          // Validation des données
          $validated = $request->validate([
              'name' => 'required|string|max:255',
              'email' => 'required|email',
              'telephone' => 'required|string',
              'genre' => 'nullable|string',
              'ville' => 'nullable|string',
              'quartier' => 'nullable|string',
              'code_postal' => 'nullable|string',
              'prestations' => 'required|array',
              'prestations.*' => 'exists:prestations,id' // Vérifie que chaque prestation existe
          ]);
  
          // Récupérer le prestataire à mettre à jour
          $prestataire = Prestataire::findOrFail($id);
  
          // Mise à jour des informations du prestataire
          $prestataire->user->name = $validated['name'];
          $prestataire->user->email = $validated['email'];
          $prestataire->telephone = $validated['telephone'];
          $prestataire->genre = $validated['genre'];
          $prestataire->ville = $validated['ville'];
          $prestataire->quartier = $validated['quartier'];
          $prestataire->code_postal = $validated['code_postal'];
  
          // Sauvegarder les informations de l'utilisateur et du prestataire
          $prestataire->user->save();
          $prestataire->save();
  
          // Mise à jour de la relation avec les prestations (many-to-many)
          $prestataire->prestations()->sync($validated['prestations']);
  
          // Retourner une réponse avec le prestataire mis à jour
          return response()->json($prestataire, 200);
  
      } catch (\Exception $e) {
          // Si une erreur se produit, retourner une réponse d'erreur
          return response()->json(['error' => $e->getMessage()], 500);
      }
  }
  


    // Supprimer un prestataire
    public function destroy($id)
    {
        // Récupérer le prestataire et l'utilisateur associés
        $prestataire = Prestataire::findOrFail($id);
        $user = $prestataire->user;

        // Supprimer les prestations associées
        $prestataire->prestations()->detach();

        // Supprimer le prestataire et l'utilisateur
        $prestataire->delete();
        $user->delete();

        return response()->json([
            'message' => 'Prestataire supprimé avec succès.'
        ]);
    }
}

