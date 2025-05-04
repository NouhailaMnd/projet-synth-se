<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $fillable = [
        'name', 'email', 'password', 'role'
    ];

    public function prestataire()
    {
        return $this->hasOne(Prestataire::class);
    }
}
