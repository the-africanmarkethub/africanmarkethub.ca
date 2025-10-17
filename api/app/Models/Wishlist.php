<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    protected $fillable = [
        'customer_id',
        'product_id',
        'quantity',
    ];
    protected $table = 'wishlists';
    // relationshop between wishlist and product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    // relationship between wishlist and customer
    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }
}
