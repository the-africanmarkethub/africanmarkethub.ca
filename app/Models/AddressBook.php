<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AddressBook extends Model
{
    protected $fillable = [
        'customer_id',
        'street_address',
        'city',
        'state',
        'zip_code',
        'country',
        'address_label',
        'phone'
    ];

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }
    
}
