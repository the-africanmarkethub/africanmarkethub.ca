<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserActivity extends Model
{
    protected $fillable = [
        'user_id',
        'role',
        'login_time',
        'activity',
        'ip',
        'location',
        'device'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    protected $table = 'user_activities';
}
