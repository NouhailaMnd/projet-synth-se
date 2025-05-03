<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CEntreprise extends Model
{
    use HasFactory;

    protected $table = 'c_entreprises';


    protected $fillable = [
        'user_id',
        'nom_entreprise',
        'secteur_activite',
        'pays',
        'ville',
        'quartier',
        'code_postal',
        
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

