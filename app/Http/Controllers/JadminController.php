<?php

namespace App\Http\Controllers;

use App\AcademicDegree;
use App\Country;
use App\JournalUser;
use App\User;

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

    public function users(Request $request){
        #Models
        //global
        $user_db =  new User();

        //getAll
        $auth_id = Auth::id();
        $journal = Auth::user()->journal;

        //delete
        $user_id = $request->userId;

        //default
        $degree_db = new AcademicDegree();
        $country_db = new Country();

        $s_case = $request->swithCase;
        switch ($s_case) {
            case 'getAll':
                $response['allUsers'] = $user_db
                                        ->join('journals_users', 'id', '=', 'jnals_user_id')
                                        ->where('journal', $journal)->get();

                return response()->json($response);
                break;
            case 'delete':
                $deleted = $user_db->where('id', $user_id)->update(['status' => 'deleted']);
                if($deleted){
                    $response = array(
                        'status' => 'success',
                        'message' => 'Usuario eliminado satisfactoriamente',
                    );
                } else {
                    $response = array(
                        'status' => 'error',
                        'message' => 'Error al eliminar usuario',
                    );
                }
                return response()->json($response);
                break;
            default:
                $response['degrees'] = $degree_db->where('degree_status', 'Activo')->get();
                $response['countries'] = $country_db->get();

                return view('jadmin.users', $response);
                break;
        }//end swith
    }

    // public function usersView(){
    //     #Models
    //     $degree_db = new AcademicDegree();
    //     $country_db = new Country();
    //
    //     $response['degrees'] = $degree_db->where('degree_status', 'Activo')->get();
    //     $response['countries'] = $country_db->get();
    //
    //     return view('jadmin.users', $response);
    // }
    //
    // public function user(Request $request){
    //     #Models
    //     //global
    //     $user_db =  new User();
    //
    //     //getAll
    //     $auth_id = Auth::id();
    //     $journal = Auth::user()->journal;
    //
    //
    //
    //     $switch_case = $request->swithCase;
    //     switch ($switch_case) {
    //         case 'getAll':
    //             $response['allUsers'] = $user_db
    //                                     ->join('journals_users', 'id', '=', 'jnals_user_id')
    //                                     ->where('journal', $journal)->get();
    //
    //             break;
    //         case 'delete':
    //             $deleted = $user_db->where('id', $user_id)->update(['status' => 'deleted']);
    //             if($deleted){
    //                 $response = array(
    //                     'status' => 'success',
    //                     'message' => 'Usuario eliminado satisfactoriamente',
    //                 );
    //             } else {
    //                 $response = array(
    //                     'status' => 'error',
    //                     'message' => 'Error al eliminar usuario',
    //                 );
    //             }
    //             break;
    //     }
    //
    //     return response()->json($response);
    // }

    public function registerUser(Request $request){
        #Models
        $user_db =  new User();
        $journal_db = new JournalUser();

        #Request
        $email = $request->userEmail;
        $data = array('email' => $email);
        $username_f = $request->userFirstName;
        $username_l = $request->userLastName;
        $password = $request->userPassword;
        $phone = $request->userPhone;

        $academic_d = $request->userAcademicDegree;
        $country = $request->userCountry;
        $state = $request->userState;
        $city = $request->userCity;

        //$lang = ($country == 143) ? 'es' : 'en';

        $journal = Auth::user()->journal;

        $validator = Validator::make($data, [
            'email' => 'required|string|email|max:255|unique:users',
        ]);

        if (!$validator->fails()){
            //All OK
            $newUser = $user_db->create([
                'name' => $username_f,
                'last_name' => $username_l,
                'email' => $email,
                'password' => Hash::make($password),
                'user_type' => 'Journal',
                'journal_type' => 'User',
                'journal' => $journal
            ]);

            if($newUser) {
                $setDataJournal = $journal_db->create([
                    'jnals_academic_degree' => $academic_d,
                    'jnals_adscripción' => '',
                    'jnals_journal_name' => '',
                    'jnals_phone' => $phone,
                    'jnals_country' => $country,
                    'jnals_state' => $state,
                    'jnals_city' => $city,
                    'jnals_user_id' => $newUser->id
                ]);

                if($setDataJournal){
                    $response = array(
                        'status' => 'success',
                        'message' => 'Usuario registrado satisfactoriamente',
                    );
                } else {
                    $response = array(
                        'status' => 'error',
                        'message' => 'Error al registrar usuario',
                        'backMessage' => 'Error al insertar datos en JournalUser()'
                    );
                }
            } else {
                $response = array(
                    'status' => 'error',
                    'message' => 'Error al crear usuario',
                    'backMessage' => 'Error al insertar datos en User()'
                );
            }

        } else {
            $response = array(
                'status' => 'error-mail',
                'message' => 'Correo electrónico no válido',
            );
        }

        return response()->json($response);
    }

}
