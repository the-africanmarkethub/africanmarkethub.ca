<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $table = 'countries';

    protected $fillable = ['name', 'flag', 'flag_public_id', 'dial_code', 'currency', 'short_name'];

    public function state()
    {
        return $this->hasMany(State::class, 'country_id');
    }

    public function city()
    {
        return $this->hasMany(City::class, 'country_id');
    }
}
