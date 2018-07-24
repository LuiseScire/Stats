@extends('layouts.master')

@section('title', 'Subir CSV')

@section('css')
<link rel="stylesheet" href="{{ asset('css/uploadcsvtables.css') }}">
<style>

</style>
@stop

@section('sidebar')
  @parent
@stop


@section('content')
<div class="row">
  <div class="col-lg-12">
    <div class="address-bar-content-header">
      <h1>Subir CSV</h1>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="{{ url('home') }}"><i class="fa fa-home"></i> Home</a></li>
        <li class="breadcrumb-item"><label><i class="fa fa-upload"></i> Subir CSV</label> </li>
        <li class="current-date pull-right"><span><i class="fa fa-calendar"></i> <span id="current-date"></span></span></li>
      </ol>
    </div>
  </div>

  <div id="inputFileContent" class="col-lg-12">
    <input type="file" id="csvFile" name="csvFile">
  </div>



  <div id="progressBarContent" class="col-lg-12" style="display: none">
    <div class="progress">
      <div id="uploadProgressBar" class="progress-bar progress-bar-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100">
      </div>
    </div>
  </div>

  <div id="confirmFileContent" class="col-lg-12" style="display:none">
    <div id="loadInfoText" class="alert alert-success" role="alert">
        <p>
          Archivo <strong id="strongFileName"></strong> subido correctamente ¿Deseas
          <a href="javascript:void(0)" id="cambiarArchivo"><strong>cambiar el archivo</strong></a>
          o
          <a href="javascript:void(0)" id="uploadFileConfirmed"><strong>continuar</strong></a>
          ?
        </p>
    </div>
    <!--<button type="button" id="cambiarArchivo" name="button" class="btn btn-default">Cambiar Archivo</button>
    <button type="button" id="uploadFileConfirmed" name="button" class="btn btn-primary">Continuar</button>-->
    <hr>
  </div>
  <div class="col-lg-12">
    <div id="loadPreviewText" class="alert alert-warning" style="text-align: center; display:none" role="alert">
      <strong>Cargando vista previa del archivo</strong>
    </div>

    <div class="contenedorexcel">

    </div>
    <!--
    <iframe src="http://docs.google.com/gview?url=/workspace/stats/public/csvfiles/ejemplo.xlsx&embedded=true" style="width:600px; height:450px;" frameborder="0"></iframe>
    -->
    <!-- class col-lg-12 removed-->
    <div id="preView" style="display:none;">
      
      <table id="preViewTable" class="table table-striped">
        <thead>

        </thead>
        <!--<tbody>

        </tbody>-->
      </table>
      <!--<div class="table100 ver1 m-b-110">
				<div class="table100-head">
					<table>
						<thead>
							<tr class="row100 head">
								<th class="cell100 column1">Class name</th>
								<th class="cell100 column2">Type</th>
								<th class="cell100 column3">Hours</th>
								<th class="cell100 column4">Trainer</th>
								<th class="cell100 column5">Spots</th>
							</tr>
						</thead>
					</table>
				</div>

				<div class="table100-body js-pscroll">
					<table>
						<tbody>
							<tr class="row100 body">
								<td class="cell100 column1">Like a butterfly</td>
								<td class="cell100 column2">Boxing</td>
								<td class="cell100 column3">9:00 AM - 11:00 AM</td>
								<td class="cell100 column4">Aaron Chapman</td>
								<td class="cell100 column5">10</td>
							</tr>

							<tr class="row100 body">
								<td class="cell100 column1">Mind & Body</td>
								<td class="cell100 column2">Yoga</td>
								<td class="cell100 column3">8:00 AM - 9:00 AM</td>
								<td class="cell100 column4">Adam Stewart</td>
								<td class="cell100 column5">15</td>
							</tr>

							<tr class="row100 body">
								<td class="cell100 column1">Crit Cardio</td>
								<td class="cell100 column2">Gym</td>
								<td class="cell100 column3">9:00 AM - 10:00 AM</td>
								<td class="cell100 column4">Aaron Chapman</td>
								<td class="cell100 column5">10</td>
							</tr>

							<tr class="row100 body">
								<td class="cell100 column1">Wheel Pose Full Posture</td>
								<td class="cell100 column2">Yoga</td>
								<td class="cell100 column3">7:00 AM - 8:30 AM</td>
								<td class="cell100 column4">Donna Wilson</td>
								<td class="cell100 column5">15</td>
							</tr>

							<tr class="row100 body">
								<td class="cell100 column1">Playful Dancer's Flow</td>
								<td class="cell100 column2">Yoga</td>
								<td class="cell100 column3">8:00 AM - 9:00 AM</td>
								<td class="cell100 column4">Donna Wilson</td>
								<td class="cell100 column5">10</td>
							</tr>

							<tr class="row100 body">
								<td class="cell100 column1">Zumba Dance</td>
								<td class="cell100 column2">Dance</td>
								<td class="cell100 column3">5:00 PM - 7:00 PM</td>
								<td class="cell100 column4">Donna Wilson</td>
								<td class="cell100 column5">20</td>
							</tr>

							<tr class="row100 body">
								<td class="cell100 column1">Cardio Blast</td>
								<td class="cell100 column2">Gym</td>
								<td class="cell100 column3">5:00 PM - 7:00 PM</td>
								<td class="cell100 column4">Randy Porter</td>
								<td class="cell100 column5">10</td>
							</tr>

							<tr class="row100 body">
								<td class="cell100 column1">Pilates Reformer</td>
								<td class="cell100 column2">Gym</td>
								<td class="cell100 column3">8:00 AM - 9:00 AM</td>
								<td class="cell100 column4">Randy Porter</td>
								<td class="cell100 column5">10</td>
							</tr>

							<tr class="row100 body">
								<td class="cell100 column1">Supple Spine and Shoulders</td>
								<td class="cell100 column2">Yoga</td>
								<td class="cell100 column3">6:30 AM - 8:00 AM</td>
								<td class="cell100 column4">Randy Porter</td>
								<td class="cell100 column5">15</td>
							</tr>

							<tr class="row100 body">
								<td class="cell100 column1">Yoga for Divas</td>
								<td class="cell100 column2">Yoga</td>
								<td class="cell100 column3">9:00 AM - 11:00 AM</td>
								<td class="cell100 column4">Donna Wilson</td>
								<td class="cell100 column5">20</td>
							</tr>

							<tr class="row100 body">
								<td class="cell100 column1">Virtual Cycle</td>
								<td class="cell100 column2">Gym</td>
								<td class="cell100 column3">8:00 AM - 9:00 AM</td>
								<td class="cell100 column4">Randy Porter</td>
								<td class="cell100 column5">20</td>
							</tr>

							<tr class="row100 body">
								<td class="cell100 column1">Like a butterfly</td>
								<td class="cell100 column2">Boxing</td>
								<td class="cell100 column3">9:00 AM - 11:00 AM</td>
								<td class="cell100 column4">Aaron Chapman</td>
								<td class="cell100 column5">10</td>
							</tr>

							<tr class="row100 body">
								<td class="cell100 column1">Mind & Body</td>
								<td class="cell100 column2">Yoga</td>
								<td class="cell100 column3">8:00 AM - 9:00 AM</td>
								<td class="cell100 column4">Adam Stewart</td>
								<td class="cell100 column5">15</td>
							</tr>

							<tr class="row100 body">
								<td class="cell100 column1">Crit Cardio</td>
								<td class="cell100 column2">Gym</td>
								<td class="cell100 column3">9:00 AM - 10:00 AM</td>
								<td class="cell100 column4">Aaron Chapman</td>
								<td class="cell100 column5">10</td>
							</tr>

							<tr class="row100 body">
								<td class="cell100 column1">Wheel Pose Full Posture</td>
								<td class="cell100 column2">Yoga</td>
								<td class="cell100 column3">7:00 AM - 8:30 AM</td>
								<td class="cell100 column4">Donna Wilson</td>
								<td class="cell100 column5">15</td>
							</tr>

							<tr class="row100 body">
								<td class="cell100 column1">Playful Dancer's Flow</td>
								<td class="cell100 column2">Yoga</td>
								<td class="cell100 column3">8:00 AM - 9:00 AM</td>
								<td class="cell100 column4">Donna Wilson</td>
								<td class="cell100 column5">10</td>
							</tr>

							<tr class="row100 body">
								<td class="cell100 column1">Zumba Dance</td>
								<td class="cell100 column2">Dance</td>
								<td class="cell100 column3">5:00 PM - 7:00 PM</td>
								<td class="cell100 column4">Donna Wilson</td>
								<td class="cell100 column5">20</td>
							</tr>


						</tbody>
					</table>
				</div>
			</div>-->
    </div>




  </div>
</div>

@stop

@section('javascript')
  <script src="{{ asset('js/uploadcsv.js') }}"/></script>
  <script type="text/javascript">

  </script>

@stop
