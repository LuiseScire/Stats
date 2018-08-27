<?php

namespace App;

use App\JournalUser;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'name',
        'last_name',
        'email',
        'password',
        'user_type',
        'journal_type',
        'pack',
        'journal',
        'lang',
        'avatar',
        'status'
    ];


    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    //this method used in LoginController
    public function userType() {
        $user_type = '';
        //dd($this->user_type);
        if($this->user_type == 'Admin'){
            $user_type = 'Admin';
        } else {
            $user_type = 'Journal';
        }

        return $this->user_type;
    }

    public static function journalType($user_id){
        $j_user_type = JournalUser::where('jnals_user_id', $user_id)->select('jnals_user_type')->first();
        return $j_user_type->jnals_user_type;
    }
}
