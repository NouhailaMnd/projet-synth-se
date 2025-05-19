<?php

namespace App\Models;

use App\Models\Prestation;
use App\Models\Prestataire;
use Illuminate\Database\Eloquent\Model;

class PrestationPrestataire extends Model
{
    protected $fillable = [
        'prestation_id',
        'prestataire_id',
        'document_justificatif',
        'status_validation',
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
