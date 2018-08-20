<?php

namespace App\Http\Controllers;

use App\AcademicDegree;
use App\User;
use App\Country;
use App\Journal;
use App\JournalUser;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
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

    public function panel(){
        $degree_db = new AcademicDegree();
        $country_db = new Country();

        $response['degrees'] = $degree_db->where('degree_status', 'Activo')->get();
        $response['countries'] = $country_db->get();

        return view('admin.panel', $response);
    }

    public function users(Request $request){
        $user_db = new User();
        $journal_db = new Journal();

        $s_case = $request->switchCase;

        switch ($s_case) {
            case 'getJAdmin':
                $response['journals'] = $journal_db->get();
                break;
            case 'getJUsers':
                $journal = $request->journalId;
                $response['users'] = $user_db
                ->join('journals_users as J', 'id', '=', 'J.jnals_user_id')
                ->where([
                    ['journal', $journal]
                ])->get();
                break;
        }

        return response()->json($response);
    }

    public function registerUser(Request $request){
        #Models
        $auth_id = Auth::id();
        $user_db =  new User();
        $journal_db = new Journal();
        $journal_users_db = new JournalUser();

        #Request
        $email = $request->userEmail;
        $data = array('email' => $email);

        $username_f = $request->userFirstName;
        $username_l = $request->userLastName;
        $password = $request->userPassword;

        $academic_d = $request->userAcademicDegree;

        $ascription = $request->userAscription;
        $journal_name = $request->userJournalName;
        $journal_phone = $request->userJurnalPhone;

        $phone = $request->userPhone;

        $country = $request->userCountry;
        $state = $request->userState;
        $city = $request->userCity;

        $lang = ($this->spanishSpeaker($country)) ? 'es' : 'en';

        $validator = Validator::make($data, [
            'email' => 'required|string|email|max:255|unique:users',
        ]);

        if (!$validator->fails()){
            //All OK
            $newJournal = $journal_db->create([
                'jnal_name' => $journal_name,
                'jnal_phone' => $journal_phone,
                'jnal_pack_plan'  => 1,
                'jnal_total_users' => 1,
            ]);

            if($newJournal){
                $newUser = $user_db->create([
                    'name' => $username_f,
                    'last_name' => $username_l,
                    'email' => $email,
                    'password' => Hash::make($password),
                    'user_type' => 'Journal',
                    'journal' => $newJournal->id,
                    'lang' => $lang
                ]);

                if($newUser) {
                    $setDataJournal = $journal_users_db->create([
                        'jnals_academic_degree' => $academic_d,
                        'jnals_adscripcion' => $ascription,
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
            }else {
                $response = array(
                    'status' => 'error',
                    'message' => 'Error al crear usuario',
                    'backMessage' => 'Error al insertar datos en Journal()'
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

    private function spanishSpeaker($country_){
        $countries = [9, 32, 14, 50, 53, 54, 66, 201, 70, 93, 89, 99, 143, 165, 174, 184, 176, 64, 234, 234];

        foreach ($countries as $country) {
            if($country == $country_)
            return true;
        }

        return false;
    }
}
