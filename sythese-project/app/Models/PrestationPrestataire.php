<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrestationPrestataire extends Model
{
    protected $fillable = [
        'prestation_id',
        'prestataire_id',
    ];
    public function prestation()
    {
        return $this->belongsTo(Prestation::class);
    }

    public function prestataire()
    {
        return $this->belongsTo(Prestataire::class);
    }
}
