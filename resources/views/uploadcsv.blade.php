@extends('layouts.master')

@section('title', 'Subir CSV')

@section('sidebar')
  @parent
@stop


@section('content')
<div class="row">
  <div class="col-lg-12">
    <div class="address-bar-content-header">
      <h1>Subir CSV</h1>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="{{ url('home') }}"><i class="fa fa-home"></i> Home</a></li>
        <li class="breadcrumb-item"><label><i class="fa fa-upload"></i> Subir CSV</label> </li>
        <li class="current-date pull-right"><span><i class="fa fa-calendar"></i> <span id="current-date"></span></span></li>
      </ol>
    </div>
  </div>
  
  <div id="inputFileContent" class="col-lg-12">
    <input type="file" id="csvFile" name="csvFile">
  </div>

  <div id="progressBarContent" class="col-lg-12" style="display: none">
    <div class="progress">
      <div id="uploadProgressBar" class="progress-bar progress-bar-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100">
      </div>
    </div>
	</div>

  <div id="confirmFileContent" class="col-lg-12" style="display:none">
    <div id="loadInfoText" class="alert alert-success" role="alert">
        <p>
          Archivo <strong id="strongFileName"></strong> subido correctamente ¿Deseas
          <a href="javascript:void(0)" id="cambiarArchivo"><strong>cambiar el archivo</strong></a>
          o
          <a href="javascript:void(0)" id="uploadFileConfirmed"><strong>continuar</strong></a>
          ?
        </p>
    </div>
    <!--<button type="button" id="cambiarArchivo" name="button" class="btn btn-default">Cambiar Archivo</button>
    <button type="button" id="uploadFileConfirmed" name="button" class="btn btn-primary">Continuar</button>-->
    <hr>
  </div>
  <div class="col-lg-12">
    <div id="loadPreviewText" class="alert alert-warning" style="text-align: center; display:none" role="alert">
      <strong>Cargando vista previa del archivo</strong>
    </div>


    <!-- class col-lg-12 removed-->
    <div id="preView"></div>

  </div>
</div>

@stop

@section('javascript')
     <script type="text/javascript" src="{{ asset('js/uploadcsv.js') }}"/></script>
@stop
