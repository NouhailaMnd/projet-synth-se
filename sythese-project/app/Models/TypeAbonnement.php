<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TypeAbonnement extends Model
{
    protected $fillable = [
        'type',
        'prix',
    ];
    public function abonnements()
    {
        return $this->hasMany(Abonnement::class);
    }

    
}
