<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shop extends Model
{
    protected $table = 'shops';

    protected $fillable = [
        'name',
        'slug',
        'address',
        'type',
        'logo',
        'banner',
        'logo_public_id',
        'banner_public_id',
        'description',
        'subscription_id',
        'state_id',
        'city_id',
        'country_id',
        'vendor_id',
        'category_id',
        'status',
    ];
    public function vendor()
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }
    public function products()
    {
        return $this->hasMany(Product::class, 'shop_id', 'id');
    }
    
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
    public function state()
    {
        return $this->belongsTo(State::class, 'state_id');
    }
    public function city()
    {
        return $this->belongsTo(City::class, 'city_id');
    }

    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id');
    }
    public function subscription()
    {
        return $this->belongsTo(Subscription::class, 'subscription_id');
    }
}
