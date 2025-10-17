<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SettlementAccount extends Model
{
    protected $table = 'settlement_accounts';

    protected $fillable = [
        'user_id',
        'name',
        'code',
        'institution_number',
        'transit_number',
        'account_number',
        'account_name',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
