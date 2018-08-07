@extends('layouts.admin.panel')

@section('title', 'Admin Panel')

@section('css')
@stop

@section('sidebar')
    @parent
@stop

@section('content')
    <div class="row">
        <div class="col-lg-12">
            <div class="address-bar-content-header">
                <h1 id="titlePage"></h1>
                <ol class="breadcrumb">
                    <li class="address-item"><label><i class="fa fa-home"></i> Inicio</label></li>
                    <li class="current-date pull-right"><span><i class="fa fa-calendar"></i> <span id="current-date"></span></span></li>
                </ol>
            </div>
        </div>
        <div class="col-md-12 col-xs-12">
            Hello World!
        </div>
    </div>
    <br>
@stop

@section('javascript')
  <script type="text/javascript">
    fadeOutLoader();
  </script>
@stop
