<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MainController extends Controller{
    public function listcsvfiles(){
      $file_list = [];
      $directorio = opendir(public_path() . '/csvfiles/');
      while ($archivo = readdir($directorio)){
        if (strtolower(substr($archivo, -3) == 'csv')){
          //echo $archivo . '<br />';
          array_push($file_list, $archivo);
        }
      }
      $response = array(
        'fileList' => $file_list
      );
      return response()->json($response);
    }

    private function uploadCsvPreview(){

    }

    public function uploadcsv(Request $request){
      $action = $request->action;
      $delete_exist = (bool)$request->deleteExist;

      $upload_preview_csv = 0;

      switch ($action) {
        case 'uploadPreview':
          if(!empty($_FILES['csvFile']['name'])) {
            $final_path_file = public_path() . '/csvfiles/' . $_FILES['csvFile']['name'];

            if(file_exists($final_path_file)) {
              if($delete_exist){
                if(unlink($final_path_file)){
                  $upload_preview_csv = 1;
                } else {
                  $response = array(
                    'status' => 'error',
                    'message' => 'Error al reemplazar documento',
                  );
                }
              } else {
                $response = array(
                  'status' => 'fileExist',
                  'message' => 'El documento ya existe ¿desea reemplazarlo?',
                );
              }
            } else {
              $upload_preview_csv = 1;
            }
          }else {
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

          $destination_path = public_path() . '/csvfiles/';
          if(rename($source_file, $destination_path . pathinfo($source_file, PATHINFO_BASENAME))){
            $response = array(
              'status'  => 'success',
              'message' => 'Archivo Movido correctamente'
            );
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

    //Estadísticas
    /*public function estadisticas(Request $request){
      return view('estadisticas', ['filename' => $request->filename]);
    }*/

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

    private function codigoaleatorio() {
     $key = '';
     $pattern = '1234567890abcdefghijklmnopqrstuvwxyz';
     $max = strlen($pattern)-1;
     for($i=0;$i < 10;$i++) $key .= $pattern{mt_rand(0,$max)};
     return $key;
    }

}
