<?php

namespace App\Models;
use App\Models\Prestation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory; // ✅ AJOUTE CECI

class Service extends Model
{
    use HasFactory;
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
