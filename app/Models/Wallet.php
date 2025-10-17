<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    protected $table = 'wallets';

    protected $fillable = [
        'user_id',
        'total_earning',
        'available_to_withdraw',
        'pending',
    ];

    //hide the created_at and updated_at
    protected $hidden = ['created_at', 'updated_at'];

    public function customer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function vendor()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
