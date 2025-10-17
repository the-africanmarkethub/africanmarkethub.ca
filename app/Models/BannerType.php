<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BannerType extends Model
{
    protected $table = 'banner_types';

    protected $fillable = [
        'name',
    ];

    public function banners()
    {
        return $this->hasMany(Banner::class, 'type', 'name');
    }
}
