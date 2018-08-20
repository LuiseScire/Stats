<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Rel_UserAdmin_Journal extends Model
{
    public $timestamps = false;

    protected $table = 'Rel_UsersAdmin_Journals';

    protected $fillable = [
        'rel_uj_id',
        'rel_uj_admin_id',
        'rel_uj_type_pack',
        'rel_uj_total_users',
        'rel_uj_total_register',
        'rel_uj_total_available',
        'rel_uj_status'
    ];
}
