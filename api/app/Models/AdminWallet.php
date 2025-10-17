<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminWallet extends Model
{
    protected $table = 'admin_wallets';
    protected $fillable = ['amount', 'source', 'reference', 'transaction_id'];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
