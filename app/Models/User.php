<?php

namespace App\Models;

use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;


class User extends Authenticatable
{
    use HasApiTokens, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'last_name',
        'phone',
        'email',
        'email_verified_at',
        'phone_verified_at',
        'password',
        'role',
        'is_active',
        'profile_photo',
        'google_id',
        'country',
        'state',
        'fcm_token',
        'city',
        'referral_code',
        'referred_by',
    ]; 

    protected $hidden = [
        'password',
        'remember_token',
    ];
 
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function address()
    {
        return $this->hasOne(AddressBook::class, 'customer_id');
    }

    public function wallet()
    {
        return $this->hasOne(Wallet::class, 'user_id');
    }

    public function isVendor()
    {
        return $this->role === 'vendor';
    }
    
    public function isCustomer()
    {
        return $this->role === 'customer';
    }
    
    public function shop()
    {
        return $this->hasOne(Shop::class, 'vendor_id', 'id');
    }
    
    public function orders()
    {
        return $this->hasMany(Order::class, 'user_id', 'id');
    }

    /**
     * Get the order items for the user.
     */
    public function cartItems(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'user_id', 'id');
    }
    
    public function settlementAccount()
    {
        return $this->hasOne(SettlementAccount::class, 'user_id');
    }
    public function referrals()
    {
        return $this->hasMany(Referral::class, 'referrer_id');
    }

    protected static function booted()
    {
        static::creating(function ($user) {
            if (empty($user->referral_code)) {
                do {
                    $code = strtoupper(Str::random(8));
                } while (User::where('referral_code', $code)->exists());

                $user->referral_code = $code;
            }
        });
    }
}