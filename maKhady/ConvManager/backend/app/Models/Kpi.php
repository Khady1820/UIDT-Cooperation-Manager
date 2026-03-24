<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kpi extends Model
{
    protected $fillable = ['convention_id', 'name', 'value', 'description'];

    public function convention()
    {
        return $this->belongsTo(Convention::class);
    }
}
