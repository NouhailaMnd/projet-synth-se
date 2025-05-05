<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prestation extends Model
{
    protected $fillable = [
        'nom',
        'description',
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
}
