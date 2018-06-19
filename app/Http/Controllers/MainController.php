<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MainController extends Controller{
    public function listcsvfiles(){
      $fileList = [];
      $directorio = opendir(public_path() . '/csvfiles/');
      while ($archivo = readdir($directorio)){
        if (strtolower(substr($archivo, -3) == "csv")){
          //echo $archivo . "<br />";
          array_push($fileList, $archivo);
        }
      }
      $response = array(
        'fileList' => $fileList
      );
      return response()->json($response);
    }

    public function uploadcsv(Request $request){
      $action = $request->action;

      switch ($action) {
        case 'uploadPreview':
          if(!empty($_FILES['csvFile']['name'])) {
            $csvfile = '/csvfiles/tmp/' . $_FILES['csvFile']['name'];
            $path = public_path() . $csvfile;
            if(move_uploaded_file($_FILES['csvFile']['tmp_name'], $path)){
              $response = array(
                'status'  => 'success',
                'message' => 'Archivo Subido correctamente',
                'path' => $path
                //'msg'     => $request->message,
              );
            } else {
              $response = array(
                  'message' => "Error al subir archivos",
              );
            }

          }else {
            $response = array(
                'message' => "Error al recibir archivos",
            );
          }
          break;
        case 'moveFromTemp':
          $fileName = $request->fileName;
          $csvfile = '/csvfiles/tmp/' . $fileName;
          $source_file = public_path() . $csvfile;

          $destination_path = public_path() . '/csvfiles/';
          if(rename($source_file, $destination_path . pathinfo($source_file, PATHINFO_BASENAME))){
            $response = array(
              'status'  => 'success',
              'message' => 'Archivo Movido correctamente'
            );
          }else {
            $response = array(
              'message' => 'Error al mover archivo'
            );
          }
          break;
        default:
          // code...
          break;
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
      $tipoExport = $request->tipoExport;

      switch ($tipoExport) {
        case ($tipoExport == 'jpg') || ($tipoExport == 'png'):
          $data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image));
          $filename = $this->codigoaleatorio() . "." . $tipoExport;
          $filepath = public_path() . "/chartimages/" . $filename;

          if(file_put_contents($filepath,$data));
          break;
        case "pdf";

        default:
          // code...
          break;
      }

      $response = array(
        'status' => 'success',
        'fileName' => $filename
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
