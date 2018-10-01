<?php

namespace Stats;

use Illuminate\Database\Eloquent\Model;

class Journal extends Model
{
    public $timestamps = false;

    protected $table = 'journals';

    protected $fillable = [
        'jnal_id',
        'jnal_name',
        'jnal_affiliation',
        'jnal_logo',
        'jnal_phone',
        'janl_plan_pack',
        'jnal_total_users',
        'jnal_user_admin',
        'jnal_status',
    ];

    public static function journalAffiliation($jnal_id){
        $jnal_query = Journal::where('jnal_id', $jnal_id)->first();
        //$journal = array('jnal_name' => $jnal_query->jnal_name);
        return $jnal_query;
    }
}
