<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Prestation;
use App\Models\PrestationPrestataire;

use App\Models\Prestataire;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;


class PrestController extends Controller
{
    // Récupérer tous les prestataires avec les prestations associées
public function index()
{
    $prestataires = Prestataire::with([
        'user', // charge la relation user
        'prestations' => function ($query) {
            $query->withPivot('document_justificatif', 'status_validation');
        }
    ])->get();

    // Modifier le chemin de la photo si besoin
    $prestataires->transform(function ($prestataire) {
        if ($prestataire->photo) {
            $prestataire->photo = asset('storage/' . $prestataire->photo);
        }
        return $prestataire;
    });

    return response()->json($prestataires);
}



    public function updateStatus(Request $request, $prestataireId, $prestationId)
    {
        // Valider le statut envoyé
        $request->validate([
            'status_validation' => 'required|in:en_attente,valide,refuse',
        ]);

        // Récupérer le prestataire
        $prestataire = Prestataire::findOrFail($prestataireId);

        // Mettre à jour la table pivot 'prestation_prestataire'
        $updated = $prestataire->prestations()->updateExistingPivot($prestationId, [
            'status_validation' => $request->input('status_validation'),
        ]);

        if ($updated) {
            return response()->json([
                'message' => 'Status mis à jour avec succès.',
                'status_validation' => $request->input('status_validation'),
            ]);
        }

        return response()->json([
            'message' => 'Erreur lors de la mise à jour du status.'
        ], 500);
    }



    // Ajouter un nouveau prestataire
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'telephone' => 'required|string|max:15',
            'genre' => 'required|string|max:10',
            'region' => 'required|string|max:100',
            'ville' => 'required|string|max:100',
            'quartier' => 'required|string|max:100',
            'code_postal' => 'required|string|max:10',
            'prestations' => 'required|array|min:1',
            'photo' => 'nullable|image|mimes:jpeg,jpg,png|max:2048'
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'prestataire',
        ]);
    
        $prestataire = new Prestataire([
            'user_id' => $user->id,
            'telephone' => $request->telephone,
            'genre' => $request->genre,
            'region' => $request->region,
            'ville' => $request->ville,
            'quartier' => $request->quartier,
            'code_postal' => $request->code_postal,
        ]);
    
        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            $photoPath = $photo->store('prestataires', 'public');  // Enregistrement dans le disque 'public'
            $prestataire->photo = $photoPath;  // Enregistrer le chemin relatif sans 'storage/'
        }
    
        $prestataire->save();
    
        foreach ($request->prestations as $prestationId) {
            $prestation = Prestation::find($prestationId);
            if ($prestation && $prestation->disponible == 0) {
                $prestation->disponible = 1;
                $prestation->save();
            }
        }
    
        $prestataire->prestations()->attach($request->prestations);
    
        return response()->json(['message' => 'Prestataire ajouté avec succès.', 'prestataire' => $prestataire], 201);
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
    
            // Vérifier si une photo est téléchargée et la mettre à jour
            if ($request->hasFile('photo')) {
                // Supprimer l'ancienne photo si elle existe
                if ($prestataire->photo) {
                    Storage::disk('public')->delete($prestataire->photo);  // Supprime le fichier avec le chemin relatif
                }
    
                // Enregistrer la nouvelle photo
                $photo = $request->file('photo');
                $photoPath = $photo->store('prestataires', 'public');
                $prestataire->photo = $photoPath;  // Mettre à jour le chemin relatif
            }
    
            // Sauvegarder les informations de l'utilisateur et du prestataire
            $prestataire->user->save();
            $prestataire->save();
    
            // Mise à jour de la relation avec les prestations (many-to-many)
            $prestataire->prestations()->sync($validated['prestations']);
    
            // Charger à nouveau les prestations associées et retourner une réponse avec le prestataire mis à jour
            $prestataire->load('prestations');
    
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

        // Supprimer la photo si elle existe
        if ($prestataire->photo) {
            Storage::disk('public')->delete($prestataire->photo);  // Supprime le fichier avec le chemin relatif
        }

        // Supprimer le prestataire et l'utilisateur
        $prestataire->delete();
        $user->delete();

        return response()->json([
            'message' => 'Prestataire supprimé avec succès.'
        ]);
    }
}


