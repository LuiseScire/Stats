<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class LastFileUploaded extends Model
{
    public $timestamps = false;

    protected $table = 'last_file_uploaded_data';

    protected $fillable = [
            'last_id',
            'last_file_id',
            'last_type',
            'last_user_id',
            'last_block_one',
            'last_block_two',
            'last_block_three',
    ];
}
