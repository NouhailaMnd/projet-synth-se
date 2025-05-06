<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Prestation;
use App\Models\Prestataire;
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
        $prestataires = Prestataire::where('prestation_id', $prestation_id)->get();
        return response()->json($prestataires);
    }
}
