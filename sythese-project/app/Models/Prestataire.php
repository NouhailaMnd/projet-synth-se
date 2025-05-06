<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prestataire extends Model
{
    protected $fillable = [
        'user_id',
        'telephone',
        'genre',
        'pays',
        'ville',
        'quartier',
        'code_postal',
        
    ];

    // Relation avec la prestation
    

    // Relation avec l'utilisateur
    public function user()
    {
        return $this->belongsTo(User::class);
    }


    public function abonnements()
    {
        return $this->hasMany(Abonnement::class);
    }

    public function prestationPrestataires()
    {
        return $this->hasMany(PrestationPrestataire::class);
    }
    
    public function prestations()
    {
        return $this->belongsToMany(Prestation::class, 'prestation_prestataire', 'prestataire_id', 'prestation_id');
    }

    public function serviceReservations()
    {
        return $this->hasMany(ServiceReservation::class);
    }
}
