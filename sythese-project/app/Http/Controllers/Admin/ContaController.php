<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;

class ContaController extends Controller
{
    /**
     * Récupérer les 4 derniers messages.
     */
    public function latest()
    {
        $contacts = Contact::orderBy('created_at', 'desc')
            ->take(4)
            ->get();

        return response()->json($contacts);
    }

    /**
     * Enregistrer un nouveau message.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        $contact = Contact::create([
            'nom' => $request->nom,
            'email' => $request->email,
            'message' => $request->message,
        ]);

        return response()->json([
            'message' => 'Message envoyé avec succès',
            'data' => $contact
        ], 201);
    }

    /**
     * Afficher un message spécifique (optionnel).
     */
    public function show($id)
    {
        $contact = Contact::findOrFail($id);
        return response()->json($contact);
    }
}
