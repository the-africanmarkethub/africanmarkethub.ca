<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tutorial extends Model
{
    protected $fillable = [
        'title',
        'description',
        'video_url',
        'image_url',
        'image_public_id',
        'type',
        'status',
    ];
}
