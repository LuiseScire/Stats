@extends('layouts.master')

@section('title', 'Estadísticas')

@section('css')
    <style media="screen">
      .chart-images{display: block;}
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
          <div id="totalDownloadsChart"></div>
          <hr>
          <div class="col-lg-12">
            <div class="dropdown pull-right">
              <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                Exportar como:
                <span class="caret"></span>
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
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
          <div id="totalDownloadsMonthChart"></div>
          <hr>
          <div class="col-lg-12">
            <div class="dropdown pull-right">
              <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                Exportar como:
                <span class="caret"></span>
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
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
          <div id="countryDownloadsChart"></div>
          <hr>
          <div class="col-lg-12">
            <div class="dropdown pull-right">
              <a href="{{ url('estadisticas/descargasporpais/'.$filename) }}">
                <button type="button" name="button" class="btn btn-primary">Ver gráfica completa <i class="fa fa-external-link"></i></button>
              </a>
              <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                Exportar como:
                <span class="caret"></span>
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
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

  <!--MODALS-->
  <div id="downloadChartImageModal" class="modal fade">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title">title</h4>
            </div>
            <div class="modal-body">

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
            </div>
        </div>
    </div>
</div>
</div>

@stop

@section('javascript')

<script type="text/javascript">
  var fileName = '{{ $filename }}';
</script>
<script type="text/javascript" src="{{ asset('js/pluggins/download.js') }}"></script>
<script type="text/javascript" src="{{ asset('js/statsarrays.js') }}"></script>
<script type="text/javascript" src="{{ asset('js/estadisticas.js') }}"></script>

@stop
