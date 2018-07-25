@extends('layouts.master')

@section('title', 'Estadísticas')

@section('css')
    <style>
      .chart-images{display: block;}

      .angle-panel-collapse{
        font-weight: bold;
        cursor: pointer;
        /*font-size: 20px;*/
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


      /*css for list countries in panel countries*/
      .c-progress{
        height: 4px;
        background-color: #eaeef3;
        border-radius: 4px;
        margin-bottom: 10px;
        margin-top: 10px;
      }

      .c-progress-bar{
        height:4px;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        background: #A41C1E;
        background: linear-gradient(to right, #E05740 , #A41C1E);

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
      <h1 id="titlePage"></h1>
      <ol class="breadcrumb">
        <li class="address-item"><a href="{{ url('home') }}"><i class="fa fa-home"></i> Inicio</a></li>
        <li class="address-item"><label><i class="fa fa-bar-chart"></i> Estadísticas</label></li>
        <li class="current-date pull-right"><span><i class="fa fa-calendar"></i> <span id="current-date"></span></span></li>
      </ol>
    </div>
  </div>
  <div class="col-md-12 col-xs-12">
    <label id="chartOptions" class="pull-right" style="cursor: pointer"> Opciones de gráficas <i class="fa fa-gear"></i></label>
  </div>
</div>

<div id="chartsContent" style="display:none">

  <div id="chartPanelTotal" class="row">
    <div class="col-lg-4 col-md-6">
      <div class="panel panel-primary">
        <div class="panel-heading">
          <div class="row">
            <div id="panelTotalIcon" class="col-xs-3">
              <i class="fa fa-globe fa-5x"></i>
            </div>
            <div class="col-xs-9 text-right">
              <div id="panelCountContinents" class="huge">0</div>
              <div>Continentes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-4 col-md-6">
      <div class="panel panel-green">
        <div class="panel-heading">
          <div class="row">
            <div class="col-xs-3">
              <i class="fa fa-flag fa-5x"></i>
            </div>
            <div class="col-xs-9 text-right">
              <div id="panelCountCountries" class="huge">0</div>
              <div>Países</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-4 col-md-6">
      <div class="panel panel-default">
        <div class="panel-heading">
          <div class="row">
            <div class="col-xs-3">
              <i id="panelTypeReport" class="fa fa-5x"></i>
            </div>
            <div class="col-xs-9 text-right">
              <div id="panelTotalType" class="huge">0</div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--<div class="col-lg-3 col-md-6">
      <div class="panel panel-yellow">
        <div class="panel-heading">
          <div class="row">
            <div class="col-xs-3">
              <i class="fa fa-trophy fa-5x"></i>
            </div>
            <div class="col-xs-9 text-right">
              <div id="panelMainCountry" class="huge">0</div>
              <div id="panelMainCountryText"></div>
            </div>
          </div>
        </div>
      </div>
    </div>-->
  </div>


  <div class="row">
    <div class="col-lg-12">
      <!--<div id="noDataText" class="alert alert-info" role="alert">Documento: <strong>{{ $filename }}</strong></div>-->

        <!-- [CHART PAÍS] -->
        <div id="chartPanelCountries" class="panel" style="display: none">
          <div class="panel-heading">
            <h4>
              <i class="fa fa-globe"></i>
              <span id="panelTitleCountries"></span>
              <div class="dropdown pull-right">
                <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                  <span class="fa fa-bars"></span>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                  <li><a href="{{ url('estadisticas/descargasporpais/'.$filename) }}"><i class="fa fa-list"></i> Más detalles <i class="fa fa-external-link"></i></a></li>
                  <li class="divider"></li>
                  <li><a href="javascript:void(0)" class="export-action" data-charttype="country" data-typeexport="png"><i class="fa fa-image"></i> Descargar Imagen PNG</a></li>
                  <!--<li class="divider"></li>
                  <li>
                    <a href="javascript:void(0)" class="angle-panel-collapse">Ocultar</a>
                  </li>-->
                </ul>
              </div>
            </h4>
          </div>
          <div class="panel-body collapse-up">
            <div class="col-md-8 col-xs-12">
              <div id="chartContentCountries"></div>
            </div>
            <div class="col-md-4 col-xs-12">
                <input id="searchCountry" type="text" class="form-control" style="font-family: Arial, FontAwesome" placeholder="&#xF002; Buscar país">
                <div id="countriesList"  style="overflow: auto; max-height: 400px;">
                    <!--<h5 style="color: #72777a; font-weight: bold">100K</h5>
                    <small style="color: #72777a">Visitantes de </small>
                    <span class="pull-right">50%</span>
                    <div class="c-progress">
                      <div class="c-progress-bar">
                      </div>
                    </div>-->
                </div>    
            </div>  
            

            <div class="col-md-12 text-center" style="display: inline-block">
              <hr>
            </div>

            <div class="col-md-3">
              <i class="fa fa-globe" style="color: dodgerblue;"></i>
              <span id="totalContinentes" style="color: #72777a; font-weight: bold;"></span>
              <span style="color: #72777a"> Continentes </span>
            </div>
            <div class="col-md-3">
              <i class="fa fa-flag" style="color: darkgreen;"></i>
              <span id="totalCountries" style="color: #72777a; font-weight: bold;"></span>
              <span style="color: #72777a;"> Países</span>
            </div>
            <div class="col-md-3 totalType">
              <i id="itotalType" class="fa"></i>
              <span id="totalType" style="color: #72777a; font-weight: bold;"></span>
              <span style="color: #72777a;"></span>
            </div>
            <div class="col-md-3 mainCountry">
              <i class="fa fa-trophy" style="color: gold"></i>
              <span id="mainCountry" style="color: #72777a; font-weight: bold;"></span>
              <span style="color: #72777a"></span>
            </div>

          </div>


        </div>

        <!-- [CHART MES] -->
        <div id="chartPanelMonths" class="panel" style="display: none">
          <div class="panel-heading">
            <h4>
              <i class="fa fa-calendar"></i>
              <span id="panelTitleMonths"></span>
              <div class="dropdown pull-right">
                <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                  <span class="fa fa-bars"></span>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                  <li><a href="javascript:void(0)" class="export-action" data-charttype="month" data-typeexport="png"><i class="fa fa-image"></i> Descargar Imagen PNG</a></li>
                  <!--<li class="divider"></li>
                  <li>
                    <a href="javascript:void(0)" class="angle-panel-collapse">Ocultar</a>
                  </li>-->
                </ul>
              </div>
            </h4>
          </div>
          <div class="panel-body collapse-up">
              <div class="col-md-8">
                  <div id="chartContentMonths"></div>
              </div>
              <div id="monthsList" class="col-md-4 col-xs-12" style="overflow: auto; max-height: 400px;"></div>

              <div class="col-md-12 text-center" style="display: inline-block">
                  <hr>
              </div>
              <div class="col-md-12 text-center">
                  <div class="col-md-6 totalType">
                      <i id="itotalTypeMonth" class="fa"></i>
                      <span id="totalMonth" style="color: #72777a; font-weight: bold;"></span>
                      <span style="color: #72777a;"></span>
                  </div>
                  <div class="col-md-6">
                      <span id="monthUp" style="color: #72777a; font-weight: bold;"></span>
                      <span style="color: #72777a">  </span>
                      <i class="fa fa-level-up fa-lg" style="color: green;"></i>
                  </div>
              </div>

          </div>

        </div>

        <!-- [CHART REVISTA] -->
        <div id="chartPanelJournal" class="panel" style="display: none">
          <div class="panel-heading">
            <h4>
              <i class="fa fa-bar-chart"></i>
              <span id="panelTitleJournal"></span>
              <div class="dropdown pull-right">
                <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                  <span class="fa fa-bars"></span>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                  <li><a href="javascript:void(0)" class="export-action" data-charttype="journal" data-typeexport="png"><i class="fa fa-image"></i> Descargar Imagen PNG</a></li>
                  <!--<li class="divider"></li>
                  <li>
                    <a href="javascript:void(0)" class="angle-panel-collapse">Ocultar</a>
                  </li>-->
                </ul>
              </div>
            </h4>
          </div>
          <div class="panel-body collapse-up">
            <div id="chartContentJournal"></div>
          </div>
        </div>

        <!-- [CHART NÚMERO] -->
        <div id="chartPanelNumber" class="panel" style="display: none">
          <div class="panel-heading">
            <h4>
              <i class="fa fa-bar-chart"></i>
              <span id="panelTitleNumber"></span>
              <div class="dropdown pull-right">
                <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                  <span class="fa fa-bars"></span>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                  <li><a href="javascript:void(0)" class="export-action" data-charttype="number" data-typeexport="png"><i class="fa fa-image"></i> Descargar Imagen PNG</a></li>
                  <!--<li class="divider"></li>
                  <li>
                    <a href="javascript:void(0)" class="angle-panel-collapse">Ocultar</a>
                  </li>-->
                </ul>
              </div>
            </h4>
          </div>
          <div class="panel-body collapse-up">
            <div id="chartContentNumber"></div>

          </div>
        </div>



        <!-- [CHART CIUDAD] -->
        <div id="chartPanelCity" class="panel" style="display: none">
          <div class="panel-heading">
            <h4>
              <i class="fa fa-bar-chart"></i>
              <span id="panelTitleCity"></span>
              <div class="dropdown pull-right">
                <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                  <span class="fa fa-bars"></span>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                  <li><a href="javascript:void(0)" class="export-action" data-charttype="city" data-typeexport="png"><i class="fa fa-image"></i> Descargar Imagen PNG</a></li>
                  <!--<li class="divider"></li>
                  <li>
                    <a href="javascript:void(0)" class="angle-panel-collapse">Ocultar</a>
                  </li>-->
                </ul>
              </div>
            </h4>
          </div>
          <div class="panel-body collapse-up">
            <div id="chartContentCities"></div>

          </div>
        </div>

        <!-- [CHART TEXTO] -->
        <div id="chartPanelText" class="panel" style="display: none">
          <div class="panel-heading">
            <h4>
              <i class="fa fa-bar-chart"></i>
              <span id="panelTitleText"></span>

              <div class="dropdown pull-right">
                <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                  <span class="fa fa-bars"></span>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                  <li><a href="javascript:void(0)" class="export-action" data-charttype="text" data-typeexport="png"><i class="fa fa-image"></i> Descargar Imagen PNG</a></li>
                  <!--<li class="divider"></li>
                  <li>
                    <a href="javascript:void(0)" class="angle-panel-collapse">Ocultar</a>
                  </li>-->
                </ul>
              </div>

              <!--<span class="pull-right" title="Opciones" style="margin-left: 5px;"><i class="fa fa-bars"></i></span>
              <span class="pull-right angle-panel-collapse" title="Ocultar"><i class="fa fa-angle-up fa-lg"></i></span>-->
            </h4>
          </div>
          <div class="panel-body collapse-up">
            <div id="chartContentText"></div>
            <table id="tableContentText" class="table table-striped table-bordered" style="width:100%"></table>
          </div>
        </div>

        <!-- [CHART TIPO] -->
        <div id="chartPanelTipo" class="panel" style="display: none;">
          <div class="panel-heading">
            <h4>
              <i class="fa fa-bar-chart"></i>
              <span id="panelTitleTipo"></span>
              <span class="pull-right" title="Opciones"><i class="fa fa-bars fa-lg"></i></span>
              <div class="dropdown pull-right">
                <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                  <span class="fa fa-bars"></span>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                  <li><a href="javascript:void(0)" class="export-action" data-charttype="type" data-typeexport="png"><i class="fa fa-image"></i> Descargar Imagen PNG</a></li>
                  <!--<li class="divider"></li>
                  <li>
                    <a href="javascript:void(0)" class="angle-panel-collapse">Ocultar</a>
                  </li>-->
                </ul>
              </div>
            </h4>
          </div>
          <div class="panel-body collapse-up">
            <div id="chartContentTipo"></div>
          </div>
        </div>


        <!-- [CHART TOTAL] -->
        <div id="chartPanelTotal_" class="panel" style="display: none">
          <div class="panel-heading">
            <h4>
              <i class="fa fa-circle"></i>
              <span id="panelTitleTotal"></span>
              <div class="dropdown pull-right">
                <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                  <span class="fa fa-bars"></span>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                  <li><a href="javascript:void(0)" id="breakdownButton"><i class="fa fa-pie-chart"></i> Desglose por porcentaje</a></li>
                  <li class="divider"></li>
                  <li><a href="javascript:void(0)" class="export-action" data-charttype="total" data-typeexport="png"><i class="fa fa-image"></i> Descargar Imagen PNG</a></li>
                  <!--<li class="divider"></li>
                  <li>
                    <a href="javascript:void(0)" class="angle-panel-collapse">Ocultar</a>
                  </li>-->
                </ul>
              </div>
            </h4>
          </div>
          <div class="panel-body collapse-up">
            <div id="chartContentTotal"></div>
          </div>
        </div>



        <div id="countryDesglosDownloadsPanel" class="panel hide" style="display:none">
          <div class="panel-heading">
            <h4>
              <i class="fa fa-pie-chart"></i>
              Desglose por porcentaje

              <div class="dropdown pull-right">
                <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                  <span class="fa fa-bars"></span>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                  <li><a href="javascript:void(0)" class="export-action" data-charttype="" data-typeexport="png"><i class="fa fa-image"></i> Descargar Imagen PNG</a></li>
                  <!--<li class="divider"></li>
                  <li><a href="javascript:void(0)" class="angle-panel-collapse">Ocultar</a></li>-->
                </ul>
              </div>

              <select class="form-control pull-right porcents" style="width: 8%; margin-right: 10px; height: 28px;">
                <option value="90">90%</option>
                <option value="80">80%</option>
                <option value="70">70%</option>
                <option value="60">60%</option>
                <option value="50">50%</option>
              </select>
            </h4>
          </div>
          <div class="panel-body collapse-up">
            <div id="piechart" style="width: 100%; height: 500px;"></div>

          </div>
        </div>









        <!-- deprecated -->
        <!--
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
            </div>
          </div>
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
            </div>
          </div>
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

          </div>
        </div>
      -->
    </div>
  </div>

</div>



<div class="row">

  <!--MODALS-->
  <div id="configCharts" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title">Generar gráficas por:</h4>
            </div>
            <div class="modal-body">
              <ul id="chartList" class="list-group">
              </ul>

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
<script type="text/javascript" src="{{ asset('js/stats.js') }}"></script>

@stop
