<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $table = 'reviews';

    protected $fillable = [
        'product_id',
        'order_id',
        'user_id',
        'comment',
        'images',
        'image_public_ids',
        'rating',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    //image is an array

    protected function casts(): array
    {
        return [
            'images' => 'array',
            'image_public_ids' => 'array',
        ];
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

}
