<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\CEntreprise;
use App\Models\Prestataire;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:client,prestataire,entreprise',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role,
        ]);

        // Créer les infos spécifiques selon le rôle
        if ($user->role === 'client') {
            $user->client()->create([
                'numero_telephone' => $request->numero_telephone,
                'pays' => $request->pays,
                'ville' => $request->ville,
                'quartier' => $request->quartier,
                'code_postal' => $request->code_postal,
            ]);
        } elseif ($user->role === 'prestataire') {
            $user->prestataire()->create([
                'telephone' => $request->telephone,
                'genre' => $request->genre,
                'pays' => $request->pays,
                'ville' => $request->ville,
                'quartier' => $request->quartier,
                'code_postal' => $request->code_postal,
                'photo'=>'null',
            ]);
        } elseif ($user->role === 'entreprise') {
            $user->cEntreprise()->create([
                'nom_entreprise' => $request->nom_entreprise,
                'secteur_activite' => $request->secteur_activite,
                'pays' => $request->pays,
                'ville' => $request->ville,
                'quartier' => $request->quartier,
                'code_postal' => $request->code_postal,
            ]);
        }

        return response()->json([
            'token' => $user->createToken('token-name')->plainTextToken,
            'user' => $user
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json([
            'token' => $user->createToken('token-name')->plainTextToken,
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnexion réussie']);
    }
    
}
