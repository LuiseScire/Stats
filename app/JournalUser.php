<?php

namespace App;

use App\Journal;
use Illuminate\Database\Eloquent\Model;

class JournalUser extends Model{
    public $timestamps = false;

    protected $table = 'journals_users';

    protected $fillable = [
        'jnals_id',
        'jnals_academic_degree',
        'jnals_adscripcion',
        'jnals_journal_name',
        'jnals_phone',
        'jnals_country',
        'jnals_city',
        'jnals_state',
        'jnals_user_id',
        'jnals_user_type'
    ];

    public static function getLogo($journal_id){
        $logo = Journal::where('jnal_id', $journal_id)->select('jnal_logo')->first();
        if(empty($logo->jnal_logo) || $logo->jnal_logo == Null){
            return false;
        }
        return $logo->jnal_logo;
    }

    public static function getJName($journal_id){
        $jName = Journal::where('jnal_id', $journal_id)->select('jnal_name')->first();
        return $jName->jnal_name;
    }
}
