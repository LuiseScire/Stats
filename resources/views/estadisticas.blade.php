@extends('layouts.master')

@section('title', 'Estadísticas')

@section('css')
    <style>
        .chart-images {
            display: block;
        }

        .angle-panel-collapse {
            font-weight: bold;
            cursor: pointer;
            /*font-size: 20px;*/
        }

        @media (max-width: 600px) {
            .custom-btn-block {
                display: block;
                width: 100%;
                margin-top: 10px;
            }
        }

        @media (min-width: 600px) {
            .custom-btn-block {
                display: block;
                width: 100%;
                margin-top: 10px;
            }
        }

        @media (min-width: 768px) {
            .custom-btn-block {
                display: block;
                width: 100%;
            }
        }

        @media (max-width: 768px) {
            .custom-btn-block {
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

        .bg-dodgerblue{
            background-color: dodgerblue !important;
            color: #fff !important;
        }

        .bg-green{
            background-color: #00a65a !important;
            color: #fff !important;
        }

        .bg-aqua{
            background-color: #00c0ef !important;
            color: #fff !important;
        }

        .bg-gold{
            background-color: gold !important;
            color: #fff !important;
        }

        .bg-red{
            background-color: #dd4b39 !important;
            color: #fff !important;
        }

        .bg-darkred{
            background-color: darkred !important;
            color: #fff !important;
        }

        .bg-cadetblue{
            background-color: cadetblue !important;
            color: #fff !important;
        }

        .c-progress {
            height: 4px;
            background-color: #eaeef3;
            border-radius: 4px;
            margin-bottom: 10px;
            margin-top: 10px;
        }



        .c-progress-bar {
            height: 4px;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            background: #A41C1E;
            background: linear-gradient(to right, #E05740, #A41C1E);

        }

        /* info-box-countries  */
        .info-box {
            display: block;
            min-height: 90px;
            background: #fff;
            width: 100%;
            box-shadow: 0 1px 1px rgba(0,0,0,0.1);
            border-radius: 2px;
            margin-bottom: 15px;
        }

        .info-box-icon {
            border-top-left-radius: 2px;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 2px;
            display: block;
            float: left;
            height: 90px;
            width: 90px;
            text-align: center;
            font-size: 60px;
            line-height: 90px;
            background: rgba(0,0,0,0.2);
            padding: 5%;
        }

        .info-box-content {
            padding: 5px 10px;
            margin-left: 90px;
        }

        .info-box-text {
            text-transform: uppercase;
        }

        .progress-description, .info-box-text {
            display: block;
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .info-box-number {
            display: block;
            font-weight: bold;
            font-size: 18px;
        }

        .info-box .progress, .info-box .progress .progress-bar {
            border-radius: 0;
        }
        .info-box .progress {
            background: rgba(0,0,0,0.2);
            margin: 5px -10px 5px -10px;
            height: 2px;
        }
        .progress, .progress>.progress-bar, .progress .progress-bar, .progress>.progress-bar .progress-bar {
            border-radius: 1px;
        }
        .progress, .progress>.progress-bar {
            -webkit-box-shadow: none;
            box-shadow: none;
            background: #fff;
        }
        .progress {
            height: 20px;
            margin-bottom: 20px;
            overflow: hidden;
            background-color: #f5f5f5;
            border-radius: 4px;
            -webkit-box-shadow: inset 0 1px 2px rgba(0,0,0,.1);
            box-shadow: inset 0 1px 2px rgba(0,0,0,.1);
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
                <h3>Datos de archivo: <span id="titlePage" style="color:#ad0004"></span></h3>
                <br>
                <div id="itemFile" class="media">
                   <div class="media-left">
                       <a href="javascript:void(0)" class="csv-file-item seeAgain" data-csvname="">
                          <img class="media-object" src="" alt="icon" width="64px" height="64px">
                      </a>
                   </div>
                   <div class="media-body" style="color: #E05740">
                     <h4 class="media-heading csv-file-item fileNamePanels seeAgain" style="color: #A41C1E; cursor: pointer" data-csvname=""></h4>
                     <span class="fa fa- fa-lg pull-right" style="cursor: pointer"></span><span class="pull-right"></span>
                     <span class="typeReportPanels"></span>
                     <br><small style="color: #72777a"></small>
                   </div>
                </div>
                <ol class="breadcrumb">
                    <li class="address-item"><a href="{{ url('home') }}"><i class="fa fa-home"></i> Inicio</a></li>
                    <li class="address-item"><label><i class="fa fa-bar-chart"></i> Estadísticas</label></li>
                    <li class="current-date pull-right"><span><i class="fa fa-calendar"></i> <span id="currentDateEN" class="date-format-en" style="display:none"></span><span id="currentDateES" class="date-format-es" style="display:none"></span></span></li>
                </ol>
            </div>
        </div>
        <div class="col-md-12 col-xs-12">
            <h4 id="chartOptions" class="pull-right" style="cursor: pointer; color:#A41C1E;"> Configuración <i
                        class="fa fa-gear"></i></h4>
        </div>
    </div>
    <br>
    <div id="chartsContent" style="display:none">
        <div class="row">
            <div class="col-lg-12">
                <div id="chartPanelTotal" style="display:none">
                    <div class="panel" style="border-top: 3px solid gold;">
                        <div class="panel-heading">
                            <h4 style="color: gold;">
                                <i class="fa fa-trophy"></i>
                                <span>Total</span>
                                <!--<div class="dropdown pull-right">
                                    <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        <span class="fa fa-bars"></span>
                                    </button>
                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                                        <li><a href="javascript:void(0)" class="export-action" data-charttype="total"
                                               data-typeexport="png"><i class="fa fa-image"></i> Descargar Imagen PNG</a>
                                        </li>
                                    </ul>
                                </div>-->
                            </h4>
                        </div>
                        <div class="panel-body">
                            <div class="col-lg-4 col-md-6">
                                <div class="panel panel-yellow">
                                    <div class="panel-heading">
                                        <div class="row">
                                            <div class="col-xs-3">
                                                <i id="panelTotalIcon" class="fa fa-5x"></i>
                                            </div>
                                            <div class="col-xs-9 text-right">
                                                <div id="panelTotals" class="huge">0</div>
                                                <div id="panelTotalsTypeReport"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-6">
                                <div class="panel panel-primary">
                                    <div class="panel-heading">
                                        <div class="row">
                                            <div class="col-xs-3">
                                                <i class="fa fa-calendar fa-5x"></i>
                                            </div>
                                            <div class="col-xs-9 text-right">
                                                <div id="panelMonths" class="huge">0</div>
                                                <div>Meses</div>
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
                                                <i class="fa fa-globe fa-5x"></i>
                                            </div>
                                            <div class="col-xs-9 text-right">
                                                <div id="panelCountries" class="huge">0</div>
                                                <div>Países</div>
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
                    </div>
                </div>
            </div>

            <!--  ######################## [CHART PAÍS] ############################## -->
            <div id="chartPanelCountries" style="display: none">
                <div class="col-md-8 col-lg-8">
                    <div class="panel" style="border-top: 3px solid dodgerblue;">
                        <div class="panel-heading">
                            <h4 style="color: dodgerblue;">
                                <i class="fa fa-globe"></i>
                                <span id="panelTitleCountries"></span>
                                <div class="pull-right">
                                    <!--<span class="btn btn-default export-action" title="Descargar Imagen PNG"
                                          data-charttype="country" data-typeexport="png" role="button">
                                        <i class="fa fa-download"></i>
                                    </span>
                                    <span class="btn btn-default export-action" title="Compartir en mi página web"
                                          data-charttype="country" data-typeexport="embed" role="button">
                                        <i class="fa fa-share-alt"></i>
                                    </span>-->
                                    <span class="dropdown" style="margin-left: 5px;">
                                        <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                            <span class="fa fa-download"></span>
                                        </button>
                                        <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
                                            <li>
                                                <a href="javascript:void(0)" class="export-action" data-charttype="country" data-typeexport="png">
                                                    <i class="fa fa-image"></i> Descargar imagen PNG
                                                </a>
                                            </li>
                                        </ul>
                                    </span>
                                    <span class="dropdown" style="margin-left: 5px;">
                                        <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                            <span class="fa fa-share-alt"></span>
                                        </button>
                                        <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
                                            <li>
                                                <a href="javascript:void(0)" class="export-action" data-charttype="country" data-typeexport="embed">
                                                    <i class="fa fa-image"></i> Compartir imagen PNG en mi página web
                                                </a>
                                            </li>
                                        </ul>
                                    </span>
                                </div>
                            <!--<div class="dropdown pull-right">
                                    <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        <span class="fa fa-bars"></span>
                                    </button>
                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                                        <li><a href="{{ url('estadisticas/descargasporpais/'.$filename) }}"><i
                                                        class="fa fa-list"></i> Más detalles <i
                                                        class="fa fa-external-link"></i></a></li>
                                        <li class="divider"></li>
                                        <li>
                                            <a href="javascript:void(0)" class="export-action" data-charttype="country" data-typeexport="png">
                                              <i class="fa fa-image"></i> Descargar Imagen PNG
                                            </a>
                                        </li>
                                        <li class="divider"></li>
                                        <li>
                                            <a href="javascript:void(0)" class="export-action" data-charttype="country" data-typeexport="embed">
                                              <i class="fa fa-share-alt"></i>
                                              Compartir en mi página web
                                            </a>
                                        </li>
                                        <li class="divider"></li>
                                        <li>
                                          <a href="javascript:void(0)" class="angle-panel-collapse">Ocultar</a>
                                        </li>
                                    </ul>
                                </div>-->
                            </h4>
                        </div>
                        <div class="panel-body collapse-up">
                            <div class="col-md-12 text-center" style="z-index: 2;">
                                <div class="btn-group" role="group" aria-label="...">
                                    <button class="switchCountryChart btn btn-primary" data-chart="geo">
                                        <i class="fa fa-map"></i>
                                    </button>
                                    <button class="switchCountryChart btn btn-default" data-chart="pie">
                                        <i class="fa fa-pie-chart"></i>
                                    </button>
                                    <button class="switchCountryChart btn btn-default" data-chart="column">
                                        <i class="fa fa-bar-chart"></i>
                                    </button>
                                    <button class="switchCountryChart btn btn-default" data-chart="line">
                                        <i class="fa fa-line-chart"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="col-md-12 col-xs-12">
                                <div id="chartContentCountries"></div>
                            </div>
                            <!-- <div class="col-md-4 col-xs-12">
                                <input id="searchCountry" type="text" class="form-control"
                                       style="font-family: Arial, FontAwesome" placeholder="&#xF002; Buscar país">
                                <div id="countriesList" style="overflow: scroll; max-height: 300px;"></div>
                            </div> -->

                            <!-- <div class="col-md-12 col-xs-12">
                                <div class="text-center" id="cloudWordsCountry" style="width:100%; height: 50%;"></div>
                                <hr>
                            </div> -->

                            <!-- <div class="col-md-2 col-xs-12 text-center">
                                <i class="fa fa-globe" style="color: dodgerblue;"></i>
                                <span id="totalContinentes" style="color: #72777a; font-weight: bold;"></span>
                                <span style="color: #72777a"> Continentes </span>
                            </div>
                            <div class="col-md-2 col-xs-12 text-center">
                                <i class="fa fa-flag" style="color: darkgreen;"></i>
                                <span id="totalCountries" style="color: #72777a; font-weight: bold;"></span>
                                <span style="color: #72777a;"> Países</span>
                            </div>
                            <div class="col-md-2 col-xs-12 totalType text-center">
                                <i id="itotalType" class="fa"></i>
                                <span id="totalType" style="color: #72777a; font-weight: bold;"></span>
                                <span style="color: #72777a;"></span>
                            </div>-->
                            <!-- <div class="col-md-3 col-xs-12 mainCountry text-center">
                                <i class="fa fa-trophy" style="color: gold"></i>
                                <span id="mainCountry" style="color: #72777a; font-weight: bold;"></span>
                                <span style="color: #72777a"></span>
                            </div> -->
                            <!-- <div class="col-md-3 col-xs-12 text-center">
                                <i id="itotalTypeUnk" style="color: darkred" class="fa"></i>
                                <span id="totalTypeUnk" style="color: #72777a; font-weight: bold;"></span>
                                <span style="color: #72777a;"></span>
                            </div> -->
                        </div>

                    </div>
                </div>

                <div class="col-lg-4 col-md-4">
                    <div class="info-box bg-dodgerblue">
                        <span class="info-box-icon totalType"><i id="itotalType" class="fa"></i></span>

                        <div class="info-box-content">
                            <span class="info-box-number" id="totalType"></span>
                            <span class="info-box-text"></span>
                            <!-- <div class="progress">
                                <div class="progress-bar" style="width: 50%"></div>
                            </div> -->
                            <span class="progress-description">

                            </span>
                        </div>
                        <!-- /.info-box-content -->
                    </div>
                </div>

                <div class="col-lg-4 col-md-4">
                    <div class="info-box bg-aqua">
                        <span class="info-box-icon"><i class="fa fa-globe"></i></span>

                        <div class="info-box-content">
                            <span class="info-box-number" id="totalContinentes"></span>
                            <span class="info-box-text">Continentes</span>

                          <!-- <div class="progress">
                            <div class="progress-bar" style="width: 50%"></div>
                          </div> -->
                          <!-- <span class="progress-description">
                              <i class="fa fa-flag"></i>
                              <span id="totalCountries" style="font-weight: bold;"></span>
                              Países
                          </span> -->
                        </div>
                        <!-- /.info-box-content -->
                    </div>
                </div>

                <div class="col-lg-4 col-md-4">
                    <div class="info-box bg-green">
                        <span class="info-box-icon"><i class="fa fa-flag"></i></span>

                        <div class="info-box-content">
                          <span class="info-box-number" id="totalCountries"></span>
                          <span class="info-box-text">Países</span>

                          <!-- <div class="progress">
                            <div class="progress-bar" style="width: 50%"></div>
                          </div> -->
                          <!-- <span class="progress-description">
                              <i class="fa fa-flag"></i>
                              <span id="totalCountries" style="font-weight: bold;"></span>
                              Países
                          </span> -->
                        </div>
                        <!-- /.info-box-content -->
                    </div>
                </div>






                <div class="col-lg-4 col-md-4">
                    <div class="info-box bg-gold">
                        <span class="info-box-icon"><i class="fa fa-trophy"></i></span>

                        <div class="info-box-content">
                          <span class="info-box-number" id="mainCountry"></span>
                          <span class="info-box-text"></span>
                          <div class="progress">
                            <div id="mainCountryProgress" class="progress-bar" style="width: 50%"></div>
                          </div>
                          <span class="progress-description">
                              <i id="mainCountryPorcentIcon" class="fa"></i>
                              <span id="mainCountryPorcent" style="font-weight: bold;"></span>

                          </span>
                        </div>
                        <!-- /.info-box-content -->
                    </div>
                </div>

                <div class="col-lg-4 col-md-4">
                    <div class="info-box bg-red">
                        <span class="info-box-icon"><i id="itotalTypeUnk" style="color: darkred" class="itotalTypeUnk fa"></i></span>

                        <div class="info-box-content">
                          <span class="info-box-number" id="totalTypeUnk"></span>
                          <span class="info-box-text"></span>
                          <div class="progress">
                            <div id="totalTypeUnkProgress" class="progress-bar" ></div>
                          </div>
                          <span class="progress-description">
                              <i id="itotalTypeUnk2" class="itotalTypeUnk fa"></i>
                              <span id="totalTypeUnkPorcent" style="font-weight: bold;"></span>

                          </span>
                        </div>
                        <!-- /.info-box-content -->
                    </div>
                </div>

                <div class="col-md-12">

                    <div class="panel" style="border-top: 3px solid dodgerblue;">
                        <div class="panel-heading">
                            <h4 style="color: dodgerblue;">
                                <i class="fa fa-cloud"></i>
                                <span id="panelTitleCloudWordsCountry"></span>
                            </h4>
                        </div>
                        <div class="panel-body">
                                <div class="text-center" id="cloudWordsCountry" style="width:100%; height: 50%;"></div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- END  #chartPanelCountries-->

            <!-- ########################[CHART CIUDAD]######################## -->
            <div id="chartPanelCity" style="display: none">
                <div class="col-lg-8">
                    <div class="panel" style=" border-top: 3px solid cadetblue">
                        <div class="panel-heading">
                            <h4 style="color: cadetblue">
                                <i class="fa fa-building"></i>
                                <span id="panelTitleCity"></span>


                                <div class="pull-right">
                                    <!--<span class="btn btn-default export-action" title="Descargar Imagen PNG"
                                          data-charttype="city" data-typeexport="png" role="button">
                                        <i class="fa fa-download"></i>
                                    </span>
                                    <span class="btn btn-default export-action" title="Compartir en mi página web"
                                          data-charttype="city" data-typeexport="embed" role="button">
                                        <i class="fa fa-share-alt"></i>
                                    </span>-->
                                    <span class="dropdown" style="margin-left: 5px;">
                                        <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                            <span class="fa fa-download"></span>
                                        </button>
                                        <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
                                            <li>
                                                <a href="javascript:void(0)" class="export-action" data-charttype="city" data-typeexport="png">
                                                    <i class="fa fa-image"></i> Descargar imagen PNG
                                                </a>
                                            </li>
                                        </ul>
                                    </span>
                                    <span class="dropdown" style="margin-left: 5px;">
                                        <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                            <span class="fa fa-share-alt"></span>
                                        </button>
                                        <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
                                            <li>
                                                <a href="javascript:void(0)" class="export-action" data-charttype="city" data-typeexport="embed">
                                                    <i class="fa fa-image"></i> Compartir imagen PNG en mi página web
                                                </a>
                                            </li>
                                        </ul>
                                    </span>
                                </div>


                                <!--<div class="dropdown pull-right">
                                    <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        <span class="fa fa-bars"></span>
                                    </button>
                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                                        <li>
                                          <a href="javascript:void(0)" class="export-action" data-charttype="city" data-typeexport="png">
                                            <i class="fa fa-image"></i>
                                            Descargar Imagen PNG
                                          </a>
                                        </li>
                                        <li class="divider"></li>
                                        <li>
                                            <a href="javascript:void(0)" class="export-action" data-charttype="city" data-typeexport="embed">
                                              <i class="fa fa-share-alt"></i>
                                              Compartir en mi página web
                                            </a>
                                        </li>
                                        <li class="divider"></li>
                                        <li>
                                          <a href="javascript:void(0)" class="angle-panel-collapse">Ocultar</a>
                                        </li>
                                    </ul>
                                </div>-->
                            </h4>
                        </div>
                        <div class="panel-body collapse-up">
                            <div class="col-md-12 text-center" style="z-index: 2;">
                                <div class="btn-group" role="group" aria-label="...">
                                    <button class="switchCityChart btn btn-default" data-chart="pie"><i
                                                class="fa fa-pie-chart"></i></button>
                                    <button class="switchCityChart btn btn-primary" data-chart="column"><i
                                                class="fa fa-bar-chart"></i></button>
                                    <button class="switchCityChart btn btn-default" data-chart="line"><i
                                                class="fa fa-line-chart"></i></button>
                                </div>
                            </div>
                            <div class="col-md-12 col-xs-12">
                                <div id="chartContentCities"></div>
                            </div>


                        </div>
                    </div>

                </div>

                <div class="col-lg-4 col-md-4">
                    <div class="info-box bg-cadetblue">
                        <span class="info-box-icon"><i class="fa fa-building"></i></span>

                        <div class="info-box-content">
                          <span class="info-box-number" id="totalCities"></span>
                          <span class="info-box-text">Ciudades</span>
                          <!-- <div class="progress">
                            <div id="totalTypeUnkProgress" class="progress-bar" ></div>
                          </div> -->
                          <span class="progress-description">
                              <i class="fa fa-flag"></i>
                              <span id="totalCountriesCities" style="font-weight: bold;"></span>
                              Países
                          </span>
                        </div>
                        <!-- /.info-box-content -->
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="panel">
                        <div class="panel-body">
                            <input id="searchCity" type="text" class="form-control"
                                   style="font-family: Arial, FontAwesome" placeholder="&#xF002; Buscar Ciudad">
                            <div id="citiesList" style="overflow: auto; max-height: 450px;">

                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-12">
                    <div class="panel">
                        <div class="panel-body">

                                <div class="text-center" id="cloudWordsCity" style="width:100%; height: 50%;"></div>

                        </div>
                    </div>
                </div>
            </div>
            <!-- END chartPanelCity -->

            <!-- ########################[CHART MES]######################## -->
            <div id="chartPanelMonths" style="display: none">
                <div class="col-md-8">

                    <div class="panel" style="border-top: 3px solid darkred">
                        <div class="panel-heading">
                            <h4 style="color: darkred">
                                <i class="fa fa-calendar"></i>
                                <span id="panelTitleMonths"></span>

                                <div class="pull-right">
                                   <!-- <span class="btn btn-default export-action" title="Descargar Imagen PNG"
                                          data-charttype="month" data-typeexport="png" role="button">
                                        <i class="fa fa-download"></i>
                                    </span>
                                    <span class="btn btn-default export-action" title="Compartir en mi página web"
                                          data-charttype="month" data-typeexport="embed" role="button">
                                        <i class="fa fa-share-alt"></i>
                                    </span>-->
                                    <span class="dropdown" style="margin-left: 5px;">
                                        <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                            <span class="fa fa-download"></span>
                                        </button>
                                        <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
                                            <li>
                                                <a href="javascript:void(0)" class="export-action" data-charttype="month" data-typeexport="png">
                                                    <i class="fa fa-image"></i> Descargar imagen PNG
                                                </a>
                                            </li>
                                        </ul>
                                    </span>
                                    <span class="dropdown" style="margin-left: 5px;">
                                        <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                            <span class="fa fa-share-alt"></span>
                                        </button>
                                        <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
                                            <li>
                                                <a href="javascript:void(0)" class="export-action" data-charttype="month" data-typeexport="embed">
                                                    <i class="fa fa-image"></i> Compartir imagen PNG en mi página web
                                                </a>
                                            </li>
                                        </ul>
                                    </span>
                                </div>
                                <!--<div class="dropdown pull-right">
                                    <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        <span class="fa fa-bars"></span>
                                    </button>
                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                                        <li>
                                          <a href="javascript:void(0)" class="export-action" data-charttype="month" data-typeexport="png">
                                             <i class="fa fa-image"></i>
                                             Descargar Imagen PNG
                                           </a>
                                        </li>
                                        <li class="divider"></li>
                                        <li>
                                            <a href="javascript:void(0)" class="export-action" data-charttype="month" data-typeexport="embed">
                                              <i class="fa fa-share-alt"></i>
                                              Compartir en mi página web
                                            </a>
                                        </li>
                                        <li class="divider"></li>
                                        <li>
                                          <a href="javascript:void(0)" class="angle-panel-collapse">Ocultar</a>
                                        </li>
                                    </ul>
                                </div>-->
                            </h4>
                        </div>
                        <div class="panel-body collapse-up">
                            <div class="col-md-12 text-center" style="z-index: 2;">
                                <div class="btn-group" role="group" aria-label="...">
                                    <button class="switchMonthChart btn btn-primary" data-chart="pie"><i
                                                class="fa fa-pie-chart"></i></button>
                                    <button class="switchMonthChart btn btn-default" data-chart="column"><i
                                                class="fa fa-bar-chart"></i></button>
                                    <button class="switchMonthChart btn btn-default" data-chart="line"><i
                                                class="fa fa-line-chart"></i></button>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div id="chartContentMonths" style="height: 380px;"></div>
                            </div>
                            <!-- <div class="col-md-4 col-xs-12" style="overflow: auto; max-height: 500px;">
                                <div id="monthsList" style="overflow: auto; max-height: 250px;"></div>
                            </div> -->

                            <!-- <div class="col-md-12 text-center" style="display: inline-block">
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
                            </div> -->

                        </div>

                    </div>

                </div>

                <div class="col-lg-4 col-md-4">
                    <div class="info-box bg-darkred">
                        <span class="info-box-icon totalType"><i id="itotalTypeMonth" class="fa"></i></span>

                        <div class="info-box-content">
                          <span class="info-box-number" id="totalMonth"></span>
                          <span class="info-box-text"></span>
                          <!-- <div class="progress">
                            <div id="totalTypeUnkProgress" class="progress-bar" ></div>
                          </div> -->
                          <span class="progress-description">
                              <i class="itotalTypeUnk fa"></i>
                              <span id="totalMonthLongFormat" style="font-weight: bold;"></span>

                          </span>
                        </div>
                        <!-- /.info-box-content -->
                    </div>
                </div>

                <div class="col-lg-4 col-md-4">
                    <div class="info-box bg-green">
                        <span class="info-box-icon"><i class="fa fa-level-up"></i></span>

                        <div class="info-box-content">
                          <span class="info-box-number" id="monthUp"></span>
                          <span class="info-box-text"></span>
                          <div class="progress">
                            <div id="totalMonthUpProgress" class="progress-bar" ></div>
                          </div>
                          <span class="progress-description">
                              <i class="itotalTypeUnk fa"></i>
                              <span id="totalMonthUpLongFormat" style="font-weight: bold;"></span>

                          </span>
                        </div>
                        <!-- /.info-box-content -->
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="panel">
                        <div class="panel-body">
                            <div id="cloudWordsMonth" style="width:100%; height: 50%; max-height: 250px;"></div>
                        </div>
                    </div>
                </div>
            </div>


            <!-- ########################[CHART NÚMERO]######################## -->
            <div class="col-md-12">
                <div id="chartPanelNumber" class="panel" style="display: none; border-top: 3px solid darkgreen">
                    <div class="panel-heading">
                        <h4 style="color: darkgreen">
                            <i class="fa fa-hashtag"></i>
                            <span id="panelTitleNumber"></span>
                            <div class="pull-right">
                                <!--<span class="btn btn-default export-action" title="Descargar Imagen PNG"
                                      data-charttype="number" data-typeexport="png" role="button">
                                    <i class="fa fa-download"></i>
                                </span>
                                <span class="btn btn-default export-action" title="Compartir en mi página web"
                                      data-charttype="number" data-typeexport="embed" role="button">
                                    <i class="fa fa-share-alt"></i>
                                </span>-->
                                <span class="dropdown" style="margin-left: 5px;">
                                    <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        <span class="fa fa-download"></span>
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
                                        <li>
                                            <a href="javascript:void(0)" class="export-action" data-charttype="number" data-typeexport="png">
                                                <i class="fa fa-image"></i> Descargar imagen PNG
                                            </a>
                                        </li>
                                    </ul>
                                </span>
                                <span class="dropdown" style="margin-left: 5px;">
                                    <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        <span class="fa fa-share-alt"></span>
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
                                        <li>
                                            <a href="javascript:void(0)" class="export-action" data-charttype="number" data-typeexport="embed">
                                                <i class="fa fa-image"></i> Compartir imagen PNG en mi página web
                                            </a>
                                        </li>
                                    </ul>
                                </span>
                            </div>
                            <!--<div class="dropdown pull-right">
                                <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                    <span class="fa fa-bars"></span>
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                                    <li>
                                      <a href="javascript:void(0)" class="export-action" data-charttype="number" data-typeexport="png">
                                        <i class="fa fa-image"></i>
                                        Descargar Imagen PNG
                                      </a>
                                    </li>
                                    <li class="divider"></li>
                                    <li>
                                        <a href="javascript:void(0)" class="export-action" data-charttype="number" data-typeexport="embed">
                                          <i class="fa fa-share-alt"></i>
                                          Compartir en mi página web
                                        </a>
                                    </li>
                                    <li class="divider"></li>
                                    <li>
                                      <a href="javascript:void(0)" class="angle-panel-collapse">Ocultar</a>
                                    </li>
                                </ul>
                            </div>-->
                        </h4>
                    </div>
                    <div class="panel-body collapse-up">
                        <div class="col-md-12 text-center">
                            <!--<h1><span id="totalNumbers"></span> <i>Números</i></h1>
                            <form class="form-inline">
                                <div class="form-group">
                                    <label>Ordenar <span id="sorterByTypeReport"></span></label>
                                    <div class="btn-group" role="group" aria-label="sorting">
                                        <button type="button" class="btn btn-default btn-sort-type" data-type="number"><i class="fa fa-hashtag"></i></button>
                                        <button type="button" class="btn btn-primary btn-sort-type" data-type="type"><i class="fa fa-download"></i></button>
                                    </div>
                                    <label>de</label>
                                    <div class="btn-group" role="group" aria-label="sorting">
                                        <button type="button" class="btn btn-primary btn-sort-numbers" data-sort="desc"><i class="fa fa-sort-amount-desc"></i></button>
                                        <button type="button" class="btn btn-default btn-sort-numbers" data-sort="asc"><i class="fa fa-sort-amount-asc"></i></button>
                                    </div>
                                    <input id="searchNumber" type="text" class="form-control" style="font-family: Arial, FontAwesome;" placeholder="&#xF002; Buscar Número">
                                </div>

                            </form>-->

                        </div>
                        <div class="col-md-12 text-center" style="z-index: 2;">
                            <div class="btn-group" role="group" aria-label="...">
                                <button class="switchNumberChart btn btn-default" data-chart="pie"><i
                                            class="fa fa-pie-chart"></i></button>
                                <button class="switchNumberChart btn btn-primary" data-chart="column"><i
                                            class="fa fa-bar-chart"></i></button>
                                <button class="switchNumberChart btn btn-default" data-chart="line"><i
                                            class="fa fa-line-chart"></i></button>
                            </div>

                        </div>

                        <div class="col-md-9">
                            <div class="md-chips" style="overflow: auto; max-height: 500px;"></div>
                            <div id="chartContentNumber" style="height: 500px;"></div>
                        </div>
                        <div class="col-md-3">
                            <input id="searchNumber" type="text" class="form-control"
                                   style="font-family: Arial, FontAwesome;" placeholder="&#xF002; Buscar Número">
                            <div id="numbersList" style="overflow: auto; max-height: 400px;">
                            </div>
                        </div>
                    </div>
                </div>


                <!--  ########################[CHART TEXTO] ######################## -->
                <div id="chartPanelText" class="panel" style="display: none; border-top: 3px solid">
                    <div class="panel-heading">
                        <h4>
                            <i class="fa fa-font"></i>
                            <span id="panelTitleText"></span>
                            <div class="pull-right">
                                <!--<span class="btn btn-default export-action" title="Descargar Imagen PNG"
                                      data-charttype="text" data-typeexport="png" role="button">
                                    <i class="fa fa-download"></i>
                                </span>
                                <span class="btn btn-default export-action" title="Compartir en mi página web"
                                      data-charttype="text" data-typeexport="embed" role="button">
                                    <i class="fa fa-share-alt"></i>
                                </span>-->
                                <span class="dropdown" style="margin-left: 5px;">
                                    <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        <span class="fa fa-download"></span>
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
                                        <li>
                                            <a href="javascript:void(0)" class="export-action" data-charttype="text" data-typeexport="png">
                                                <i class="fa fa-image"></i> Descargar imagen PNG
                                            </a>
                                        </li>
                                    </ul>
                                </span>
                                <span class="dropdown" style="margin-left: 5px;">
                                    <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        <span class="fa fa-share-alt"></span>
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
                                        <li>
                                            <a href="javascript:void(0)" class="export-action" data-charttype="text" data-typeexport="embed">
                                                <i class="fa fa-image"></i> Compartir imagen PNG en mi página web
                                            </a>
                                        </li>
                                    </ul>
                                </span>
                            </div>
                            <!--<div class="dropdown pull-right">
                                <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                    <span class="fa fa-bars"></span>
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                                    <li><a href="javascript:void(0)" class="export-action" data-charttype="text"
                                           data-typeexport="png"><i class="fa fa-image"></i> Descargar Imagen PNG</a>
                                    </li>
                                </ul>
                            </div>-->

                            <!--<span class="pull-right" title="Opciones" style="margin-left: 5px;"><i class="fa fa-bars"></i></span>
                            <span class="pull-right angle-panel-collapse" title="Ocultar"><i class="fa fa-angle-up fa-lg"></i></span>-->
                        </h4>
                    </div>
                    <div class="panel-body collapse-up">
                        <div class="col-md-12 text-center" style="z-index: 2;">
                            <div class="btn-group" role="group" aria-label="...">
                                <button class="switchTextChart btn btn-primary" data-chart="pie">
                                    <i class="fa fa-pie-chart"></i>
                                </button>
                                <button class="switchTextChart btn btn-default" data-chart="column">
                                    <i class="fa fa-bar-chart"></i>
                                </button>
                            </div>
                        </div>
                        <div id="parentChartContentText" class="col-md-8">
                            <div id="chartContentText_"></div>
                            <div id="chartContentText" style="height: 500px;"></div>
                        </div>
                        <div class="col-md-4">
                            <input id="searchText" type="text" class="form-control" style="font-family: Arial, FontAwesome;" placeholder="&#xF002; Buscar Texto">
                            <div id="textList" style="overflow: auto; max-height: 400px;"></div>
                        </div>
                        <table id="tableContentText" class="table table-striped table-bordered" style="width:100%"></table>
                    </div>
                </div>

                <!--  ########################[CHART ROLES] ######################## -->
                <div class="panel" id="chartPanelRoles" style="display: none; border-top: 3px solid #555e81;">
                    <div class="panel-heading">
                        <h4 style="color: #555e81">
                            <i class="fa fa-users"></i>
                            <span id="panelTitleRoles"></span>
                            <div class="pull-right">
                                <span class="dropdown" style="margin-left: 5px;">
                                    <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        <span class="fa fa-download"></span>
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
                                        <li>
                                            <a href="javascript:void(0)" class="export-action" data-charttype="role" data-typeexport="png">
                                                <i class="fa fa-image"></i> Descargar imagen PNG
                                            </a>
                                        </li>
                                    </ul>
                                </span>
                                <span class="dropdown" style="margin-left: 5px;">
                                    <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        <span class="fa fa-share-alt"></span>
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
                                        <li>
                                            <a href="javascript:void(0)" class="export-action" data-charttype="role" data-typeexport="embed">
                                                <i class="fa fa-image"></i> Compartir imagen PNG en mi página web
                                            </a>
                                        </li>
                                    </ul>
                                </span>
                            </div>
                        </h4>
                    </div>
                    <div class="panel-body">
                        <div class="col-md-12 text-center" style="z-index: 2;">
                            <div class="btn-group" role="group">
                                <!-- <button class="switchUserChart btn btn-default" data-chart="pie"><i class="fa fa-pie-chart"></i></button> -->
                                <button class="switchUserChart btn btn-primary" data-chart="column" data-typecolumn="stacked"><i class="fa fa-bar-chart"></i> Apilados</button>
                                <button class="switchUserChart btn btn-default" data-chart="column" data-typecolumn="column"><i class="fa fa-bar-chart"></i> Columnas separadas</button>
                            </div>
                        </div>
                        <div id="relesMainChart">
                            <div class="col-md-8 col-xs-12">
                                <div id="chartContentUsers"></div>
                            </div>
                            <div class="col-md-4 col-xs-12">
                                <div id="usersList" style="overflow: auto; max-height: 450px;"></div>
                            </div>
                        </div>
                        <div id="rolesMapChart" style="display:none">
                            <div class="col-md-12 text-center">
                                <h3 id="rolesMapLegend"></h3>
                            </div>
                            <div class="col-md-8 col-xs-12">
                                <div id="chartContentRolesMaps"></div>
                            </div>
                            <div class="col-md-4 col-xs-12">
                                <div id="rolesListMaps" style="overflow: auto; max-height: 450px;"></div>
                            </div>
                        </div>

                        <div class="col-col-md-12">
                            <div id="cloudWordsRoles" style="width:100%; height: 25%;"></div>
                        </div>


                    </div>
                </div>

                <!--  ########################[CHART GENDERS] ######################## -->
                <div class="panel" id="chartPanelGenders" style="display: none; border-top: 3px solid #00adc1;">
                    <div class="panel-heading">
                        <h4 style="color: #00adc1">
                            <i class="fa fa-transgender"></i>
                            <span id="panelTitleGenders">Géneros</span>
                            <div class="pull-right">
                                <span class="dropdown" style="margin-left: 5px;">
                                    <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        <span class="fa fa-download"></span>
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
                                        <li>
                                            <a href="javascript:void(0)" class="export-action" data-charttype="gender" data-typeexport="png">
                                                <i class="fa fa-image"></i> Descargar imagen PNG
                                            </a>
                                        </li>
                                    </ul>
                                </span>
                                <span class="dropdown" style="margin-left: 5px;">
                                    <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        <span class="fa fa-share-alt"></span>
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
                                        <li>
                                            <a href="javascript:void(0)" class="export-action" data-charttype="gender" data-typeexport="embed">
                                                <i class="fa fa-image"></i> Compartir imagen PNG en mi página web
                                            </a>
                                        </li>
                                    </ul>
                                </span>
                            </div>
                        </h4>
                    </div>
                    <div class="panel-body">
                        <div class="col-md-12 text-center" style="z-index: 2;">
                            <div class="btn-group" role="group">
                                <button class="switchGenderChart btn btn-default" data-chart="pie"><i class="fa fa-pie-chart"></i></button>
                                <button class="switchGenderChart btn btn-primary" data-chart="column"><i class="fa fa-bar-chart"></i></button>
                                <!-- <button class="switchCityChart btn btn-default" data-chart="line"><i class="fa fa-line-chart"></i></button> -->
                            </div>
                        </div>
                        <div class="col-md-9 col-xs-12">
                            <div id="chartContentGenders"></div>
                        </div>
                        <div class="col-md-3 col-xs-12">
                            <div id="gendersList"></div>
                        </div>
                    </div>
                </div>

                <!-- [CHART TOTAL] -->
                <div id="chartPanelTotal_" class="panel" style="display: none">
                    <div class="panel-heading">
                        <h4>
                            <i class="fa fa-circle"></i>
                            <span id="panelTitleTotal"></span>
                            <div class="dropdown pull-right">
                                <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                    <span class="fa fa-bars"></span>
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                                    <li><a href="javascript:void(0)" id="breakdownButton"><i
                                                    class="fa fa-pie-chart"></i> Desglose por porcentaje</a></li>
                                    <li class="divider"></li>
                                    <li><a href="javascript:void(0)" class="export-action" data-charttype="total"
                                           data-typeexport="png"><i class="fa fa-image"></i> Descargar Imagen PNG</a>
                                    </li>
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
                                <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                    <span class="fa fa-bars"></span>
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                                    <li><a href="javascript:void(0)" class="export-action" data-charttype=""
                                           data-typeexport="png"><i class="fa fa-image"></i> Descargar Imagen PNG</a>
                                    </li>
                                    <!--<li class="divider"></li>
                                    <li><a href="javascript:void(0)" class="angle-panel-collapse">Ocultar</a></li>-->
                                </ul>
                            </div>

                            <select class="form-control pull-right porcents"
                                    style="width: 8%; margin-right: 10px; height: 28px;">
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



    <!--MODALS-->
    <div id="configCharts" class="modal fade">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Generar gráficas por:</h4>
                </div>
                <div class="modal-body">
                    <ul id="chartList" class="list-group"></ul>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal"><i
                                class="fa fa-times-circle"></i> Cancelar
                    </button>
                    <button id="saveChangesChartList" type="button" class="btn btn-primary"><i class="fa fa-save"></i>
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div id="shareChartsModal" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    Compartir gráfica por <label id="shareChartsTypeReport"></label>
                </div>
                <div class="modal-body">
                    <!-- &lt;iframe width="560" height="315" src="https://www.youtube.com/embed/owsfdh4gxyc" frameborder="0" allowfullscreen&gt;&lt;/iframe&gt; -->
                    <div id="shareChartsAlert" class="alert alert-success" style="display: none" role="alert">
                        <strong>¡Código copiado satisfactoriamente!</strong>
                    </div>
                    <pre>
                        <code id="shareChartsCodeTag" style="float: left"></code>
                    </pre>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">
                        <i class="fa fa-times-circle"></i> Cerrar
                    </button>
                    <button type="button" class="btn btn-primary" onclick="copyToClipboard('shareChartsCodeTag')">
                        <i class="fa fa-code"></i>
                        Copiar Código
                    </button>
                </div>
            </div>
        </div>
    </div>

@stop

@section('javascript')
    <script type="text/javascript">
        var fileName = '{{ $filename }}';
        var target = "{{ $target }}";
        var getCsvFile = "{{ asset('/files/'.$filename) }}";
    </script>
    <script src="{{ asset('js/pluggins/download.js') }}"></script>
    <script src="{{ asset('js/statsarrays.js') }}"></script>
    <script src="{{ asset('js/stats/translate.objects.js') }}" charset="utf-8"></script>
    <script src="{{ asset('js/stats/stats_.js') }}"></script>

@stop
