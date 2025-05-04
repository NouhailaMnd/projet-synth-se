<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prestataire extends Model
{
    protected $fillable = [
        'user_id', 'genre', 'telephone', 'prestation_id',
        'pays', 'ville', 'quartier', 'code_postal'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function prestation()
    {
        return $this->belongsTo(Prestation::class);
    }
}
