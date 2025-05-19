<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller; 

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::with('prestation')->get();
        return response()->json($services);
    }
    public function show($id)
    {
        $service = Service::with('prestation')->find($id);

        if (!$service) {
            return response()->json(['message' => 'Service non trouvé'], 404);
        }

        return response()->json($service);
    }
    
}
