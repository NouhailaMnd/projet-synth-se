<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Prestation;
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
            'user',
            'prestations' => function ($query) {
                $query->withPivot('document_justificatif', 'status_validation');
            }
        ])->get();

        $prestataires->transform(function ($prestataire) {
            if ($prestataire->photo) {
                $prestataire->photo = asset('storage/' . $prestataire->photo);
            }
            return $prestataire;
        });

        return response()->json($prestataires);
    }

    // Mettre à jour le statut de validation dans la table pivot
    public function updateStatus(Request $request, $prestataireId, $prestationId)
    {
        $request->validate([
            'status_validation' => 'required|in:en_attente,valide,refuse',
        ]);

        $prestataire = Prestataire::findOrFail($prestataireId);

        $updated = $prestataire->prestations()->updateExistingPivot($prestationId, [
            'status_validation' => $request->input('status_validation'),
        ]);

        if ($updated) {
            return response()->json([
                'message' => 'Statut mis à jour avec succès.',
                'status_validation' => $request->input('status_validation'),
            ]);
        }

        return response()->json([
            'message' => 'Erreur lors de la mise à jour du statut.'
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
            $photoPath = $photo->store('prestataires', 'public');
            $prestataire->photo = $photoPath;
        }

        $prestataire->save();

        return response()->json([
            'message' => 'Prestataire ajouté avec succès.',
            'prestataire' => $prestataire
        ], 201);
    }

    // ✅ Méthode pour mettre à jour un prestataire
    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email',
                'telephone' => 'required|string',
                'genre' => 'nullable|string',
                'ville' => 'nullable|string',
                'quartier' => 'nullable|string',
                'code_postal' => 'nullable|string',
                'prestations.*' => 'exists:prestations,id'
            ]);

            $prestataire = Prestataire::findOrFail($id);

            if (!$prestataire->user) {
                return response()->json(['error' => 'Utilisateur non trouvé pour ce prestataire.'], 404);
            }

            $prestataire->user->name = $validated['name'];
            $prestataire->user->email = $validated['email'];
            $prestataire->user->save();

            $prestataire->telephone = $validated['telephone'];
            $prestataire->genre = $validated['genre'];
            $prestataire->ville = $validated['ville'];
            $prestataire->quartier = $validated['quartier'];
            $prestataire->code_postal = $validated['code_postal'];

            if ($request->hasFile('photo')) {
                if ($prestataire->photo) {
                    Storage::disk('public')->delete($prestataire->photo);
                }
                $photo = $request->file('photo');
                $photoPath = $photo->store('prestataires', 'public');
                $prestataire->photo = $photoPath;
            }

            $prestataire->save();

        
            return response()->json($prestataire, 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ], 500);
        }
    }

    // Supprimer un prestataire
    public function destroy($id)
    {
        $prestataire = Prestataire::findOrFail($id);
        $user = $prestataire->user;

        $prestataire->prestations()->detach();

        if ($prestataire->photo) {
            Storage::disk('public')->delete($prestataire->photo);
        }

        $prestataire->delete();
        $user->delete();

        return response()->json([
            'message' => 'Prestataire supprimé avec succès.'
        ]);
    }
}
