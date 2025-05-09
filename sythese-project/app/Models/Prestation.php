<?php

namespace App\Models;

use App\Models\Prestataire;
use App\Models\Service;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;  // <-- Ajoutez cette ligne

class Prestation extends Model
{
    protected $fillable = [
        'nom',          // Nom de la prestation
        'description',  // Description de la prestation
        'disponible', 

    ];

      

    public function services()
    {
        return $this->hasMany(Service::class);
    }

    public function prestationPrestataires()
    {
        return $this->hasMany(PrestationPrestataire::class);
    }
    use HasFactory;

    public function prestataires()
    {
        return $this->belongsToMany(Prestataire::class, 'prestation_prestataire', 'prestation_id', 'prestataire_id');
    }

}
