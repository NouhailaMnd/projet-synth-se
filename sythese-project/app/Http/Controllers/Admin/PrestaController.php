<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller; 
use App\Models\Prestation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PrestaController extends Controller
{
    // Retourner toutes les prestations
    public function index()
    {
        return Prestation::all();
    }
    public function disponibles()
    {
        $prestations = Prestation::where('disponible', 1)->get();
        return response()->json($prestations);
    }
    // Ajouter une nouvelle prestation
    public function store(Request $request)
    {
        // Valider les données reçues
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'required|string',
            'disponible' => 'required|boolean',
        ]);

        try {
            // Créer la prestation
            $prestation = Prestation::create($validated);

            // Retourner la prestation créée avec un code de succès
            return response()->json($prestation, 201);
        } catch (\Exception $e) {
            // Log l'erreur dans le fichier de log
            Log::error('Erreur lors de l\'ajout de prestation: ' . $e->getMessage());

            // Retourner un message d'erreur avec des détails
            return response()->json([
                'error' => 'Erreur lors de l\'ajout de prestation',
                'message' => $e->getMessage(),
                'stack_trace' => $e->getTraceAsString(), // Affichage de la pile d'appels pour déboguer
            ], 500);
        }
    }

    // Afficher une prestation spécifique par ID
    public function show($id)
    {
        try {
            $prestation = Prestation::findOrFail($id);
            return response()->json($prestation);
        } catch (\Exception $e) {
            // Si la prestation n'est pas trouvée
            return response()->json(['message' => 'Prestation non trouvée pour l\'ID : ' . $id], 404);
        }
    }

    // Mettre à jour une prestation
    public function update(Request $request, $id)
    {
        // Vérifier si la prestation existe
        $prestation = Prestation::find($id);

        if (!$prestation) {
            // Retourner une erreur détaillée si la prestation n'existe pas
            return response()->json(['message' => 'Prestation non trouvée pour l\'ID : ' . $id], 404);
        }

        // Valider les données reçues
        try {
            $validated = $request->validate([
                'nom' => 'required|string|max:255',
                'description' => 'required|string',
                'disponible' => 'required|boolean',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Retourner les erreurs de validation détaillées
            return response()->json([
                'error' => 'Erreur de validation des données',
                'details' => $e->errors(),
            ], 422);
        }

        // Mise à jour des champs
        try {
            $prestation->update($validated);
            return response()->json($prestation);
        } catch (\Exception $e) {
            // Log l'erreur dans le fichier de log
            Log::error('Erreur lors de la mise à jour de prestation: ' . $e->getMessage());

            // Retourner un message d'erreur détaillé
            return response()->json([
                'error' => 'Erreur lors de la mise à jour de prestation',
                'message' => $e->getMessage(),
                'stack_trace' => $e->getTraceAsString(), // Affichage de la pile d'appels pour déboguer
            ], 500);
        }
    }

    // Supprimer une prestation
    public function destroy($id)
    {
        try {
            $prestation = Prestation::findOrFail($id);
            $prestation->delete();

            return response()->json(null, 204);
        } catch (\Exception $e) {
            // Log l'erreur dans le fichier de log
            Log::error('Erreur lors de la suppression de prestation: ' . $e->getMessage());

            // Retourner un message d'erreur avec des détails
            return response()->json([
                'error' => 'Erreur lors de la suppression de prestation',
                'message' => $e->getMessage(),
                'stack_trace' => $e->getTraceAsString(), // Affichage de la pile d'appels pour déboguer
            ], 500);
        }
    }
}
