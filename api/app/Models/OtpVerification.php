<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OtpVerification extends Model
{

    protected $fillable = [
        "otp",
        "phone",
        "email",
    ];
    protected  $table = 'otp_verifications';
}
