@extends('layouts.master')

@section('title', 'Subir CSV')

@section('sidebar')
  @parent
@stop


@section('content')
<div class="row">
    <div class="col-lg-12">
      <input type="file" id="csvFile" name="csvFile">
    	<div id="nameVideo" class="nameMiVideo"></div>
    	<div id="seconds" class="seconds" style="display: none">
        <div id="uploadProgressBar" style="color: red"></div>
    	</div>
      <div id="status"></div>
    </div>

    <div id="confirmFileContent" class="col-lg-12" style="display:none">
      <button type="button" name="button">Cambiar Archivo</button>
      <button id="uploadFileConfirmed" type="button" name="button">Subir Archivo</button>
    </div>
</div>

<div class="row">
  <div id="loadPreviewText" class="col-lg-12" style="text-align: center; display:none">
    Cargando vista previa del documento
  </div>
  <div id="preView" class="col-lg-12">

  </div>
</div>


@stop

@section('javascript')
     <script type="text/javascript" src="{{ asset('js/uploadcsv.js') }}"/></script>
@stop
