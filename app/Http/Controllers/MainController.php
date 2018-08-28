<?php

namespace App\Http\Controllers;

use App\Authenticatable;
use App\Csvfile;
use App\File;
use App\LastFileUploaded;
use App\User;
use App\Xmlfile;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
//use App\Http\Controllers\Controller;

class MainController extends Controller
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

    public function subircsv()
    {
        return view('uploadcsv');
    }

    public function home()
    {
        return view('main');
    }

    public function historial()
    {
        return view('history');
    }

    public function listcsvfiles(Request $request)
    {
        #Model
        $csv_file_db = new Csvfile;
        $last_file_db = new LastFileUploaded;
        $files_db =  new File;
        $auth_id = Auth::id();
        $journal_id = Auth::user()->journal;

        $case = $request->case;

        switch ($case) {
            case "delete":
                //$delete = $csv_file_db->where('csv_id', $request->csv_id)->update(['csv_status', 'deleted']);
                $csv_id = $request->csv_id;
                $delete = $csv_file_db->where('csv_id', $csv_id)->update(['csv_status' => 'deleted']);
                if ($delete) {
                    $response = array('status' => 'success', 'message' => 'Archivo eliminado satisfactóriamete');
                } else {
                    $response = array('status' => 'error', 'message' => 'Error al eliminar archivo');
                }
                break;
            default:
                // $csv_list = $csv_file_db->where([['csv_user_id', $auth_id], ['csv_status', 'active']])->orderBy('csv_timestamp', 'desc')->get();
                // $last_csv_file_data =  $last_csv_db->select()->where('last_user_id', $auth_id)->first();

                $files_list = $files_db
                    ->join('users AS U', 'files.file_user_id', '=', 'U.id')
                    ->where([['file_journal_id', $journal_id], ['file_status', 'active']])->orderBy('file_timestamp', 'desc')->get();

                $last_file_uploaded_data =  $last_file_db->select()->where('last_user_id', $auth_id)->first();

                $response = array(
                    'filesList' => $files_list,
                    'lastFileData' => $last_file_uploaded_data,
                );
                break;
        }

        return response()->json($response);
    }

    public function files(Request $request){
        #models
        $files_db = new File;
        $lastcsv_db = new LastFileUploaded();

        $auth_id = Auth::id();

        #Response
        $switch_case = $request->switchCase;
        $version = null;

        switch ($switch_case) {
            case 'upload'://upload file to preview
                if (!empty($_FILES['file']['name'])) {
                    $file_type = $request->fileType;
                    $file_name_gen = $this->randCode() . '.' . $file_type;//'.csv';

                    $file_name = $file_name_gen;//$_FILES['csvFile']['name'];
                    $url = '/files/tmp/' . $file_name;
                    $path = public_path() . $url;

                    //$csv_file = '/csvfiles/tmp/' . $_FILES['csvFile']['name'];
                    //$path = public_path() . $csv_file;
                    if (move_uploaded_file($_FILES['file']['tmp_name'], $path)) {
                        chmod($path, 0777);
                        $response = array(
                            'status' => 'success',
                            'message' => 'Archivo Subido correctamente',
                            'storageFileName' => $file_name,
                        );
                    } else {
                        $response = array(
                            'status' => 'error',
                            'message' => 'Error al subir archivos',
                        );
                    }
                } else {
                    $response = array(
                        'status' => 'error',
                        'message' => 'Error al recibir archivos',
                    );
                }
                break;
            case 'moveFromTemp':
                $index_array = $request->indexArray;
                $index_array_role = $request->indexArrayRole;

                $file_name = $request->fileName;
                $storage_file_name = $request->storageFileName;
                $type_report = $request->typeReport;
                $type_report_index = $request->typeReportIndex;
                $csv_file = '/files/tmp/' . $storage_file_name;
                $origin_path = public_path() . $csv_file;

                $file_type = $request->fileType;

                $search_match = $files_db->where([
                    ['file_user_id' => $auth_id],
                    ['file_status' => 'active'],
                    ['file_front_name' => $file_name],
                    ['file_type' => $file_type]
                ]);

                // switch ($file_type) {
                //     case 'csv':
                //         $search_match = $csv_file_db->where([
                //             ['csv_user_id', $auth_id],
                //             ['csv_status', 'active'],
                //             ['csv_front_name', $file_name]
                //         ])->get();
                //         break;
                //     case 'xml':
                //         $search_match = $xml_file_db->where([
                //             ['xml_user_id', $auth_id],
                //             ['xml_status', 'active'],
                //             ['xml_front_name', $file_name]
                //         ]);
                // }

                $count = 0;
                foreach ($search_match as $key => $value) {
                    //dd($value->csv_id);
                    $count++;
                }

                if ($count > 0) {
                    $version = $count + 1;
                }

                //$csv_final_p = '/csvfiles/' . $storage_file_name;

                $targetDir = '/files/' . $storage_file_name;

                $destination_path = public_path() . $targetDir;
                if (rename($origin_path, $destination_path)) {

                    $newFile = $files_db->create([
                        'file_front_name' => $file_name,
                        'file_back_name' => $storage_file_name,
                        'file_path' => $targetDir,
                        'file_user_id' => $auth_id,
                        'file_version' => $version,
                        'file_indices' => json_encode($index_array),
                        'file_role_indices' => json_encode($index_array_role),
                        'file_report_name' => $type_report,
                        'file_report_index' => $type_report_index,
                        'file_type' => $file_type,
                    ]);
                    // switch ($file_type) {
                    //     case 'csv':
                    //         $newRow = $csv_file_db->create([
                    //             'csv_front_name' => $file_name,
                    //             'csv_back_name' => $storage_file_name,
                    //             'csv_path' => $targetDir,
                    //             'csv_user_id' => $auth_id,
                    //             'csv_version' => $version,
                    //             'csv_indices' => json_encode($index_array),
                    //             'csv_type_report' => $type_report,
                    //             'csv_type_report_index' => $type_report_index,
                    //         ]);
                    //         break;
                    //     default:
                    //         $newRow = $xml_file_db->create([
                    //             'xml_front_name' => $file_name,
                    //             'xml_back_name' => $storage_file_name,
                    //             'xml_path' => $targetDir,
                    //             'xml_user_id' => $auth_id,
                    //             'xml_version' => $version,
                    //             'xml_indices' => json_encode($index_array),
                    //             'xml_type_report' => $type_report,
                    //             'xml_type_report_index' => $type_report_index,
                    //         ]);
                    //         break;
                    // }
                    // $csv_file_db->csv_front_name = $file_name;
                    // $csv_file_db->csv_back_name = $storage_file_name;
                    // $csv_file_db->csv_path = $csv_final_p;
                    // $csv_file_db->csv_user_id = $auth_id;
                    // $csv_file_db->csv_version = $version;
                    // $csv_file_db->csv_indices = json_encode($index_array);
                    // $csv_file_db->csv_type_report = $type_report;
                    // $csv_file_db->csv_type_report_index = $type_report_index;


                    //$csv_file_db->save()
                    if ($newFile) {
                        $data_set = [
                            'last_file_id'      =>  $newFile->id,
                            'last_type'         =>  $request->simpleTypeReport,
                            'last_block_one'    =>  $request->block_one,
                            'last_block_two'    =>  $request->block_two,
                            'last_block_three'  =>  $request->block_three,
                        ];

                        $updateLast = $lastcsv_db->where('last_user_id', $auth_id)->update($data_set);

                        if($updateLast){
                            $response = array(
                                'status' => 'success',
                                'message' => 'Archivo Subido correctamente'
                            );
                        } else {
                            $response = array(
                                'status' => 'error',
                                'message' => 'Error al actualizar datos last()'
                            );
                        }

                    } else {
                        $response = array(
                            'status' => 'error',
                            'message' => 'Error al mover'
                        );
                    }
                } else {
                    $response = array(
                        'status' => 'error',
                        'message' => 'Error al mover archivo'
                    );
                }
                break;
            case 'delete':
                //$delete = $csv_file_db->where('csv_id', $request->csv_id)->update(['csv_status', 'deleted']);
                $file_id = $request->fileId;
                $delete = $files_db->where('file_id', $file_id)->update(['file_status' => 'deleted']);
                if ($delete) {
                    $response = array('status' => 'success', 'message' => 'Archivo eliminado satisfactóriamete');
                } else {
                    $response = array('status' => 'error', 'message' => 'Error al eliminar archivo');
                }
                break;
            case 'upload_report_index':
                $index_array = $request->indexArray;
                $file_id = $request->fileId;
                $role_index_array = $request->roleIndexArray;

                $files_db->where('file_id', $file_id)->update([
                    'file_indices' => json_encode($index_array),
                    'file_role_indices' => json_encode($role_index_array)
                ]

                );
                $response = array();
                break;
        }
        return response()->json($response);
    }

    //this function upload csv and xml files
    public function uploadcsv(Request $request){
        #Models
        $csv_file_db = new Csvfile;
        $xml_file_db = new Xmlfile;


        $auth_id = Auth::id();

        #Response
        $action = $request->action;
        $version = null;

        switch ($action) {
            case 'uploadPreview':
                if (!empty($_FILES['csvFile']['name'])) {
                    $file_type = $request->fileType;
                    $file_name_gen = $this->randCode() . '.' . $file_type;//'.csv';

                    $file_name = $file_name_gen;//$_FILES['csvFile']['name'];
                    $url = '/csvfiles/tmp/' . $file_name;
                    $path = public_path() . $url;

                    //$csv_file = '/csvfiles/tmp/' . $_FILES['csvFile']['name'];
                    //$path = public_path() . $csv_file;
                    if (move_uploaded_file($_FILES['csvFile']['tmp_name'], $path)) {
                        chmod($path, 0777);
                        $response = array(
                            'status' => 'success',
                            'message' => 'Archivo Subido correctamente',
                            'storageFileName' => $file_name,
                        );
                    } else {
                        $response = array(
                            'status' => 'error',
                            'message' => 'Error al subir archivos',
                        );
                    }
                } else {
                    $response = array(
                        'status' => 'error',
                        'message' => 'Error al recibir archivos',
                    );
                }
                break;
            case 'moveFromTemp':
                $index_array = $request->indexArray;
                /*foreach ($index_array as $key => $value) {
                  foreach ($value as $key => $v) {

                  }
                }
                $index_db = implode(",", $index_array);*/
                $file_name = $request->fileName;
                $storage_file_name = $request->storageFileName;
                $type_report = $request->typeReport;
                $type_report_index = $request->typeReportIndex;
                $csv_file = '/csvfiles/tmp/' . $storage_file_name;
                $origin_path = public_path() . $csv_file;

                $file_type = $request->fileType;

                switch ($file_type) {
                    case 'csv':
                        $search_match = $csv_file_db->where([
                            ['csv_user_id', $auth_id],
                            ['csv_status', 'active'],
                            ['csv_front_name', $file_name]
                        ])->get();
                        break;
                    case 'xml':
                        $search_match = $xml_file_db->where([
                            ['xml_user_id', $auth_id],
                            ['xml_status', 'active'],
                            ['xml_front_name', $file_name]
                        ]);
                }

                $count = 0;
                foreach ($search_match as $key => $value) {
                    //dd($value->csv_id);
                    $count++;
                }

                if ($count > 0) {
                    $version = $count + 1;
                }

                $csv_final_p = '/csvfiles/' . $storage_file_name;

                $destination_path = public_path() . $csv_final_p;
                if (rename($origin_path, $destination_path)) {
                    switch ($file_type) {
                        case 'csv':
                            $newRow = $csv_file_db->create([
                                'csv_front_name' => $file_name,
                                'csv_back_name' => $storage_file_name,
                                'csv_path' => $csv_final_p,
                                'csv_user_id' => $auth_id,
                                'csv_version' => $version,
                                'csv_indices' => json_encode($index_array),
                                'csv_type_report' => $type_report,
                                'csv_type_report_index' => $type_report_index,
                            ]);
                            break;
                        default:
                            $newRow = $xml_file_db->create([
                                'xml_front_name' => $file_name,
                                'xml_back_name' => $storage_file_name,
                                'xml_path' => $csv_final_p,
                                'xml_user_id' => $auth_id,
                                'xml_version' => $version,
                                'xml_indices' => json_encode($index_array),
                                'xml_type_report' => $type_report,
                                'xml_type_report_index' => $type_report_index,
                            ]);
                            break;
                    }
                    // $csv_file_db->csv_front_name = $file_name;
                    // $csv_file_db->csv_back_name = $storage_file_name;
                    // $csv_file_db->csv_path = $csv_final_p;
                    // $csv_file_db->csv_user_id = $auth_id;
                    // $csv_file_db->csv_version = $version;
                    // $csv_file_db->csv_indices = json_encode($index_array);
                    // $csv_file_db->csv_type_report = $type_report;
                    // $csv_file_db->csv_type_report_index = $type_report_index;


                    //$csv_file_db->save()
                    if ($newRow) {
                        $response = array(
                            'status' => 'success',
                            'message' => 'Archivo Movido correctamente'
                        );
                    } else {
                        $response = array(
                            'status' => 'error',
                            'message' => 'Error al mover'
                        );
                    }
                } else {
                    $response = array(
                        'status' => 'error',
                        'message' => 'Error al mover archivo'
                    );
                }
                break;
            case 'upload_report_index':
                $index_array = $request->indexArray;
                $csv_id = $request->csvId;

                $csv_file_db->where('csv_id', $csv_id)->update(['csv_indices' => json_encode($index_array)]);
                $response = array();
                break;
        }

        return response()->json($response);
    }

    public function readxml(Request $request) {
        $swith_case = $request->switchCase;
        switch ($swith_case) {
            case 'stats':
                $url = public_path().'/files/'.$request->fileName;
                break;
            default:
                $url = public_path().'/files/tmp/'.$request->fileName;
                break;
        }

        $xml = simplexml_load_file($url);

        $xml_data = array();

        foreach ($xml->xpath('//users//user') as $user) {
            $username = $user->username;
            $email = $user->email;
            $gender = $user->gender;
            $country = $user->country;

            $roles = array();
            $roles_types = array();

            $count = 0;
            foreach ($user->role as $role) {
                array_push($roles, (String)$role['type']);
                $count++;
            }

            $data = [
                'username' => (String)$username,
                'email' => (String)$email,
                'gender' => (String)$gender,
                'country' => (String)$country,
                'roles' => $roles,
            ];

            array_push($xml_data, $data);
        }

        return response()->json($xml_data);
    }

    public function uploadcsv_(Request $request){
        #Models
        $csv_file_db = new Csvfile;

        $auth_id = Auth::id();

        #Response
        $action = $request->action;
        $delete_exist = (bool)$request->deleteExist;

        $upload_preview_csv = 0;
        $version = null;

        switch ($action) {
            case 'uploadPreview':
                if (!empty($_FILES['csvFile']['name'])) {
                    //consultar a bd
                    $search_match = $csv_file_db->where([
                        ['csv_user_id', $auth_id],
                        ['csv_status', 'active'],
                        ['csv_front_name', $_FILES['csvFile']['name']]
                    ])->get();

                    $count = 0;
                    $match_id = "";
                    $match_bn = "";
                    $match_fn = "";
                    foreach ($search_match as $key => $value) {
                        //dd($value->csv_id);
                        $count++;
                    }

                    if ($count > 0) {
                        /*$match_id = $search_match->csv_id;
                        $match_bn = $search_match->csv_back_name;
                        $match_fn = $search_match->csv_front_name;*/

                        /*if($delete_exist){
                          //$final_path_file = public_path() . '/csvfiles/' . $match_bn;
                          //$replace_match = $csv_file_db->where('csv_id', $match_id)->update(['csv_status' => 'replaced']);

                          //$source_file = public_path() . '/csvfiles/' . $match_fn;
                          //$destination_path = public_path() . '/csvfiles/replaced/' . $match_bn;

                          //if(unlink($final_path_file)){
                          if(rename($source_file, $destination_path)){
                            $upload_preview_csv = 1;
                          } else {
                            $response = array(
                              'status' => 'error',
                              'message' => 'Error al reemplazar documento'
                            );
                          }

                        } else {
                          $response = array(
                            'status' => 'fileExist',
                            'message' => 'El documento ya existe ¿desea reemplazarlo?',
                          );
                        }*/
                        $version = $count + 1;
                        $upload_preview_csv = 1;
                    } else {
                        $upload_preview_csv = 1;
                    }
                } else {
                    $response = array(
                        'status' => 'error',
                        'message' => 'Error al recibir archivos',
                    );
                }
                break;
            case 'moveFromTemp':
                $file_name = $request->fileName;
                $csv_file = '/csvfiles/tmp/' . $file_name;
                $source_file = public_path() . $csv_file;

                $file_name_gen = $this->randCode() . '.csv';
                $csv_final_p = '/csvfiles/' . $file_name_gen;
                $destination_path = public_path() . '/csvfiles/' . $file_name_gen;
                //if(rename($source_file, $destination_path . pathinfo($source_file, PATHINFO_BASENAME))){
                if (rename($source_file, $destination_path)) {
                    //$update = $csv_file_db->where('csv_user_id', $auth_id)->update(['csv_status' => 'active']);
                    //if($update) {
                    $csv_file_db->csv_front_name = $file_name;
                    $csv_file_db->csv_back_name = $file_name_gen;
                    $csv_file_db->csv_path = $csv_final_p;
                    $csv_file_db->csv_user_id = $auth_id;

                    if ($csv_file_db->save()) {
                        $response = array(
                            'status' => 'success',
                            'message' => 'Archivo Movido correctamente'
                        );
                    } else {
                        $response = array(
                            'status' => 'error',
                            'message' => 'Error al mover'
                        );
                    }
                } else {
                    $response = array(
                        'status' => 'error',
                        'message' => 'Error al mover archivo'
                    );
                }
                break;
            default:
                // code...
                break;
        }

        if ($upload_preview_csv) {
            $csv_file = '/csvfiles/tmp/' . $_FILES['csvFile']['name'];
            $path = public_path() . $csv_file;
            if (move_uploaded_file($_FILES['csvFile']['tmp_name'], $path)) {
                chmod($path, 0777);

                $response = array(
                    'status' => 'success',
                    'message' => 'Archivo Subido correctamente',
                    'path' => $path
                    //'msg'     => $request->message,
                );
            } else {
                $response = array(
                    'status' => 'error',
                    'message' => 'Error al subir archivos',
                );
            }
        }
        return response()->json($response);
    }

    /*########################## [Stats Functions] #######################*/
    public function stats($filename = "noData", $target = "noTarget") {
        return view('estadisticas', array('filename' => $filename, 'target' => $target));
    }

    public function downstatscountry($filename = "noData") {
        return view('downstatscountry', array('filename' => $filename));
    }

    public function getDataFiles(Request $request){
        #Models
        $files_db = new File;

        $auth_id = Auth::id();
        $file_back_name = $request->filename;
        $file_data = $files_db->select()->where([['file_back_name', $file_back_name], ['file_user_id', $auth_id]])->first();

        return response()->json(array('filesData' => $file_data));
    }

    public function getdatacsv(Request $request) {
        #Models
        $csv_file_db = new Csvfile;

        $auth_id = Auth::id();

        $csv_back_name = $request->filename;
        $csv_file_data = $csv_file_db->select()->where([['csv_back_name', $csv_back_name], ['csv_user_id', $auth_id]])->first();
        $type_report = $csv_file_data->csv_type_report;

        return response()->json(array('csvFileData' => $csv_file_data));
    }

    public function lastcsv(Request $request) {
        $lastcsv_db = new Lastcsv();
        $user_id = Auth::id();

        $data_set = [
            'last_type'         =>  $request->type,
            'last_block_one'    =>  $request->block_one,
            'last_block_two'    =>  $request->block_two,
            'last_block_three'  =>  $request->block_three,
        ];

        $lastcsv_db->where('last_user_id', $user_id)->update($data_set);

        return response()->json( array('stats' => 'success') );
    }

    public function getdatacsv2(Request $request)
    {
        #Models
        $csv_file_db = new Csvfile;
        $auth_id = Auth::id();

        $csv_back_name = $request->filename;

        $csv_file_data = $csv_file_db->select()->where([['csv_back_name', $csv_back_name], ['csv_user_id', $auth_id]])->first();
        $type_report = $csv_file_data->csv_type_report;

        return response()->json(array('csvFileData' => $csv_file_data));
    }

    public function readcsv(Request $request)
    {
        $response = array(
            'filename' => $request->filename
        );
        return response()->json($response);
    }

    public function createchartimage(Request $request){
        $image = $request->image;

        $data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image));
        $file_name = $this->randCode() . '.png';
        $file_path = public_path() . '/chartimages/' . $file_name;

        file_put_contents($file_path, $data);

        $response = array(
            'status' => 'success',
            'fileName' => $file_name
        );
        return response()->json($response);
    }

    /*########################## [User Functions] #######################*/
    public function updateLang(Request $request){
        $user_db = new User();

        $user_id = Auth::id();
        $lang = $request->lang;

        $affected = $user_db->where('id', $user_id)->update(['lang' => $lang]);

        $status = ($affected == 1) ? 'success' : 'error';

        return response()->json(array('status' => $status));
    }



    /*########################## [Extra Functions] #######################*/
    private function randCode()
    {
        $key = '';
        $pattern = '1234567890abcdefghijklmnopqrstuvwxyz';
        $max = strlen($pattern) - 1;
        for ($i = 0; $i < 10; $i++) $key .= $pattern{mt_rand(0, $max)};
        return $key;
    }

    public function testpath()
    {
        dd(base_path());
        //dd(public_path());
        //dd(app_path());
    }
}
