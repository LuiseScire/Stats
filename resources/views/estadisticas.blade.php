@extends('layouts.master')

@section('title', 'Estadísticas')

@section('css')
    <style>
      .chart-images{display: block;}

      .angle-panel-collapse{
        font-weight: bold;
        cursor: pointer;
        font-size: 20px;
      }

      @media (max-width: 600px) {
        .custom-btn-block{
          display: block;
          width: 100%;
          margin-top: 10px;
        }
      }

      @media (min-width: 600px) {
        .custom-btn-block{
          display: block;
          width: 100%;
          margin-top: 10px;
        }
      }

      @media (min-width: 768px)  {
        .custom-btn-block{
          display: block;
          width: 100%;
        }
      }

      @media (max-width: 768px)  {
        .custom-btn-block{
          display: block;
          width: 100%;
        }
      }

      @media (min-width: 992px) {
        .custom-btn-block {
          display: inline-block;
          width: auto;
        }
      }

      @media (min-width: 1200px) {
        .custom-btn-block {
          display: inline-block;
          width: auto;
        }
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

        <!-- [CHART TIPO] -->
        <div id="chartPanelTipo" class="panel panel-primary" style="display: none;">
          <div class="panel-heading">
            <h4>
              <i class="fa fa-bar-chart"></i>
              <span id="panelTitleTipo"></span>
              <span class="pull-right angle-panel-collapse" title="Ocultar"><i class="fa fa-angle-up fa-lg"></i></span>
            </h4>
          </div>
          <div class="panel-body collapse-up">
            <div id="chartContentTipo"></div>
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
            </div>
          </div>
        </div>

        <!-- [CHART TEXTO] -->
        <div id="chartPanelText" class="panel panel-primary" style="display: none">
          <div class="panel-heading">
            <h4>
              <i class="fa fa-bar-chart"></i>
              <span id="panelTitleText"></span>
              <span class="pull-right angle-panel-collapse" title="Ocultar"><i class="fa fa-angle-up fa-lg"></i></span>
            </h4>
          </div>
          <div class="panel-body collapse-up">
            <div id="chartContentText"></div>
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
            </div>
          </div>
        </div>

        <!-- [CHART REVISTA] -->
        <div id="chartPanelJournal" class="panel panel-primary" style="display: none">
          <div class="panel-heading">
            <h4>
              <i class="fa fa-bar-chart"></i>
              <span id="panelTitleJournal"></span>
              <span class="pull-right angle-panel-collapse" title="Ocultar"><i class="fa fa-angle-up fa-lg"></i></span>
            </h4>
          </div>
          <div class="panel-body collapse-up">
            <div id="chartContentJournal"></div>
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
            </div>
          </div>
        </div>

        <!-- [CHART NÚMERO] -->
        <div id="chartPanelNumber" class="panel panel-primary" style="display: none">
          <div class="panel-heading">
            <h4>
              <i class="fa fa-bar-chart"></i>
              <span id="panelTitleNumber"></span>
              <span class="pull-right angle-panel-collapse" title="Ocultar"><i class="fa fa-angle-up fa-lg"></i></span>
            </h4>
          </div>
          <div class="panel-body collapse-up">
            <div id="chartContentNumber"></div>
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
            </div>
          </div>
        </div>


        <!-- [CHART PAÍS] -->
        <div id="chartPanelCountries" class="panel panel-primary" style="display: none">
          <div class="panel-heading">
            <h4>
              <i class="fa fa-bar-chart"></i>
              <span id="panelTitleCountries"></span>
              <span class="pull-right angle-panel-collapse" title="Ocultar"><i class="fa fa-angle-up fa-lg"></i></span>
            </h4>
          </div>
          <div class="panel-body collapse-up">
            <div id="chartContentCountries"></div>
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
            </div>
          </div>
        </div>

        <!-- [CHART MES] -->
        <div id="chartPanelMonths" class="panel panel-primary" style="display: none">
          <div class="panel-heading">
            <h4>
              <i class="fa fa-bar-chart"></i>
              <span id="panelTitleMonths"></span>
              <span class="pull-right angle-panel-collapse" title="Ocultar"><i class="fa fa-angle-up fa-lg"></i></span>
            </h4>
          </div>
          <div class="panel-body collapse-up">
            <div id="chartContentMonths"></div>
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
            </div>
          </div>
        </div>

        <!-- [CHART TOTAL] -->
        <div id="chartPanelTotal" class="panel panel-primary" style="display: none">
          <div class="panel-heading">
            <h4>
              <i class="fa fa-bar-chart"></i>
              <span id="panelTitleTotal"></span>
              <span class="pull-right angle-panel-collapse" title="Ocultar"><i class="fa fa-angle-up fa-lg"></i></span>
            </h4>
          </div>
          <div class="panel-body collapse-up">
            <div id="chartContentTotal"></div>
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
            </div>
          </div>
        </div>



        <!-- deprecated -->

        <div id="totalDownloadsPanel" class="panel panel-primary">
          <div class="panel-heading">
            <h4>
              <i class="fa fa-bar-chart"></i>
              Descargas Totales
              <span class="pull-right angle-panel-collapse" title="Ocultar"><i class="fa fa-angle-up fa-lg"></i></span>
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
              <span class="pull-right angle-panel-collapse" title="Ocultar"><i class="fa fa-angle-up fa-lg"></i></span>
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
              <span class="pull-right angle-panel-collapse" title="Ocultar"><i class="fa fa-angle-up fa-lg"></i></span>
            </h4>
          </div>
          <div class="panel-body collapse-up">
            <div id="countryDownloadsChart"></div>
            <!--<div id="piechart" style="width: 100%; height: 500px; display:none" class="hide"></div>-->
            <hr>
            <div class="col-lg-12">
              <div class="text-right">
                <button id="breakdownButton" class="btn btn-primary custom-btn-block"><i class="fa fa-pie-chart"></i> Desglose por porcentaje</button>
                <a href="{{ url('estadisticas/descargasporpais/'.$filename) }}" class="btn btn-primary custom-btn-block">Ver gráfica completa <i class="fa fa-external-link"></i></a>
                <div class="btn-group">
                  <div class="dropdown dropup">
                    <button class="btn btn-primary custom-btn-block dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                      Exportar como:
                      <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                      <li><a href="javascript:void(0)" class="export-action" data-charttype="country" data-typeexport="png"><i class="fa fa-image"></i> Imagen PNG</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div id="countryDesglosDownloadsPanel" class="panel panel-primary hide" style="display:none">
          <div class="panel-heading">
            <h4>
              <i class="fa fa-pie-chart"></i>
              Desglose por porcentaje
              <span class="pull-right angle-panel-collapse" title="Ocultar"><i class="fa fa-angle-up fa-lg"></i></span>
            </h4>
          </div>
          <div class="panel-body collapse-up">
            <div id="piechart" style="width: 100%; height: 500px;"></div>
            <hr>
            <div class="text-right">
              <div class="btn-group custom-btn-block">
                <div class="dropdown dropup">
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
              </div>

              <div class="btn-group custom-btn-block">
                <div class="dropdown dropup">
                  <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                    Exportar como:
                    <span class="caret"></span>
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                    <li><a href="javascript:void(0)" class="export-action" data-charttype="country" data-typeexport="png"><i class="fa fa-image"></i> Imagen PNG</a></li>
                  </ul>
                </div>
              </div>
            </div>


            <!--<div class="col-md-4 col-lg-3 margin">

            </div>

            <div class="col-md-3 col-lg-2 margin pull-right">

            </div>-->


          </div>
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
