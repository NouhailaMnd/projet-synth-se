<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Abonnement extends Model
{
    protected $fillable = [
        'prestataire_id',
        'type_abonnement_id',
        'date_debut',
        'date_fin',
        'status',
    ];
    
    public function prestataire()
    {
        return $this->belongsTo(Prestataire::class);
    }

    public function typeAbonnement()
    {
        return $this->belongsTo(TypeAbonnement::class);
    }
}
