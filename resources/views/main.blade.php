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

        <div class="addres-bar-content-header">
            <div class="col-md-8">
                <h1 >Inicio</h1>
            </div>
            <div class="col-md-4 text-right">
                <h1>
                    <a>
                        <button id="btnGlobalOpenFile" class="btn btn-danger" onclick="starInputFile()">
                            <i class="fa fa-folder-open"></i> Explorar Archivos
                        </button>
                    </a>
                </h1>

            </div>

            <div class="col-md-12">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><label><i class="fa fa-home"></i> Inicio</label></li>
                    <li class="current-date pull-right"><span><i class="fa fa-calendar"></i> <span
                                    id="current-date"></span></span></li>
                </ol>
            </div>



        </div>

    </div>

    <div id="noFiles" style="display: none" class="alert alert-warning text-center" role="alert">
        Aún no has subido ningún archivo.
    </div>

    <div class="row">
        <div class="col-md-12 col-lg-12 col-xs-12">
            <div class="panel">
                <div class="panel-body">
                    <div id="exTab2">
                        <ul class="nav nav-tabs">
                            <li class="active">
                                <a id="tabHome" href="#home" data-toggle="tab"><i class="fa fa-home"></i> Inicio</a>
                            </li>
                            <li>
                                <a id="tabHistory" href="#history" data-toggle="tab" style="display: none"><i class="fa fa-list"></i> Historial</a>
                            </li>
                        </ul>

                        <div class="tab-content">
                            <div class="tab-pane active" id="home">
                                <br>
                                <div id="panelsHeading" class="row" style="display: none">
                                    <div class="col-lg-4 col-md-4">
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
                                                    <span class="pull-left">Ver Detalles</span>
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
                                <!--end panel heading-->

                                <!--<div id="cloudWords" style="width:100%; height: 50%;"></div>-->

                                <div id="uploadFilesContentParent">
                                    <div id="uploadFilesContent" class="jumbotron"
                                         style="text-align: center; border-style: dashed; background-color: white; border-color: #eee; display: none">
                                        <input type="file" id="csvFile" name="csvFile" style="display: none">
                                        <h2>Seleccione su archivo CSV para subirlo</h2>
                                        <p><i class="fa fa-upload upload" aria-hidden="true"></i></p>
                                        <p><a id="csvFileButton" class="btn btn-danger btn-lg" href="#" role="button" onclick="starInputFile()">
                                                <i class="fa fa-folder-open"></i> Explorar Archivos</a></p>
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
                                                Archivo <strong id="strongFileName"></strong> subido correctamente
                                                <button id="cambiarArchivo" class="btn btn-primary btn-xs"><i class="fa fa-folder-open"></i>
                                                    Cambiar archivo
                                                </button>
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
                                        <div id="loadPreviewText" class="alert alert-warning" style="text-align: center; display:none"
                                             role="alert">
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
                                <!-- end filesConte -->

                            </div>
                            <!--end tab-->

                            <div class="tab-pane" id="history">
                                <h3>Historial de Archivos</h3>
                                <div id="noFiles" style="display: none">
                                    <div class="alert alert-warning text-center" role="alert">
                                        Aún no has subido ningún archivo.
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
                    <h4 class="modal-title">Seleccionar Informe/Reporte</h4>
                </div>
                <div class="modal-body">
                    <select id="selectReportType" class="form-control">
                        <option>-- Tipo de informe --</option>
                        <option value="0">Descargas del archivo del artículo</option>
                        <option value="1">Visitas a la página del resumen del artículo</option>
                        <option value="2">Descargas de Archivo del número</option>
                        <option value="3">Visitas a la página de la tabla de contenidos del número</option>
                        <option value="4">Visitas a la página principal de la revista</option>
                    </select>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times-circle"></i> Cancelar</button>
                    <button id="continueSelectFile" type="button" class="btn btn-primary">Continuar <i class="fa fa-arrow-right"></i></button>
                </div>
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
