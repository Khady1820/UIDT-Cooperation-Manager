<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Convention extends Model
{
    protected $fillable = [
        'name', 'type', 'description', 'objectives', 'partners', 
        'start_date', 'end_date', 'status', 'user_id', 'rejection_reason',
        'partner_type', 'year', 'duration', 'indicator', 'valeur_reference', 'target', 
        'actual_value', 'completion_rate', 'observations', 'file_path',
        'num_dossier'
    ];

    protected static function booted()
    {
        static::creating(function ($convention) {
            if (!$convention->num_dossier) {
                $year = $convention->start_date ? \Carbon\Carbon::parse($convention->start_date)->year : date('Y');
                $count = static::where('num_dossier', 'like', "UIDT-{$year}-%")->count() + 1;
                $convention->num_dossier = "UIDT-{$year}-" . str_pad($count, 3, '0', STR_PAD_LEFT);
            }
        });
    }

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
