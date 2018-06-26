@extends('layouts.master')

@section('title', '')

@section('css')
<style media="screen">
  #page-wrapper{
    margin: 0px;
  }
</style>
@stop

@section('sidebar')
    @parent
@stop

@section('content')
<div class="container">
  <ul class="nav nav-tabs">
		<li class="active"><a  href="#paisesConDescargas" data-toggle="tab">Países con descargas <span id="badgeWith" class="badge"></span></a></li>
		<li><a id="aPaisesSinDescargas" href="#paisesSinDescargas" data-toggle="tab">Países sin descargas <span id="badgeWithout" class="badge"></span></a></li>
	</ul>

	<div class="tab-content">
	  <div class="tab-pane active" id="paisesConDescargas">
      <br>
      <table id="countryDownloadsTable" class="table table-striped table-bordered" style="width:100%"></table>
      <br>
      <div class="col-lg-12">
        <div class="dropdown pull-right">
          <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
            Exportar como:
            <span class="caret"></span>
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
            <li><a href="javascript:void(0)" class="export-action" data-charttype="with" data-typeexport="png"><i class="fa fa-image"></i> Imagen PNG</a></li>
          </ul>
        </div>
        <!-- /.dropdown-->
      </div>
      <!-- /.col-lg-12 -->
      <br><br>
      <div id="countryDownloadsChart" class="chart" style="height:400%"></div>
		</div>
    <div class="tab-pane active" id="paisesSinDescargas">
      <br>
      <table id="countryWithoutDownloadsTable" class="table table-striped table-bordered" style="width:100%"></table>
      <br>
      <div class="col-lg-12">
        <div class="dropdown pull-right">
          <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
            Exportar como:
            <span class="caret"></span>
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
            <li><a href="javascript:void(0)" class="export-action" data-charttype="without" data-typeexport="png"><i class="fa fa-image"></i> Imagen PNG</a></li>
          </ul>
        </div>
        <!-- /.dropdown-->
      </div>
      <!-- /.col-lg-12 -->
      <br><br>
      <div id="countryWithoutDownloadsChart" class="chart" style="height:400%"></div>
		</div>
	</div>
</div>
@stop

@section('javascript')
<script type="text/javascript">
  var fileName = "{{ $filename }}";
  $("#navLinkBack").click(function() {
    location.href = "{{ url('estadisticas/archivo/'.$filename) }}";//'estadisticas/archivo/' + fileName;
  });
</script>
<script type="text/javascript" src="{{ asset('js/pluggins/download.js') }}"></script>
<script type="text/javascript" src="{{ asset('js/statsarrays.js') }}"></script>
<script type="text/javascript" src="{{ asset('js/downstatscountry.js') }}"/></script>
@stop
