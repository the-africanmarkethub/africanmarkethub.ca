<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $table = 'subscriptions';

    protected $fillable = [
        'name',
        'monthly_price',
        'yearly_price',
        'features',
        'payment_link',
    ];
}
