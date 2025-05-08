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

    // Méthode pour mettre à jour un utilisateur
    public function update(Request $request, $id)
    {
        // Trouver l'utilisateur à mettre à jour
        $user = User::findOrFail($id);

        // Validation des données
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8',  // Le mot de passe est facultatif pour la mise à jour
            'role' => 'required|string',
        ]);

        // Mise à jour des données de l'utilisateur
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password ? bcrypt($request->password) : $user->password, // Le mot de passe est mis à jour si fourni
            'role' => $request->role,
        ]);

        return response()->json($user, 200);
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

