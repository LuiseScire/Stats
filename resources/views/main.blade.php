@extends('layouts.master')

@section('title', 'Inicio')

@section('css')
    <style media="screen">
        #uploadFilesContent i.upload {
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
            <div class="address-bar-content-header">
                <h1>
                    <span data-lang="page-title">Inicio</span>
                    <span id="btnGlobalOpenFile" class="btn btn-danger pull-right" onclick="starInputFile()" role="button"><i class="fa fa-folder-open"></i> <span data-lang="btn-upload-file">Subir Archivo</span></span>
                </h1>
                <ol class="breadcrumb">
                    <li class="address-item"><label><i class="fa fa-home"></i> <span data-lang="address-bar-current-page">Inicio</span></label></li>
                    <li class="current-date pull-right"><span><i class="fa fa-calendar"></i> <span id="currentDateEN" class="date-format-en" style="display:none"></span><span id="currentDateES" class="date-format-es" style="display:none"></span></span></li>
                </ol>
            </div>
        </div>
    </div>

    <div id="noFiles" style="display: none" class="alert alert-warning text-center" role="alert">
        Aún no ha subido ningún archivo.
    </div>

    <div class="row">
        <div class="col-md-12 col-lg-12 col-xs-12">
            <div class="panel">
                <div class="panel-body">
                    <div id="exTab2">
                        <ul class="nav nav-tabs">
                            <li class="active">
                                <a id="tabHome" href="#home" data-toggle="tab"><i class="fa fa-home"></i> <span data-lang="tab-opt-home">Inicio</span></a>
                            </li>
                            <li>
                                <a id="tabHistory" href="#history" data-toggle="tab" style="display: none"><i class="fa fa-clock-o"></i> <span data-lang="tab-opt-historical">Historial</span></a>
                            </li>
                        </ul>

                        <div class="tab-content">
                            <div class="tab-pane active" id="home">
                                <br>
                                <h4 id="segunInfo" style="display: none">
                                    <span data-lang="panel-heading-first-title">Según la información de</span>
                                    <strong class="fileNamePanels" style="color:#A41C1E"></strong>
                                    <span data-lang="panel-heading-last-title">indica las siguientes</span>
                                    <strong class="typeReportPanels" style="color:#72777a"></strong>
                                </h4>
                                <div id="panelsHeading" class="row">
                                    <!-- <div class="col-lg-4 col-md-4">
                                        <div class="panel panel-primary">
                                            <div class="panel-heading">
                                                <div class="row">
                                                    <div id="panelTotalIcon" class="col-xs-4">

                                                    </div>
                                                    <div class="col-xs-8 text-right">
                                                        <div id="panelTotals" class="huge"></div>
                                                        <div id="panelTotalsText"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <a id="panelTotalsDetails">
                                                <div class="panel-footer">
                                                    <span class="pull-left" data-lang="panel-view-details">Ver Detalles</span>
                                                    <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>
                                                    <div class="clearfix"></div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="col-lg-4 col-md-4">
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
                                                    <span class="pull-left" data-lang="panel-view-details">Ver Detalles</span>
                                                    <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>
                                                    <div class="clearfix"></div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="col-lg-4 col-md-4">
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
                                                    <span class="pull-left" data-lang="panel-view-details">Ver Detalles</span>
                                                    <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>
                                                    <div class="clearfix"></div>
                                                </div>
                                            </a>
                                        </div>
                                    </div> -->


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
                                <!--end panel heading-->

                                <div class="col-md-12" id="graphicAgainPanel" style="display:none">
                                    <h4 data-lang="graphic-again">Graficar de nuevo</h4>
                                    <div id="itemFile" class="media">
                                       <div class="media-left">
                                           <a href="javascript:void(0)" class="csv-file-item seeAgain" data-csvname="">
                                              <img class="media-object" src="{{ asset('images/csv-file-primary-color.svg') }}" alt="icon" width="64px" height="64px">
                                          </a>
                                       </div>
                                       <div class="media-body" style="color: #E05740">
                                         <h4 class="media-heading csv-file-item fileNamePanels seeAgain" style="color: #A41C1E; cursor: pointer" data-csvname=""></h4>
                                         <span class="fa fa- fa-lg pull-right" style="cursor: pointer"></span><span class="pull-right"></span>
                                         <span class="typeReportPanels"></span>
                                         <br><small style="color: #72777a"></small>
                                       </div>
                                    </div>
                                </div>

                                <!--<div id="cloudWords" style="width:100%; height: 50%;"></div>-->

                                <div id="uploadFilesContentParent">
                                    <div id="uploadFilesContent" class="jumbotron" style="text-align: center; border-style: dashed; background-color: white; border-color: #eee; display: none">
                                        <input type="file" id="csvFile" name="csvFile" style="display: none">
                                        <h2 data-lang="main-file-upload-legend">Seleccione su archivo CSV para subirlo</h2>
                                        <p><i class="fa fa-upload upload" aria-hidden="true"></i></p>
                                        <p>
                                            <a id="csvFileButton" class="btn btn-danger btn-lg" href="#" role="button" onclick="starInputFile()">
                                                <i class="fa fa-folder-open"></i> <span data-lang="btn-upload-file">Subir Archivo</span>
                                            </a>
                                        </p>
                                    </div>

                                    <div id="progressBarContent" class="col-lg-12" style="display: none">
                                        <div class="progress">
                                            <div id="uploadProgressBar" class="progress-bar progress-bar-striped active" role="progressbar"
                                                 aria-valuemin="0" aria-valuemax="100">
                                            </div>
                                        </div>
                                    </div>

                                    <div id="confirmFileContent" class="col-lg-12" style="display:none">
                                        <div id="loadInfoText" class="alert alert-success" role="alert">
                                            <p>
                                                <span data-lang="file-uploaded-alert-first">Archivo</span> <strong id="strongFileName"></strong> <span data-lang="file-uploaded-alert-last">subido correctamente</span>
                                                <button id="cambiarArchivo" class="btn btn-primary btn-xs"><i class="fa fa-folder-open"></i>
                                                    <span data-lang="change-file-btn">Cambiar archivo</span>
                                                </button>
                                            </p>
                                        </div>
                                        <hr>
                                    </div>

                                    <div class="col-lg-12">
                                        <div id="loadPreviewText" class="alert alert-warning" style="text-align: center; display:none"
                                             role="alert">
                                            <strong data-lang="loading-preview-legend">Cargando vista previa del archivo</strong>
                                        </div>
                                    </div>

                                    <div id="preView" style="display:none;">
                                        <table id="preViewTable" class="table table-striped">
                                            <thead>
                                            </thead>
                                        </table>
                                    </div>

                                </div>
                                <!-- end filesConte -->

                            </div>
                            <!--end tab-->

                            <div class="tab-pane" id="history">
                                <h3 data-lang="panel-heading-historical-title">Historial de Archivos</h3>
                                <div id="noFiles" style="display: none">
                                    <div class="alert alert-warning text-center" role="alert">
                                        <a href="javascript:void(0)">
                                            <button class="btn btn-danger btn-xs" onclick="starInputFile()"><i
                                                        class="fa fa-folder-open"></i> Explorar Archivos
                                            </button>
                                        </a>
                                    </div>
                                </div>
                                <div id="csvList">

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>


    <!--<div id="history" class="row">
        <div class="col-md-12">

        </div>

    </div>-->
    <div id="typeReportModal" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" data-lang="modal-title-type-report">Seleccionar Informe</h4>
                </div>
                <div class="modal-body">
                    <select id="selectReportType" class="form-control">
                        <option>-- Tipo de informe --</option>
                        <option value="0">Descargas del archivo del artículo</option>
                        <option value="1">Visitas a la página del resumen del artículo</option>
                        <option value="2">Descargas de Archivo del número</option>
                        <option value="3">Visitas a la página de la tabla de contenidos del número</option>
                        <option value="4">Visitas a la página principal de la revista</option>
                        @if(Auth::id() == 1)
                        <option value="5">Módulo para usuarios/as XML</option>
                        @endif
                    </select>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times-circle"></i> <span data-lang="modal-cancel-btn">Cancelar</span></button>
                    <button id="continueSelectFile" type="button" class="btn btn-primary"><span data-lang="modal-continue-btn">Continuar</span> <i class="fa fa-arrow-right"></i></button>
                </div>
            </div>
        </div>
    </div>

@stop

@section('javascript')
    <script type="text/javascript" src="{{ asset('js/statsarrays.js') }}"></script>
    <script id="translateScript" type="text/javascript" src="{{ asset('js/main/translate.objects.js') }}"></script>
    <script type="text/javascript" src="{{ asset('js/main/main.js') }}"></script>
    <!--<script type="text/javascript" src="{{ asset('js/main/uploadcsv.js') }}"></script>-->
@stop
