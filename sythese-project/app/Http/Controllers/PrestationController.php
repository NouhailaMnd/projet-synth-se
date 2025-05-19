<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Prestation;
use App\Models\Prestataire;
use App\Models\PrestationPrestataire;
use Illuminate\Http\JsonResponse;

class PrestationController extends Controller
{
    public function index(): JsonResponse
    {
        $prestations = Prestation::where('disponible', 1)->get()->map(function ($prestation) {
            preg_match('/^([\p{So}\p{Emoji}])\s*(.+)$/u', $prestation->nom, $matches);
            return [
                'id' => $prestation->id,
                'icon' => $matches[1] ?? '🔧',
                'name' => $matches[2] ?? $prestation->nom,
                'full_name' => $prestation->nom,
                'description' => $prestation->description,
            ];
        });

        return response()->json($prestations);
    }

   public function parPrestation($prestation_id): JsonResponse
{
    $prestation = Prestation::findOrFail($prestation_id);

    // Charger uniquement les prestataires avec status_validation = 'valide'
    $prestataires = $prestation->prestataires()
        ->with('user')
        ->wherePivot('status_validation', 'valide') // 👈 ajoute ce filtre sur la table pivot
        ->get();

    return response()->json($prestataires);
}

    

}
