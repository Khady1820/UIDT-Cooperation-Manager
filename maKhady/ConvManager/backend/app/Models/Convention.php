<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Convention extends Model
{
    protected $fillable = ['name', 'partners', 'start_date', 'end_date', 'status'];

    public function kpis()
    {
        return $this->hasMany(Kpi::class);
    }
}
