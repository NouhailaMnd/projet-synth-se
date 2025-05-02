<?php
// app/Http/Controllers/PrestataireController.php

namespace App\Http\Controllers;

use App\Models\Prestataire;
use App\Models\User;
use Illuminate\Http\Request;

class PrestataireController extends Controller
{
    // Méthode pour créer un prestataire
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'genre' => 'nullable|string',
            'cin' => 'nullable|string',
            'adresse' => 'nullable|string',
            'telephone' => 'nullable|string',
            'disponibilites' => 'nullable|array',
        ]);
    
        $prestataire = Prestataire::create($validated);
        return response()->json($prestataire, 201);
    }
    


    // Méthode pour récupérer tous les prestataires
    public function index()
    {
        $prestataires = Prestataire::with('user')->get();
        return response()->json($prestataires);
    }

    // Méthode pour récupérer un prestataire par ID
    public function show($id)
    {
        $prestataire = Prestataire::with('user')->findOrFail($id);
        return response()->json($prestataire);
    }

    // Méthode pour mettre à jour un prestataire
  
    public function update(Request $request, $id)
{
    $prestataire = Prestataire::findOrFail($id);
    $user = $prestataire->user;

    // Valider les données
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => "required|email|unique:users,email,{$user->id}",
        'genre' => 'required|string',
        'cin' => "required|string|unique:prestataires,cin,{$prestataire->id}",
        'adresse' => 'nullable|string',
        'telephone' => 'nullable|string',
        'disponibilites' => 'nullable|array',
    ]);

    // Mettre à jour l'utilisateur lié
    $user->name = $request->name;
    $user->email = $request->email;
    $user->save();

    // Mettre à jour le prestataire
    $prestataire->update([
        'genre' => $request->genre,
        'cin' => $request->cin,
        'adresse' => $request->adresse,
        'telephone' => $request->telephone,
        'disponibilites' => $request->disponibilites,
    ]);

    return response()->json($prestataire->load('user'));
}


    // Méthode pour supprimer un prestataire
    public function destroy($id)
    {
        $prestataire = Prestataire::findOrFail($id);
        $prestataire->delete();
        return response()->json(['message' => 'Prestataire supprimé avec succès']);
    }
}
