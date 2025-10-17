<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IdentityVerification extends Model
{
    protected $table = 'identity_verifications';

    protected $fillable = [
        'user_id',
        'document_type',
        'document_number',
        'document_front',
        'document_back',
        'document_selfie',
        'rejection_reason',
        'verified_at',
        'status',
    ];
}
