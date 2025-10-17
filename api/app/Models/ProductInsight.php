<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductInsight extends Model
{
    protected $fillable = [
        'product_id',
        'sales_volume',
        'total_revenue',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
