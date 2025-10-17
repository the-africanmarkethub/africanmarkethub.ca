<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Color extends Model
{
    protected $fillable = ['name', 'hexcode'];

    public function productVariations()
    {
        return $this->hasMany(ProductVariation::class);
    }
}
