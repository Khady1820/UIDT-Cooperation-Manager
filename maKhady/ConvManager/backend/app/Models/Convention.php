<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Convention extends Model
{
    use HasFactory;
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
                
                // Get the latest convention for this year to prevent duplicate IDs if rows are deleted
                $latest = static::where('num_dossier', 'like', "UIDT-{$year}-%")
                                ->orderBy('num_dossier', 'desc')
                                ->first();
                
                if ($latest) {
                    $parts = explode('-', $latest->num_dossier);
                    $count = intval(end($parts)) + 1;
                } else {
                    $count = 1;
                }
                
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

    /**
     * Calcule et met à jour le taux de réalisation global basé sur la moyenne des KPIs.
     */
    public function refreshCompletionRate()
    {
        if ($this->kpis()->count() > 0) {
            $average = $this->kpis()
                ->get()
                ->map(function ($kpi) {
                    if ($kpi->valeur_cible > 0) {
                        return min(100, ($kpi->valeur_atteinte / $kpi->valeur_cible) * 100);
                    }
                    return 0;
                })
                ->avg();
            
            $this->update(['completion_rate' => $average]);
        }
    }

    /**
     * Vérifie si la convention est actuellement active.
     */
    public function isActive(): bool
    {
        $today = now();
        return $this->status === 'en cours' && 
               (!$this->end_date || $this->end_date >= $today->toDateString());
    }

    /**
     * Scope pour filtrer les conventions actives en base de données.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'en cours')
                     ->where(function($q) {
                         $q->whereNull('end_date')
                           ->orWhere('end_date', '>=', now()->toDateString());
                     });
    }
}
