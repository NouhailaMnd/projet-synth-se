<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReservationStatController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type', 'day');

        try {
            $query = DB::table('reservations')
                ->selectRaw('COUNT(*) as count, status'); // On ajoute 'status' à la sélection

            // Appliquer le groupement par type de période (jour, mois, année)
            if ($type === 'day') {
                $query->selectRaw("DATE(date_reservation) as label")
                      ->groupBy(DB::raw("DATE(date_reservation)"), 'status')  // Groupement par date et par statut
                      ->orderBy('label', 'asc');
            } elseif ($type === 'month') {
                $query->selectRaw("DATE_FORMAT(date_reservation, '%Y-%m') as label")
                      ->groupBy(DB::raw("DATE_FORMAT(date_reservation, '%Y-%m')"), 'status')  // Groupement par mois et par statut
                      ->orderBy('label', 'asc');
            } elseif ($type === 'year') {
                $query->selectRaw("YEAR(date_reservation) as label")
                      ->groupBy(DB::raw("YEAR(date_reservation)"), 'status')  // Groupement par année et par statut
                      ->orderBy('label', 'asc');
            } else {
                return response()->json(['error' => 'Invalid type'], 400);
            }

            // Exécution de la requête et retour des résultats
            $results = $query->get();

            // Organiser les résultats par statut et période
            $groupedResults = [];

            // Ajouter les labels (périodes) de manière dynamique
            foreach ($results as $result) {
                if (!isset($groupedResults[$result->label])) {
                    $groupedResults[$result->label] = [
                        'enattente' => 0,
                        'confirme' => 0,
                        'encoure' => 0,
                        'termine' => 0,
                    ];
                }

                // Organiser les résultats par statut et période
                $groupedResults[$result->label][$result->status] = $result->count;
            }

            // Retourner les résultats au format JSON
            return response()->json($groupedResults);

        } catch (\Exception $e) {
            \Log::error("Erreur ReservationStatController: " . $e->getMessage());
            return response()->json(['error' => 'Erreur serveur'], 500);
        }
    }
}
