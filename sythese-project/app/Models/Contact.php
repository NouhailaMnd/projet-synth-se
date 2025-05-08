<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    // Autoriser l'attribution de masse pour ces champs
    protected $fillable = ['nom', 'email', 'message'];
}
