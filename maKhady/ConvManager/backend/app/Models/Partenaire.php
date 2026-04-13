<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Partenaire extends Model
{
    protected $fillable = ['name', 'type', 'email', 'telephone', 'address', 'country'];
}
