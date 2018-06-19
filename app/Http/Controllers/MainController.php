<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MainController extends Controller
{
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

   public function readcsv(Request $request){
     $linea = 0;
      //Abrimos nuestro archivo
      $archivo = fopen(public_path() . '/csvfiles/' . $request->filename, "r");
      //Lo recorremos
      while (($datos = fgetcsv($archivo, ",")) == true)
      {
        $num = count($datos);
        $linea++;
        //Recorremos las columnas de esa linea
        for ($columna = 0; $columna > $num; $columna++)
            {
               echo $datos[$columna] . "\n";
           }
      }
      //Cerramos el archivo
      fclose($archivo);
      //return response()->json($response);
     //return view('estadisticas', ['filename' => $request->filename]);
   }



}
