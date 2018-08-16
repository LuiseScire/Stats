<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class JournalUser extends Model{
    public $timestamps = false;

    protected $table = 'journals_users';

    protected $fillable = [
        'jnals_id',
        'jnals_academic_degree',
        'jnals_adscripción',
        'jnals_journal_name',
        'jnals_phone',
        'jnals_country',
        'jnals_city',
        'jnals_state',
        'jnals_user_id'
    ];
}
