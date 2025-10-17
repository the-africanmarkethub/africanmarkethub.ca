<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PolicySetting extends Model
{
    protected $fillable = ['type', 'content'];

    public static function updatePolicy($type, $content)
    {
        return self::updateOrCreate(['type' => $type], ['content' => $content]);
    }
}
