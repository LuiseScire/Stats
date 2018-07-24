@extends('layouts.master')

@section('title', 'Historial')

@section('css')
@stop

@section('sidebar')
    @parent
@stop

@section('content')
    <div class="row">
        <div class="col-lg-12">
            <div class="addres-bar-content-header">
                <h1><div id="titleAlert" class="alert" role="alert">Historial de archivos subidos. Total: <span id="totalFiles"></span></div></h1>
                <ol class="breadcrumb">
                    <li class="address-item"><a href="{{ url('home') }}"><i class="fa fa-home"></i> Inicio</a></li>
                    <li class="address-item"><label><i class="fa fa-list"></i> Historial</label></li>
                    <li class="current-date pull-right"><span><i class="fa fa-calendar"></i> <span id="current-date"></span></span></li>
                </ol>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div id="noFiles" style="display: none">
                <div class="alert alert-warning" role="alert">
                    Aún no has subido ningún archivo.
                    <a href="{{ url('home') }}">
                        <button class="btn btn-primary btn-xs"><i class="fa fa-folder-open"></i> Ir a inicio para subir archivos</button>
                    </a>
                </div>
            </div>
            <div id="csvListContent" class="col-lg-12" style="display:none">
                <ul id="csvList" class="list-group"></ul>
            </div>
        </div>
    </div>
@stop

@section('javascript')
    <script src="{{ asset('js/history.js') }}"></script>
@stop