<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemCommission extends Model
{
    protected $table = 'item_commissions';
    protected $fillable = ['rate', 'type'];
    
}
