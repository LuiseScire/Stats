@extends('layouts.master')

@section('title', 'Estadísticas')

@section('css')
    <style media="screen">
      .chart-images{display: none;;}
    </style>
@stop

@section('sidebar')
    @parent
@stop

@section('content')
<div class="row">
  <div class="col-lg-12">
    <div id="noDataText" class="alert alert-info" role="alert">Documento: <strong>{{ $filename }}</strong></div>

    <div id="chartsContent" class="row" style="display:none">

      <div class="alert alert-info" role="alert">Documento: <strong>{{ $filename }}</strong></div>

      <div class="panel panel-default">
        <div class="panel-heading">Descargas Totales</div>
        <div class="panel-body">
          <div id="chartTotalDownloads"></div>
          <div id="chartTotalDownloadsImage" class="chart-images"></div>
          <hr>
          <div class="col-lg-12">
            <div class="dropdown pull-right">
              <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                Exportar como:
                <span class="caret"></span>
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                <li><a href="javascript:void(0)" class="export-action" data-charttype="total" data-typeexport="jpg"><i class="fa fa-image"></i> Imagen JPG/JPEG</a></li>
                <li><a href="javascript:void(0)" class="export-action" data-charttype="total" data-typeexport="png"><i class="fa fa-image"></i> Imagen PNG</a></li>
              </ul>
            </div>
            <!-- /.dropdown-->
          </div>
          <!-- /.col-lg-12 -->
        </div>
        <!-- /.panel-body -->

        <!-- adicional data -> Table
        <table class="table">
          ...
        </table>-->
      </div>

      <div class="panel panel-default">
        <div class="panel-heading">Descargas Mensuales</div>
        <div class="panel-body">
          <div id="chartTotalDownloadsMonth"></div>
          <div id="chartTotalDownloadsMonthImage" class="chart-images"></div>
          <hr>
          <div class="col-lg-12">
            <div class="dropdown pull-right">
              <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                Exportar como:
                <span class="caret"></span>
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                <li><a href="javascript:void(0)" class="export-action" data-charttype="month" data-typeexport="jpg"><i class="fa fa-image"></i> Imagen JPG/JPEG</a></li>
                <li><a href="javascript:void(0)" class="export-action" data-charttype="month" data-typeexport="png"><i class="fa fa-image"></i> Imagen PNG</a></li>
              </ul>
            </div>
            <!-- /.dropdown -->
          </div>
          <!-- /.col-lg-12 -->
        </div>
        <!-- /.panel-body -->
      </div>

      <div class="panel panel-default">
        <div class="panel-heading">Descargas por País</div>
        <div class="panel-body">
          <div id="chartCountryDownloads"></div>
          <div id="chartCountryDownloadsImage" class="chart-images"></div>
          <hr>
          <div class="col-lg-12">
            <div class="dropdown pull-right">
              <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                Exportar como:
                <span class="caret"></span>
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                <li><a href="javascript:void(0)" class="export-action" data-charttype="country" data-typeexport="jpg"><i class="fa fa-image"></i> Imagen JPG/JPEG</a></li>
                <li><a href="javascript:void(0)" class="export-action" data-charttype="country" data-typeexport="png"><i class="fa fa-image"></i> Imagen PNG</a></li>
              </ul>
            </div>
            <!-- /.dropdown -->
          </div>
          <!-- /.col-lg-12 -->
        </div>
        <!-- /.panel-body -->
      </div>

    </div>

  </div>


</div>

@stop

@section('javascript')

<script type="text/javascript">
  var fileName = '{{ $filename }}';
</script>
<script type="text/javascript" src="{{ asset('js/statsarrays.js') }}"></script>
<script type="text/javascript" src="{{ asset('js/estadisticas.js') }}"></script>

@stop
