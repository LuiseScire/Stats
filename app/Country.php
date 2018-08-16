<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Country extends Model{
    protected $table = 'countries';

    protected $fillable = [
            'country_id',
            'country_en',
            'country_es',
            'country_code',
            'country_iso',
            'country_iso3'
    ];
}
