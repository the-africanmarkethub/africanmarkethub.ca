<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Preference extends Model
{
    protected $table = 'preferences';
    protected $fillable = ['customer_id', 'list'];

    protected function casts(): array
    {
        return [
            'list' => 'array', 
        ];
    }
}   
