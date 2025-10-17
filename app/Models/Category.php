<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';

    protected $fillable = [
        'name',
        'type',
        'image',
        'image_public_id',
        'slug',
        'description',
        'status',
        'banner',
        'banner_public_id',
        'parent_id',
    ];

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }
}
