<?php

// app/Http/Controllers/ServiceController.php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Prestation;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::with('prestation')->get();
        return response()->json($services);
    }

    
    public function store(Request $request)
{
    // Validation des données
    $request->validate([
        'nom' => 'required|string|max:255',
        'description' => 'nullable|string',
        'prestation_id' => 'required|exists:prestations,id',
        'prix' => 'required|numeric',
    ]);

    try {
        // Création unique avec chargement de la relation
        $service = Service::create($request->all());
        $service->load('prestation');

        return response()->json($service, 201);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Database error: ' . $e->getMessage()], 500);
    }
}

    
    
    

    public function show(Service $service)
    {
        return response()->json($service);
    }

    public function update(Request $request, Service $service)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'required|string',
            'prestation_id' => 'required|exists:prestations,id',
            'prix' => 'required|numeric',
        ]);

        $service->update($request->all());
        return response()->json($service);
    }

    public function destroy(Service $service)
    {
        $service->delete();
        return response()->json(null, 204);
    }
}
