@extends('layouts.master')

@section('title', 'Subir CSV')

@section('sidebar')
  @parent
@stop


@section('content')
<div class="row">
    <div id="inputFileContent" class="col-lg-12">
      <input type="file" id="csvFile" name="csvFile">
    	<div id="nameVideo" class="nameMiVideo"></div>
    	<div id="seconds" class="seconds" style="display: none">
        <div id="uploadProgressBar" style="color: red"></div>
    	</div>
      <div id="status"></div>
    </div>
    <div id="confirmFileContent" class="col-lg-12" style="display:none">
      <button type="button" id="cambiarArchivo" name="button" class="btn btn-default">Cambiar Archivo</button>
      <button type="button" id="uploadFileConfirmed" name="button" class="btn btn-primary">Continuar</button>
      <hr>
    </div>

    <div class="col-lg-12">
      <div id="loadPreviewText" class="alert alert-warning" style="text-align: center; display:none" role="alert">
        <strong>Cargando vista previa del archivo</strong>
      </div>

      <div id="preView" class="col-lg-12"></div>

    </div>
</div>




@stop

@section('javascript')
     <script type="text/javascript" src="{{ asset('js/uploadcsv.js') }}"/></script>
@stop
