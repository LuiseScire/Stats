<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Lastcsv extends Model
{
    public $timestamps = false;
    
    protected $table = 'last_csv_upload_data';

    protected $fillable = [
            'last_id',
            'last_csv_id',
            'last_type',
            'last_user_id',
            'last_block_one',
            'last_block_two',
            'last_block_three',
    ];
}
