<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppSettings extends Model
{
    protected $table = 'app_settings';
    protected $fillable = [
        'app_name',
        'app_description',
        'app_logo',
        'support_phone',
        'support_email',
    ];
}
