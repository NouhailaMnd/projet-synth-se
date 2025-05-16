<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatisticController extends Controller
{
    public function index(Request $request)
    {
        $groupBy = $request->input('group_by', 'month');

        // Choisir le champ de regroupement
        $selectLabel = match ($groupBy) {
            'day' => DB::raw('DATE(created_at) as label'),
            'month' => DB::raw("DATE_FORMAT(created_at, '%Y-%m') as label"),
            'year' => DB::raw('YEAR(created_at) as label'),
            default => DB::raw("DATE_FORMAT(created_at, '%Y-%m') as label"),
        };

        // Requête groupée pour les deux rôles
        $stats = DB::table('users')
            ->select(
                $selectLabel,
                DB::raw("SUM(CASE WHEN role = 'client' THEN 1 ELSE 0 END) as client"),
                DB::raw("SUM(CASE WHEN role = 'prestataire' THEN 1 ELSE 0 END) as prestataire")
            )
            ->groupBy('label')
            ->orderBy('label')
            ->get();

        return response()->json($stats);
    }
}
