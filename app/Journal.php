<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Journal extends Model
{
    public $timestamps = false;

    protected $table = 'journals';

    protected $fillable = [
        'jnal_id',
        'jnal_name',
        'jnal_logo',
        'jnal_phone',
        'janl_plan_pack',
        'jnal_total_users',
        'jnal_user_admin',
        'jnal_status',
    ];
}
