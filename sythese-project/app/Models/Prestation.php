<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prestation extends Model
{
    // Déclaration des attributs qui peuvent être remplis en masse
    protected $fillable = ['nom', 'description', 'disponible'];

    // Mutator pour enregistrer les valeurs '0' ou '1' en base de données
    public function setDisponibleAttribute($value)
    {
        $this->attributes['disponible'] = $value ? 1 : 0;
    }

    // Accessor pour récupérer la valeur de 'disponible' sous forme booléenne
    public function getDisponibleAttribute($value)
    {
        return $value == 1;
    }
    public function prestataires()
    {
        return $this->hasMany(Prestataire::class);
    }
}
