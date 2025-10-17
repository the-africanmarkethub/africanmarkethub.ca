<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Withdrawal extends Model
{
    protected $fillable = ['vendor_id', 'amount', 'settlement_account_id', 'status'];

    public function vendor()
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    public function settlementAccount()
    {
        return $this->belongsTo(SettlementAccount::class, 'settlement_account_id');
    }

}
