@extends('layouts.master')

@section('title', 'Estadísticas')

@section('css')
<link rel="stylesheet" href="{{ asset('css/views/config/config.css') }}">
<style media="screen">
    .empty-folder{
        box-sizing: border-box;
        height: calc(100% - 200px);
        position: relative;
        text-align: center;
        display: none;
    }

    .empty-folder h1{
        color: #BEBFBF;
    }

    .empty-folder i.f-empty-folder{
        transform: scale(0.8);
        opacity: 0.3;
        font-size: 200px;
        margin-bottom: 1rem;
    }

    .empty-folder-content{
        position: absolute;
    	top: 50%;
    	left: 50%;
    	height: 30%;
    	width: 50%;
    	margin: -15% 0 0 -25%;
    }
</style>
@stop

@section('sidebar')
    @parent
@stop

@section('content')
<!-- <div class="row">
    <div class="col-lg-12">
        <div class="address-bar-content-header">
            <h3>
                <span data-lang="page-title">Archivos Subidos a la revista</span>
                <span id="btnGlobalOpenFile" class="btn btn-danger pull-right" onclick="starInputFile()" role="button"><i class="fa fa-folder-open"></i> <span data-lang="btn-upload-file">Subir Archivo</span></span>
            </h3>
        </div>
    </div>
</div> -->
<div class="row">
    <div class="col-lg-12">
        <div class="address-bar-content-header">
            <h1>
                <span data-lang="page-title">Mis Archivos</span>
                <!-- <span id="btnGlobalOpenFile" class="btn btn-danger pull-right" onclick="starInputFile()" role="button"><i class="fa fa-folder-open"></i> <span data-lang="btn-upload-file">Subir Archivo</span></span> -->
            </h1>

            <ol class="breadcrumb" style="width: auto">
                <label class="pull-right">
                    <span id="newFolderBtn" style="cursor: pointer;" onclick="newFolder(this)" data-origin="header"><i class="fa fa-plus"></i> Nueva carpeta</span>
                    &nbsp;
                    <span id="mainNewFileBtn" style="cursor: pointer;" onclick="mainNewFile()" role="button"><i class="fa fa-upload"></i> Subir archivo</span>
                    &nbsp;
                    <span id="newFileBtn" style="cursor: pointer; display:none" onclick="starInputFile()" role="button"><i class="fa fa-upload"></i> Subir archivo</span>
                </label>
                <li class="address-item first-address-item"><i class="fa fa-folder"></i> Carpetas</li>
            </ol>
        </div>
    </div>
</div>

<div class="row" id="noFilesAlert" style="display:none">
    <div class="col-md-12">
        <div class="alert alert-warning text-center" role="alert">
            <strong><i class="fa fa-warning"></i> Aún no ha subido ningún archivo.</strong>
        </div>
    </div>
</div>

<div class="row" id="uploadFilesContentParent" style="">
    <div class="col-md-12">
        <div id="uploadFilesContent" class="jumbotron" style="text-align: center; border-style: dashed; background-color: white; border-color: #eee;display: none">
            <input type="file" id="csvFile" name="csvFile" style="display: none">
            <h2 data-lang="main-file-upload-legend">Seleccione su archivo para subirlo</h2>
            <p><i class="fa fa-upload upload" aria-hidden="true"></i></p>
            <p>
                <a id="csvFileButton" class="btn btn-danger btn-lg" href="#" role="button" onclick="starInputFile()">
                    <i class="fa fa-upload"></i> <span data-lang="btn-upload-file">Subir Archivo</span>
                </a>
            </p>
        </div>
    </div>

    <div id="progressBarContent" class="col-lg-12" style="display: none">
        <div class="progress">
            <div id="uploadProgressBar" class="progress-bar progress-bar-striped active" role="progressbar"
                 aria-valuemin="0" aria-valuemax="100">
            </div>
        </div>
    </div>

    <div id="confirmFileContent" class="col-lg-12" style="display: none">
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
        <div id="loadPreviewText" class="alert alert-warning" style="text-align: center; display: none"
             role="alert">
            <strong data-lang="loading-preview-legend">Cargando vista previa del archivo</strong>
        </div>
    </div>

    <div class="col-md-12" id="preView" style="display:none;">
        <table id="preViewTable" class="table table-striped">
            <thead>
            </thead>
        </table>
    </div>
</div>

<div id="filesContent">
    <!-- <h3 data-lang="panel-heading-historical-title">Archivos </h3> -->
    <!-- <div id="noFiles" style="display: none">
        <div class="alert alert-warning text-center" role="alert">
            <a href="javascript:void(0)">
                <button class="btn btn-danger btn-xs" onclick="starInputFile()"><i
                            class="fa fa-folder-open"></i> Explorar Archivos
                </button>
            </a>
        </div>
    </div> -->

    <div class="row" id="foldersList">

    </div>



    <div class="row">
        <div class="col-md-12">
            <div id="csvList">

            </div>
            <div class="empty-folder">
                <div class="empty-folder-content">
                    <p><i class="fa fa-folder f-empty-folder" aria-hidden="true"></i></p>
                    <h1 style="font-style:italic">Carpeta Vacía</h1>
                </div>
            </div>
        </div>
    </div>


</div>
<!-- end class="row" id="uploadFilesContentParent" -->

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
                    <option value="0" data-default-folder="Descargas">Descargas del archivo del artículo</option>
                    <option value="1" data-default-folder="Visitas">Visitas a la página del resumen del artículo</option>
                    <option value="2" data-default-folder="Descargas">Descargas de Archivo del número</option>
                    <option value="3" data-default-folder="Visitas">Visitas a la página de la tabla de contenidos del número</option>
                    <option value="4" data-default-folder="Visitas">Visitas a la página principal de la revista</option>
                    <option value="5" data-default-folder="Usuarios">Módulo para usuarios/as XML</option>
                </select>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times-circle"></i> <span data-lang="modal-cancel-btn">Cancelar</span></button>
                <button id="continueSelectFile" type="button" class="btn btn-primary"><span data-lang="modal-continue-btn">Continuar</span> <i class="fa fa-arrow-right"></i></button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="folderListModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3>
                    <span>Seleccione una carpeta </span>
                </h3>
            </div>
            <div class="modal-body">
                <div id="modalFolderList" class="list-group">
                  <!-- <button type="button" class="list-group-item">Cras justo odio</button>
                  <button type="button" class="list-group-item">Dapibus ac facilisis in</button>
                  <button type="button" class="list-group-item">Morbi leo risus</button>
                  <button type="button" class="list-group-item">Porta ac consectetur ac</button>
                  <button type="button" class="list-group-item">Vestibulum at eros</button> -->
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times-circle"></i> <span data-lang="modal-cancel-btn">Cancelar</span></button>
                <button type="button" class="btn btn-default" onclick="newFolder(this)" data-origin="modal"><i class="fa fa-plus"></i> <span data-lang="modal-cancel-btn">Nueva Carpeta</span></button>
            </div>
        </div>
    </div>

</div>

@endsection

@section('javascript')
<script type="text/javascript" src="{{ asset('js/statsarrays.js') }}"></script>
<script id="translateScript" src="{{ asset('js/main/translate.objects.js') }}"></script>
<script src="{{ asset('js/main/config.js') }}"></script>
@stop
