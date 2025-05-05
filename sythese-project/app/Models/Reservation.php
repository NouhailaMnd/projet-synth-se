<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{

    protected $fillable = [
        'user_id',
        'date_reservation',
        'status',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function serviceReservations()
    {
        return $this->hasMany(ServiceReservation::class);
    }

    public function paiements()
    {
        return $this->hasMany(Paiement::class);
    }
}
