<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class StatisticController extends Controller
{
    public function index(Request $request)
    {
        $role = $request->input('role', 'client');
        $groupBy = $request->input('group_by', 'month');

        // Définir la requête de base
        $query = User::where('role', $role);

        // Appliquer le regroupement
        switch ($groupBy) {
            case 'day':
                $query->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as total'))
                    ->groupBy(DB::raw('DATE(created_at)'));
                break;
            case 'month':
                $query->select(DB::raw('MONTH(created_at) as month'), DB::raw('YEAR(created_at) as year'), DB::raw('count(*) as total'))
                    ->groupBy(DB::raw('MONTH(created_at), YEAR(created_at)'));
                break;
            case 'year':
                $query->select(DB::raw('YEAR(created_at) as year'), DB::raw('count(*) as total'))
                    ->groupBy(DB::raw('YEAR(created_at)'));
                break;
        }

        // Exécuter la requête et récupérer les résultats
        $stats = $query->get();

        // Retourner les résultats au frontend
        return response()->json($stats);
    }
}
