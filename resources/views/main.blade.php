@extends('layouts.master')

@section('title', 'Inicio')

@section('css')
<style media="screen">
  #uploadFilesContent i.upload{
    transform: scale(0.8);
    opacity: 0.3;
    font-size: 50px;
    margin-bottom: 1rem;
  }

</style>
@stop

@section('sidebar')
    @parent
@stop

@section('content')
<div class="row">
  <div class="col-lg-12">
    <div class="addres-bar-content-header">
      <h1>Inicio</h1>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><label><i class="fa fa-home"></i> Inicio</label></li>
        <li class="current-date pull-right"><span><i class="fa fa-calendar"></i> <span id="current-date"></span></span></li>
      </ol>
    </div>
  </div>
</div>

<div id="panelsHeading" class="row" style="display: none">
  <div class="col-lg-4 col-md-8">
    <div class="panel panel-primary">
      <div class="panel-heading">
        <div class="row">
          <div id="panelTotalIcon" class="col-xs-4">
            <!--<i class="fa fa-circle fa-5x"></i>-->
          </div>
          <div class="col-xs-8 text-right">
            <div id="panelTotals" class="huge"></div>
            <div id="panelTotalsText"></div>
          </div>
        </div>
      </div>
      <a id="panelTotalsDetails">
        <div class="panel-footer">
          <span class="pull-left">Ver Detalles</span>
          <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>
          <div class="clearfix"></div>
        </div>
      </a>
    </div>
  </div>
  <div class="col-lg-4 col-md-8">
    <div class="panel panel-green">
      <div class="panel-heading">
        <div class="row">
          <div class="col-xs-4">
            <i class="fa fa-globe fa-5x"></i>
          </div>
          <div class="col-xs-8 text-right">
            <div id="panelCountries" class="huge">12</div>
            <div>Países</div>
          </div>
        </div>
      </div>
      <a id="panelCountriesDetails">
        <div class="panel-footer">
          <span class="pull-left">Ver Detalles</span>
          <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>
          <div class="clearfix"></div>
        </div>
      </a>
    </div>
  </div>
  <div class="col-lg-4 col-md-8">
    <div class="panel panel-yellow">
      <div class="panel-heading">
        <div class="row">
          <div class="col-xs-4">
            <i class="fa fa-line-chart fa-5x"></i>
          </div>
          <div class="col-xs-8 text-right">
            <div id="panelMainCountry" class="huge"></div>
            <div id="panelMainCountryText"></div>
          </div>
        </div>
      </div>
      <a id="panelMainCountryDetails">
        <div class="panel-footer">
          <span class="pull-left">Ver Detalles</span>
          <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>
          <div class="clearfix"></div>
        </div>
      </a>
    </div>
  </div>
  <!--<div class="col-lg-3 col-md-6">
    <div class="panel panel-red">
      <div class="panel-heading">
        <div class="row">
          <div class="col-xs-3">
            <i class="fa fa-support fa-5x"></i>
          </div>
          <div class="col-xs-9 text-right">
            <div class="huge">13</div>
            <div>Support Tickets!</div>
          </div>
        </div>
      </div>
    </div>
  </div>-->
</div>

<div class="row">
  <div class="col-md-12 col-lg-12 col-xs-12">
    <div id="uploadFilesContent" class="jumbotron" style="text-align: center; border-style: dashed; background-color: white; border-color: #eee;">
      <input type="file" id="csvFile" name="csvFile" style="display: none">
      <h2>Seleccione su archivo CSV para subirlo</h2>
      <p><i class="fa fa-upload upload" aria-hidden="true"></i></p>
      <p><a id="csvFileButton" class="btn btn-primary btn-lg" href="#" role="button" onclick="starInputFile()"> <i class="fa fa-folder-open"></i> Explorar Archivos</a></p>
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
          Archivo <strong id="strongFileName"></strong> subido correctamente
          <button id="cambiarArchivo" class="btn btn-primary btn-xs"> <i class="fa fa-folder-open"></i> Cambiar archivo</button>
          <!--¿Deseas
          <a href="javascript:void(0)" id="cambiarArchivo"><strong>cambiar el archivo</strong></a>
          o
          <a href="javascript:void(0)" id="uploadFileConfirmed"><strong>continuar</strong></a>
          ?-->
        </p>
      </div>
       <hr>
    </div>

    <div class="col-lg-12">
      <div id="loadPreviewText" class="alert alert-warning" style="text-align: center; display:none" role="alert">
        <strong>Cargando vista previa del archivo</strong>
      </div>
    </div>

    <div id="preView" style="display:none;">
      <table id="preViewTable" class="table table-striped">
        <thead>
        </thead>
      </table>
    </div>


  </div>

</div>
@stop

@section('javascript')
  <script>

  </script>
  <script type="text/javascript" src="{{ asset('js/statsarrays.js') }}"></script>
  <script type="text/javascript" src="{{ asset('js/main2.js') }}"></script>
  <script type="text/javascript" src="{{ asset('js/uploadcsv.js') }}"></script>


@stop
