<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kpi extends Model
{
    protected $fillable = [
        'convention_id', 'name', 'value', 'description', 
        'valeur_reference', 'valeur_cible', 'valeur_atteinte', 
        'frequence_mesure', 'responsable'
    ];

    public function convention()
    {
        return $this->belongsTo(Convention::class);
    }
}
