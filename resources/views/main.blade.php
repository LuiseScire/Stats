@extends('layouts.master')

@section('title', 'Home')

@section('sidebar')
    @parent
@stop

@section('content')
<div class="row">
    <div id="noFiles" class="col-lg-12">
    Sin documentos para mostrar
    </div>
    <div id="csvListContent" class="col-lg-12" style="display:none">
      <div class="row">
        <ul id="csvList" class="list-group"></ul>
      </div>
      <div class="row">
        <div id="drawChartTotalDownloads"></div>
      </div>
      <div class="row">
        <div id="drawChartTotalDownloadsMonth"></div>
      </div>
      <div class="row">
        <div id="drawChartCountryDownloads"></div>
      </div>
    </div>
</div>
@stop

@section('javascript')
  <script type="text/javascript" src="{{ asset('js/statsarrays.js') }}"></script>
  <script type="text/javascript" src="{{ asset('js/main2.js') }}"/></script>
@stop
