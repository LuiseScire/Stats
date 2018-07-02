<?php

namespace App\Http\Controllers;

use App\csvfile;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
//use App\Http\Controllers\Controller;

class MainController extends Controller{

  /**
   * Create a new controller instance.
   *
   * @return void
   */
  public function __construct()
  {
      $this->middleware('auth');
  }

  public function subircsv(){
    return view('uploadcsv');
  }

  public function home(){
    return view('main');
  }

  public function listcsvfiles(){
    #Model
    $csv_file_db = new Csvfile;
    #

    $auth_id = Auth::id();

    $csv_list = $csv_file_db->where([['csv_user_id', $auth_id], ['csv_status', 'active']])->get();

    $file_list = [];
    /*$directorio = opendir(public_path() . '/csvfiles/');
    while ($archivo = readdir($directorio)){
      if (strtolower(substr($archivo, -3) == 'csv')){
        //echo $archivo . '<br />';
        array_push($file_list, $archivo);
      }
    }*/
    $response = array(
      'fileList' => $file_list,
      'csvList' => $csv_list
    );
    return response()->json($response);
  }

  public function uploadcsv(Request $request) {
    #Models
    $csv_file_db = new Csvfile;

    $auth_id = Auth::id();

    #Response
    $action = $request->action;
    $version = null;

    switch ($action) {
      case 'uploadPreview':
        if(!empty($_FILES['csvFile']['name'])) {
          $csv_file = '/csvfiles/tmp/' . $_FILES['csvFile']['name'];
          $path = public_path() . $csv_file;
          if(move_uploaded_file($_FILES['csvFile']['tmp_name'], $path)){
            chmod($path, 0777);
            $response = array(
              'status'  => 'success',
              'message' => 'Archivo Subido correctamente',
              'path' => $path,
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
        $file_name = $request->fileName;
        $csv_file = '/csvfiles/tmp/' . $file_name;
        $source_file = public_path() . $csv_file;

        $search_match = $csv_file_db->where([
          ['csv_user_id', $auth_id],
          ['csv_status', 'active'],
          ['csv_front_name', $file_name]
        ])->get();

        $count = 0;
        foreach ($search_match as $key => $value) {
          //dd($value->csv_id);
          $count++;
        }

        if($count > 0){
          $version = $count + 1;
        }

        $file_name_gen = $this->randCode() . '.csv';
        $csv_final_p = '/csvfiles/' . $file_name_gen;
        $destination_path = public_path() . '/csvfiles/' . $file_name_gen;
        if(rename($source_file, $destination_path)){
          $csv_file_db->csv_front_name = $file_name;
          $csv_file_db->csv_back_name = $file_name_gen;
          $csv_file_db->csv_path = $csv_final_p;
          $csv_file_db->csv_user_id = $auth_id;
          $csv_file_db->csv_version = $version;

          if($csv_file_db->save()){
            $response = array(
              'status'  => 'success',
              'message' => 'Archivo Movido correctamente'
            );
          } else {
            $response = array(
              'status'  => 'error',
              'message' => 'Error al mover'
            );
          }
        }else {
          $response = array(
            'status' => 'error',
            'message' => 'Error al mover archivo'
          );
        }
        break;
    }

    return response()->json($response);
  }

  public function uploadcsv_(Request $request) {
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
        if(!empty($_FILES['csvFile']['name'])) {
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

          if($count > 0){
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
        if(rename($source_file, $destination_path)){
          //$update = $csv_file_db->where('csv_user_id', $auth_id)->update(['csv_status' => 'active']);
          //if($update) {
          $csv_file_db->csv_front_name = $file_name;
          $csv_file_db->csv_back_name = $file_name_gen;
          $csv_file_db->csv_path = $csv_final_p;
          $csv_file_db->csv_user_id = $auth_id;

          if($csv_file_db->save()){
            $response = array(
              'status'  => 'success',
              'message' => 'Archivo Movido correctamente'
            );
          } else {
            $response = array(
              'status'  => 'error',
              'message' => 'Error al mover'
            );
          }
        }else {
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

    if($upload_preview_csv){
      $csv_file = '/csvfiles/tmp/' . $_FILES['csvFile']['name'];
      $path = public_path() . $csv_file;
      if(move_uploaded_file($_FILES['csvFile']['tmp_name'], $path)){
        chmod($path, 0777);

        $response = array(
          'status'  => 'success',
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

  public function stats($filename = "noData", $target = "noTarget"){
    return view('estadisticas', array('filename' => $filename, 'target' => $target));
  }

  public function downstatscountry($filename = "noData") {
    return view('downstatscountry', array('filename' => $filename));
  }

  public function readcsv(Request $request){
    $response = array(
      'filename' => $request->filename
    );
    return response()->json($response);
  }

  public function createchartimage(Request $request){
    $image = $request->image;
    $tipo_export = $request->tipoExport;

    switch ($tipo_export) {
      case ($tipo_export == 'jpg') || ($tipo_export == 'png'):
        $data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image));
        $file_name = $this->codigoaleatorio() . '.' . $tipo_export;
        $file_path = public_path() . '/chartimages/' . $file_name;

        if(file_put_contents($file_path,$data));
        break;
      case 'pdf';

      default:
        // code...
        break;
    }

    $response = array(
      'status' => 'success',
      'fileName' => $file_name
    );

    return response()->json($response);
  }

  private function randCode() {
   $key = '';
   $pattern = '1234567890abcdefghijklmnopqrstuvwxyz';
   $max = strlen($pattern)-1;
   for($i=0;$i < 10;$i++) $key .= $pattern{mt_rand(0,$max)};
   return $key;
  }

  public function testpath(){
    dd(base_path());
    //dd(public_path());
    //dd(app_path());
  }
}
