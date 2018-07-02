@extends('layouts.master')

@section('title', 'Home')

@section('css')
<style media="screen">

</style>
@stop

@section('sidebar')
    @parent
@stop

@section('content')
<div class="row">
  <div class="col-lg-12">
    <div class="addres-bar-content-header">
      <h1>Home</h1>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><label><i class="fa fa-home"></i> Home</label></li>
        <li class="current-date pull-right"><span><i class="fa fa-calendar"></i> <span id="current-date"></span></span></li>
      </ol>
    </div>
  </div>
  <div id="noFiles" class="col-lg-12">
    Sin documentos para mostrar
  </div>
  <div id="csvListContent" class="col-lg-12" style="display:none">
    <ul id="csvList" class="list-group"></ul>
  </div>
</div>
@stop

@section('javascript')
  <script type="text/javascript" src="{{ asset('js/main2.js') }}"/></script>
@stop
