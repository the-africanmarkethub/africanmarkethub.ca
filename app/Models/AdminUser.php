<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class AdminUser extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    
    protected $table = 'admin_users';

    protected $fillable = [
        'name',
        'last_name',
        'email',
        'password',
        'phone',
        'status',
        'role',
        'last_login',
        'password_changed_at',
        'remember_token',
    ];
    protected $cast = [
        'last_login' => 'datetime',
        'password_changed_at' => 'datetime',
        'password' => 'hashed',
    ];
    protected $hiddden = [
        'password',
        'remember_token', 
    ];
}
