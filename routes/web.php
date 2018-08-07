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
Auth::routes();

Route::get('/', function () {
    return redirect()->route('home');
});
/********************* [ADMIN] ++++++++++++++++++++++++++++*/
Route::group(['middleware' => 'journal'], function() {
  Route::get('/home', 'MainController@home')->name('home');

  Route::get('/historial', 'MainController@historial')->name('historial');

  Route::get('/subircsv', 'MainController@subircsv')->name('subircsv');

  Route::get('/testpath', 'MainController@test');


  Route::group(['prefix' => 'estadisticas'], function () {
    Route::get('archivo/{filename?}/{target?}', 'MainController@stats');

    Route::post('readcsv','MainController@readcsv');
    Route::post('archivo/getdatacsv', 'MainController@getdatacsv')->name('getdatacsv');
    Route::post('descargasporpais/getdatacsv2', 'MainController@getdatacsv2')->name('getdatacsv2');
    Route::post('archivo/createchartimage','MainController@createchartimage')->name('createchartimage');
    Route::get('descargasporpais/{filename?}', 'MainController@downstatscountry');
    /*Route::get('descargasporpais/{filename?}', function($filename = "noData") {
      return view('downstatscountry', array('filename' => $filename));
    });*/
  });

  Route::post('uploadcsv','MainController@uploadcsv');
  Route::post('listcsvfiles','MainController@listcsvfiles');
});

/********************* [PANEL] ++++++++++++++++++++++++++++*/
/*Route::group([
    'middleware' => 'admin',
    'prefix' => 'admin',
    'namespace' => 'Admin'
], function () {
    Route::get('/panel', 'AdminController@panel');
    Route::get('/series', 'SeriesController@index');
    Route::get('/series/{id}', 'SeriesController@edit');
});*/

Route::group(['middleware' => 'admin', 'prefix' => 'admin'], function () {
    Route::get('/panel', 'AdminController@panel');

});
