<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $table = 'tickets';

    protected $fillable = [
        'ticket_id',
        'title',
        'subject',
        'description',
        'file',
        'file_public_id',
        'priority_level',
        'response_status',
        'reporter_id',
        'agent_id',
    ];


    // Cast the images and image_public_ids to array
    protected $casts = [
        'description' => 'array', 
    ];

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }
    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }
}
