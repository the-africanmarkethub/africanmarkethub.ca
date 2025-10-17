<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $table = 'bookings';

    /**
     * Mass assignable attributes
     */
    protected $fillable = [
        'customer_id',
        'vendor_id',
        'service_id',
        'address_id',
        'scheduled_at',
        'started_at',
        'completed_at',
        'delivery_method',
        'delivery_status',
        'payment_status',
        'vendor_payment_settlement_status',
        'payment_reference',
        'cancel_reason',
        'cancelled_by',
        'total',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'total' => 'decimal:2',
    ];
    /**
     * Constants for enums
     */
    const DELIVERY_METHODS = ['online', 'virtual', 'remote', 'onsite', 'pickup', 'delivery', 'hybrid'];
    const DELIVERY_STATUSES = ['processing', 'ongoing', 'delivered', 'cancelled', 'returned'];
    const PAYMENT_STATUSES = ['pending', 'cancelled', 'completed', 'refunded'];
    const VENDOR_SETTLEMENT_STATUSES = ['paid', 'unpaid', 'partial', 'disputed'];

    /**
     * Relationships
     */

    public function service()
    {
        return $this->belongsTo(Product::class);
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function vendor()
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    public function address()
    {
        return $this->belongsTo(AddressBook::class, 'address_id');
    }

    public function cancelledBy()
    {
        return $this->belongsTo(User::class, 'cancelled_by');
    }
}
