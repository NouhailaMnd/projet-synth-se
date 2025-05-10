<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    protected $fillable = [
        'reservation_id',
        'montant',
        'methode_paiment',
        'date_paiement',
        'status',
    ];
    
    public function reservation()
{
    return $this->belongsTo(Reservation::class);
}

}
