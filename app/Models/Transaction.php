<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'reference',
        'sender_id',
        'receiver_id',
        'amount',
        'status',
        'type',
        'description',
        'transaction_data'
    ];

    protected $casts = [
        'transaction_data' => 'array',
        'amount' => 'decimal:2',
    ];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    
    public function settlementAccount()
    {
        return $this->belongsTo(SettlementAccount::class);
    }
}
