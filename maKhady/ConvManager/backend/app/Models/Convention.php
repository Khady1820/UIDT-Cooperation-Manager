<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Convention extends Model
{
    protected $fillable = [
        'name', 'type', 'description', 'objectives', 'partners', 
        'start_date', 'end_date', 'status', 'user_id', 'rejection_reason',
        'partner_type', 'year', 'duration', 'indicator', 'target', 
        'actual_value', 'completion_rate', 'observations', 'file_path'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function logs()
    {
        return $this->hasMany(ConventionLog::class);
    }

    public function kpis()
    {
        return $this->hasMany(Kpi::class);
    }
}
