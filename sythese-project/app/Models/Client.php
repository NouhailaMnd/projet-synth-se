<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    // Nom de la table (si différent du nom par défaut 'clients')
    protected $table = 'clients';

    // Colonnes que tu veux rendre mass-assignable
    protected $fillable = [
        'user_id',
        'numero_telephone',
        'pays',
        'ville',
        'quartier',
        'code_postal',
    ];

    // Définir la relation avec l'utilisateur
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
