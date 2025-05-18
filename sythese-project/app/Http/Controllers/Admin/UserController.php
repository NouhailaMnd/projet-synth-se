<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller; 
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Méthode pour créer un utilisateur
    public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users',
        'role' => 'required|string',
        'password' => 'required|string|min:6',
    ]);

    $validated['password'] = bcrypt($validated['password']);

    $user = User::create($validated);
    return response()->json($user, 201);
}

    

public function update(Request $request)
{
    $user = User::find($request->id);
    if (!$user) {
        return response()->json(['error' => 'Utilisateur introuvable'], 404);
    }

    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255|unique:users,email,' . $user->id,
    ]);

    $user->name = $request->name;
    $user->email = $request->email;
    $user->save();

    return response()->json($user);
}
    // Méthode pour supprimer un utilisateur
public function destroy($id)
{
    // Trouver l'utilisateur à supprimer
    $user = User::findOrFail($id);

    // Supprimer l'utilisateur
    $user->delete();

    // Retourner une réponse JSON pour confirmer la suppression
    return response()->json(['message' => 'Utilisateur supprimé avec succès.'], 200);
}

}

