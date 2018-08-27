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


/********************* [GLOBAL] ++++++++++++++++++++++++++++*/
Route::get('/', function () {
    return redirect()->route('home');
});

Route::post('updateLang', 'MainController@updateLang');
/********************* [JOURNAL PANEL] ++++++++++++++++++++++++++++*/
Route::group(['middleware' => 'journal'], function() {
  Route::get('/home', 'MainController@home')->name('home');

  Route::get('/historial', 'MainController@historial')->name('historial');
  Route::get('/subircsv', 'MainController@subircsv')->name('subircsv');
  Route::get('/testpath', 'MainController@test');

  Route::group(['prefix' => 'estadisticas'], function () {
    Route::get('archivo/{filename?}/{target?}', 'MainController@stats');
    Route::post('readcsv','MainController@readcsv');
    // Route::post('archivo/getdatacsv', 'MainController@getdatacsv')->name('getdatacsv');
    Route::post('archivo/getdatafiles', 'MainController@getDataFiles')->name('getdatafiles');
    Route::post('descargasporpais/getdatacsv2', 'MainController@getdatacsv2')->name('getdatacsv2');
    Route::post('archivo/createchartimage','MainController@createchartimage')->name('createchartimage');
    Route::get('descargasporpais/{filename?}', 'MainController@downstatscountry');
    /*Route::get('descargasporpais/{filename?}', function($filename = "noData") {
      return view('downstatscountry', array('filename' => $filename));
    });*/
  });

  Route::post('uploadcsv','MainController@uploadcsv');
  Route::post('files','MainController@files');
  Route::post('readxml', 'MainController@readxml');
  Route::post('lastcsv', 'MainController@lastcsv')->name('lastcsv');
  Route::post('listcsvfiles','MainController@listcsvfiles');

  /********************* [JOURNAL ADMIN PANEL] ++++++++++++++++++++++++++++*/
  Route::group(['middleware' => 'jadmin'], function () {
    Route::match(['get', 'post'], 'users', 'JadminController@users');
    Route::post('/userregister', 'JadminController@registerUser')->name('userregister');
  });
});

/********************* [ADMIN PANEL] ++++++++++++++++++++++++++++*/
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
    Route::post('/users', 'AdminController@users');
    Route::post('/userregister', 'AdminController@registerUser');
});
