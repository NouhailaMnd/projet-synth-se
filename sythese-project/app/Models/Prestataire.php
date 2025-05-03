<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prestataire extends Model
{
    protected $fillable = [
        'user_id',
        'telephone',
        'prestation_id',
        'genre',
        'pays',
        'ville',
        'quartier',
        'code_postal',
        
    ];

    // Relation avec la prestation
    public function prestation()
    {
        return $this->belongsTo(Prestation::class);
    }

    // Relation avec l'utilisateur
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
