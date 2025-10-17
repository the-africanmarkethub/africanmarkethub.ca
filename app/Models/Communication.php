<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Communication extends Model
{
    protected $table = 'communications';
    protected $fillable = [
        'marketing_emails',
        'new_products',
        'promotions',
        'events',
        'user_id',
        'push_notification',
        'email_notification',
        'sms_notification',
    ];

    protected $casts = [
        'marketing_emails' => 'boolean',
        'new_products' => 'boolean',
        'promotions' => 'boolean',
        'events' => 'boolean',
        'push_notification' => 'boolean',
        'email_notification' => 'boolean',
        'sms_notification' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
