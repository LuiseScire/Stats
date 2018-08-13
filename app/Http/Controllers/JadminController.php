<?php

namespace App\Http\Controllers;

use App\User;
use App\JournalUser;
use App\AcademicDegree;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;


class JadminController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function users() {
        $degree_db = new AcademicDegree();

        $degrees = $degree_db->where('degree_status', 'Activo')->get();;

        return view('jadmin.users', ['degrees' => $degrees]);
    }

    public function getAllUsers() {

    }

    public function registerUser(Request $request){
        #Models
        $user_db =  new User();
        #Request
        $email = $request->userEmail;
        $data = array('email' => $email);
        $username_f = $request->userFirstName;
        $username_l = $request->userLastName;
        $password = $request->userPassword;
        $phone = $request->userPhone;

        $journal = $request->userJournal;

        $validator = Validator::make($data, [
            'email' => 'required|string|email|max:255|unique:users',
        ]);

        if (!$validator->fails()){
            //All OK
            $createUser = $user_db->create([
                'name' => $username_f,
                'email' => $email,
                'password' => Hash::make($password),
                'user_type' => 'Journal',
                'journal_type' => 'User',
                'journal' => $journal
            ]);

            if($createUser) {
                $response = array(
                    'status' => 'success',
                    'message' => 'Usuario registrado satisfactoriamente',
                );
            } else {
                $response = array(
                    'status' => 'error',
                    'message' => 'Error al crear usuario',
                );
            }

        } else {
            $response = array(
                'data' => 'The given data did not pass validation',
            );
        }

        return response()->json($response);
    }

    public function x(){

    }
}
