<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table = 'notifications';

    protected $fillable = [
        'receiver',
        'body',
        'image',
        'image_public_id',
        'cta',
        'delivery_status',
        'channel',
        'user_id',
        'delivered_to',
    ];
}
