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
            $query = DB::table('reservations')->selectRaw('COUNT(*) as count');

            if ($type === 'day') {
                $query->selectRaw("DATE(date_reservation) as label")
                      ->groupBy(DB::raw("DATE(date_reservation)"))
                      ->orderBy('label', 'asc');
            } elseif ($type === 'month') {
                $query->selectRaw("DATE_FORMAT(date_reservation, '%Y-%m') as label")
                      ->groupBy(DB::raw("DATE_FORMAT(date_reservation, '%Y-%m')"))
                      ->orderBy('label', 'asc');
            } elseif ($type === 'year') {
                $query->selectRaw("YEAR(date_reservation) as label")
                      ->groupBy(DB::raw("YEAR(date_reservation)"))
                      ->orderBy('label', 'asc');
            } else {
                return response()->json(['error' => 'Invalid type'], 400);
            }

            return response()->json($query->get());

        } catch (\Exception $e) {
            \Log::error("Erreur ReservationStatController: " . $e->getMessage());
            return response()->json(['error' => 'Erreur serveur'], 500);
        }
    }
}
