<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'sales_price',
        'regular_price',
        'quantity',
        'images',
        'image_public_ids',
        'type',
        'shop_id',
        'category_id',
        'views',
        'notify_user',
        // for services
        'pricing_model',
        'delivery_method',
        'estimated_delivery_time',
        'available_days',
        'available_from',
        'available_to',
        'status',
    ];
    public function variations()
    {
        return $this->hasMany(ProductVariation::class);
    }

    public function shop()
    {
        return $this->belongsTo(Shop::class, 'shop_id');
    }
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'product_id');
    }
    public function vendor()
    {
        return $this->belongsTo(User::class, 'shop_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
    public function discounts()
    {
        return $this->hasMany(Discount::class);
    }

    // Accessor to calculate the average rating
    public function getAverageRatingAttribute()
    {
        return round($this->reviews->avg('rating'), 2);
    }

    public function getFinalPriceAttribute()
    {
        $current_time = now();
        $activeDiscount = $this->discounts()
            ->where('start_time', '<=', $current_time)
            ->where('end_time', '>=', $current_time)
            ->first();

        if ($activeDiscount) {
            return $activeDiscount->discount_price;
        }

        return $this->regular_price;
    }

    // Cast the images and image_public_ids to array
    protected $casts = [
        'images' => 'array',
        'image_public_ids' => 'array',
        'average_rating' => 'array',
        'available_days' => 'array',

    ];

    public function toArray()
    {
        $array = parent::toArray();

        // Keep the average rating logic
        $array['average_rating'] = $this->average_rating;

        // Add variations with color and size
        $array['variations'] = $this->variations()
            ->with(['color', 'size'])
            ->get()
            ->toArray();

        return $array;
    }
}
