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
//Route::get('/home', 'HomeController@index')->name('home');
Route::get('/home', 'MainController@home')->name('home');

// Generating URLs...
//$url = route('home');

Route::get('/', function () {
    // Generating Redirects...
    return redirect()->route('home');
});


/*Route::get('home', function () {
    return view('main');
});*/

Route::get('/subircsv', 'MainController@subircsv')->name('subircsv');
/*Route::get('subircsv', function () {
    return view('uploadcsv');
});*/
Route::get('/testpath', 'MainController@test');

//Route::get('estadisticas/{filename}', 'MainController@estadisticas');
Route::group(['prefix' => 'estadisticas'], function () {
  Route::get('archivo/{filename?}', 'MainController@stats');
    /*Route::get('archivo/{filename?}', function ($filename = "noData"){
        // Matches The "/admin/users" URL
        return view('estadisticas', array('filename' => $filename));
    });*/

  Route::post('readcsv','MainController@readcsv');
  Route::post('createchartimage','MainController@createchartimage');
  Route::get('descargasporpais/{filename?}', 'MainController@downstatscountry');
  /*Route::get('descargasporpais/{filename?}', function($filename = "noData") {
    return view('downstatscountry', array('filename' => $filename));
  });*/
});

Route::post('uploadcsv','MainController@uploadcsv');
Route::post('listcsvfiles','MainController@listcsvfiles');
