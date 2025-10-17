<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $table = 'banners';

    protected $fillable = [
        'type',
        'banner',
        'banner_public_id',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
