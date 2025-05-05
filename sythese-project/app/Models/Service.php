<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'nom',
        'description',
        'prestation_id',
        'prix',
        'photo',
    ];
    public function prestation()
    {
        return $this->belongsTo(Prestation::class);
    }

    

    public function serviceReservations()
    {
        return $this->hasMany(ServiceReservation::class);
    }

}
