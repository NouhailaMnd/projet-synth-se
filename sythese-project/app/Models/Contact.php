<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'email',
        'message',
    ];

    // Vous pouvez également définir une règle de validation pour email, etc., selon vos besoins
}
