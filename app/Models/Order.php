<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'customer_id',
        'vendor_id',
        'total',
        'payment_method',
        'shipping_status',
        'shipping_method',
        'shipping_fee',
        'tracking_number',
        'tracking_url',
        'shipping_date',
        'delivery_date',
        'payment_date',
        'payment_reference',
        'payment_status',
        'address_id',
        'cancel_reason',
        'vendor_payment_settlement_status',
    ];

    protected $casts = [
        'vendor_id' => 'array',
    ];
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }


    /**
     * Get the user that owns the order.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the customer who placed the order (alias of user).
     */
    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }


    /**
     * Get the shipping address for the order.
     */
    public function address()
    {
        return $this->belongsTo(AddressBook::class, 'address_id'); // ✅ Use address_id as foreign key
    }
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
