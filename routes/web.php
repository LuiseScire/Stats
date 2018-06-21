<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('main');
});


Route::get('home', function () {
    return view('main');
});

Route::get('subircsv', function () {
    return view('uploadcsv');
});

//Route::get('estadisticas/{filename}', 'MainController@estadisticas');
Route::group(['prefix' => 'estadisticas'], function () {

    Route::get('archivo/{filename?}', function ($filename = "noData"){
        // Matches The "/admin/users" URL
        return view('estadisticas', array('filename' => $filename));
    });

    Route::post('readcsv','MainController@readcsv');
    Route::post('createchartimage','MainController@createchartimage');
    Route::get('descargasporpais', function() {
      return view('downstatscountry');
    });
});

/*Route::get('estadisticas', function () {
    return view('estadisticas');
});*/

/*Route::get('estadisticas/{filename?}', function($filename = "noData"){
    return view('estadisticas', array('filename' => $filename));
});*/
//Route::post('readcsv', 'MainController@readcsv');

/*Route::group(array('prefix' => 'estadisticas'), function() {

});*/
Route::post('uploadcsv','MainController@uploadcsv');
Route::post('listcsvfiles','MainController@listcsvfiles');
