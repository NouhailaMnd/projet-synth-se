<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;  // <-- Ajoutez cette ligne
use App\Models\Prestation;




class Prestataire extends Model
{
    protected $fillable = [
        'user_id',
        'telephone',
        'genre',
        'pays',
        'ville',
        'quartier',
        'code_postal',
        'photo',
    ];
    use HasFactory;

    // Relation avec l'utilisateur
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function abonnements()
    {
        return $this->hasMany(Abonnement::class);
    }

    public function prestationPrestataires()
    {
        return $this->hasMany(PrestationPrestataire::class);
    }

    public function serviceReservations()
    {
        return $this->hasMany(ServiceReservation::class);
    }


    // Relation many-to-many avec les prestations (table pivot prestation_prestataire)
    use HasFactory;

    // app/Models/Prestataire.php
    public function prestations()
    {
        return $this->belongsToMany(Prestation::class, 'prestation_prestataire', 'prestataire_id', 'prestation_id')
                    ->where('disponible', 1);
    }
    
    
    

}
