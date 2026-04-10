<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConventionLog extends Model
{
    protected $fillable = ['convention_id', 'user_id', 'action', 'comment'];

    public function convention()
    {
        return $this->belongsTo(Convention::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
