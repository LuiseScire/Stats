<?php

namespace App;

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
        'name', 'email', 'password', 'user_type', 'journal_type', 'lang'
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
}
