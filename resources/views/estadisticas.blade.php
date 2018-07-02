@extends('layouts.master')

@section('title', 'Estadísticas')

@section('css')
    <style media="screen">
      .chart-images{display: block;}


      .angle_panel_collapse{
        font-weight: bold;
        cursor: pointer;
        font-size: 20px;
      }

    </style>
@stop

@section('sidebar')
    @parent
@stop

@section('content')
<!--<div class="row">
    <div class="col-lg-12">
        <h1 class="page-header">Dashboard</h1>
    </div>
</div>-->

<div class="row">
  <div class="col-lg-12">
    <div class="address-bar-content-header">
      <h1>Estadísticas</h1>
      <ol class="breadcrumb">
        <li class="address-item"><a href="{{ url('home') }}"><i class="fa fa-home"></i> Home</a></li>
        <li class="address-item"><label><i class="fa fa-bar-chart"></i> Estadísticas</label></li>
        <li class="current-date pull-right"><span><i class="fa fa-calendar"></i> <span id="current-date"></span></span></li>
      </ol>
    </div>
  </div>
</div>

<div id="chartsContent" style="display:none">
  <div class="row">
    <div class="col-lg-12">
      <!--<div id="noDataText" class="alert alert-info" role="alert">Documento: <strong>{{ $filename }}</strong></div>-->
        <div id="totalDownloadsPanel" class="panel panel-primary">
          <div class="panel-heading">
            <h4>
              <i class="fa fa-bar-chart"></i>
              Descargas Totales
              <span class="pull-right angle_panel_collapse" title="Ocultar"><i class="fa fa-angle-up fa-lg"></i></span>
            <h4>
          </div>
          <div class="panel-body collapse-up">
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

        <div id="totalDownloadsMonthPanel" class="panel panel-primary">
          <div class="panel-heading">
            <h4>
              <i class="fa fa-bar-chart"></i>
              Descargas Mensuales
              <span class="pull-right angle_panel_collapse" title="Ocultar"><i class="fa fa-angle-up fa-lg"></i></span>
            </h4>
          </div>
          <div class="panel-body collapse-up">
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

        <div id="countryDownloadsPanel" class="panel panel-primary">
          <div class="panel-heading">
            <h4>
              <i class="fa fa-bar-chart"></i>
              Descargas por País
              <span class="pull-right angle_panel_collapse" title="Ocultar"><i class="fa fa-angle-up fa-lg"></i></span>
            </h4>
          </div>
          <div class="panel-body collapse-up">
            <div id="countryDownloadsChart"></div>
            <div id="piechart" style="width: 100%; height: 500px; display:none" class="hide"></div>
            <hr>
            <div class="col-lg-12" style="text-align: right">
              <div class="dropdown dropup" style="display: inline-block">
                <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                  Desglose por porcentaje:
                  <span class="caret"></span>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                  <li><a href="javascript:void(0)" class="porcent" data-porcent="90">90%</a></li>
                  <li><a href="javascript:void(0)" class="porcent" data-porcent="80">80%</a></li>
                  <li><a href="javascript:void(0)" class="porcent" data-porcent="70">70%</a></li>
                  <li><a href="javascript:void(0)" class="porcent" data-porcent="60">60%</a></li>
                  <li><a href="javascript:void(0)" class="porcent" data-porcent="50">50%</a></li>
                </ul>
              </div>

              <a href="{{ url('estadisticas/descargasporpais/'.$filename) }}" style="text-decoration: none; display: inline-block">
                <!--Ver gráfica completa <i class="fa fa-external-link"></i>-->
                <button type="button" name="button" class="btn btn-primary">Ver gráfica completa <i class="fa fa-external-link"></i></button>
              </a>

              <div class="dropdown dropup" style="display: inline-block">
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

</div>



<div class="row">

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
  var target = "{{ $target }}";
  var getCsvFile = "{{ asset('/csvfiles/'.$filename) }}";
</script>
<script type="text/javascript" src="{{ asset('js/pluggins/download.js') }}"></script>
<script type="text/javascript" src="{{ asset('js/statsarrays.js') }}"></script>
<script type="text/javascript" src="{{ asset('js/estadisticas.js') }}"></script>

@stop
