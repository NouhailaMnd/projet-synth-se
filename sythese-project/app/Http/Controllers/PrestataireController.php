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
        $request->validate([
            'email' => 'required|email|unique:users,email',
            'name' => 'required|string',
            'telephone' => 'required|string',
            'prestation_id' => 'nullable|exists:prestations,id',
            'password' => 'required|string|min:8',
            'genre' => 'nullable|string',
            'pays' => 'nullable|string',
            'ville' => 'nullable|string',
            'quartier' => 'nullable|string',
            'code_postal' => 'nullable|string'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        $prestataire = Prestataire::create([
            'user_id' => $user->id,
            'telephone' => $request->telephone,
            'prestation_id' => $request->prestation_id,
            'genre' => $request->genre,
            'pays' => $request->pays,
            'ville' => $request->ville,
            'quartier' => $request->quartier,
            'code_postal' => $request->code_postal,
        ]);

        return response()->json($prestataire, 201);
    }

    public function update(Request $request, $id)
    {
        $prestataire = Prestataire::findOrFail($id);
        $user = $prestataire->user;

        $request->validate([
            'telephone' => 'required|string',
            'genre' => 'nullable|string',
            'prestation_id' => 'required|exists:prestations,id',
            'pays' => 'nullable|string',
            'ville' => 'nullable|string',
            'quartier' => 'nullable|string',
            'code_postal' => 'nullable|string',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        $prestataire->update($request->only([
            'telephone', 'prestation_id', 'genre', 'pays', 'ville', 'quartier', 'code_postal',
        ]));

        return response()->json($prestataire->load('user'));
    }

    public function destroy($id)
    {
        $prestataire = Prestataire::findOrFail($id);
        $prestataire->delete();

        return response()->json(['message' => 'Prestataire supprimé avec succès']);
    }
}

