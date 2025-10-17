<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    protected $table = 'discounts';
    protected $fillable = [
        'product_id',
        'discount_code',
        'vendor_id',
        'start_time',
        'end_time',
        'discount_rate',
        'discount_type',
        'status',
        'notify_users',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function vendor()
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }
    
}
