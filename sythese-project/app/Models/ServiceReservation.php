<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceReservation extends Model
{
    // Spécifie le nom exact de la table
    protected $table = 'service_reservation';

    protected $fillable = [
        'service_id',
        'reservation_id',
        'prestataire_id',
        'duree',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function prestataire()
    {
        return $this->belongsTo(Prestataire::class);
    }
}
