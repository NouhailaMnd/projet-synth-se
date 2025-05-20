<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Prestation;
use App\Models\Prestataire;
use App\Models\PrestationPrestataire;
use Illuminate\Http\JsonResponse;
 use App\Models\Abonnement;

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

    $prestataires = $prestation->prestataires()
        ->with(['user', 'abonnements' => function ($query) {
            $query->where('status', 'actif');
        }])
        ->wherePivot('status_validation', 'valide')
        ->get()
        ->filter(function ($prestataire) {
            return $prestataire->abonnements->isNotEmpty(); // ✅ Garde uniquement les prestataires avec au moins un abonnement actif
        })
        ->values(); // Pour réindexer la collection

    return response()->json($prestataires);
}



    

}
