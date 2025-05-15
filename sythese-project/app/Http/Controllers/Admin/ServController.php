<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Prestation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ServController extends Controller
{
    // Lister tous les services avec leur prestation associée
    public function index()
    {
        $services = Service::with('prestation')->get();

        // Ajouter l'URL complète de la photo
        $services->transform(function ($service) {
            if ($service->photo) {
                $service->photo = asset('storage/' . $service->photo);
            }
            return $service;
        });

        return response()->json($services);
    }

    // Créer un nouveau service
    public function store(Request $request)
    {
        try {
            // Validation des données
            $validated = $request->validate([
                'nom' => 'required|string|max:255',
                'description' => 'required|string',
                'prestation_id' => 'required|exists:prestations,id',
                'prix' => 'required|numeric|min:0',
                'photo' => 'required|image|mimes:jpeg,jpg,png,gif|max:2048',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Erreur de validation.', 'errors' => $e->errors()], 422);
        }

        // Vérification et stockage de la photo
        if ($request->hasFile('photo') && $request->file('photo')->isValid()) {
            $validated['photo'] = $request->file('photo')->store('services', 'public');
        } else {
            return response()->json(['message' => 'Fichier photo manquant ou invalide.'], 400);
        }

        // Création du service
        $service = Service::create($validated);

        return response()->json([
            'message' => 'Service créé avec succès.',
            'service' => $service
        ], 201);
    }

    // Mettre à jour un service existant
    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        try {
            // Validation des données
            $validated = $request->validate([
                'nom' => 'required|string|max:255',
                'description' => 'required|string',
                'prestation_id' => 'required|exists:prestations,id',
                'prix' => 'required|numeric|min:0',
                'photo' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:2048',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Erreur de validation.', 'errors' => $e->errors()], 422);
        }

        // Mise à jour de la photo si un nouveau fichier est fourni
        if ($request->hasFile('photo') && $request->file('photo')->isValid()) {
            // Supprimer l'ancienne photo
            if ($service->photo) {
                Storage::disk('public')->delete($service->photo);
            }
            $validated['photo'] = $request->file('photo')->store('services', 'public');
        }

        // Mise à jour des données
        $service->update($validated);

        return response()->json([
            'message' => 'Service mis à jour avec succès.',
            'service' => $service
        ]);
    }

    // Supprimer un service
    public function destroy($id)
    {
        $service = Service::findOrFail($id);

        // Supprimer la photo associée
        if ($service->photo) {
            Storage::disk('public')->delete($service->photo);
        }

        $service->delete();

        return response()->json(['message' => 'Service supprimé avec succès.']);
    }
}
