@extends('layouts.master')

@section('title', 'Estadìsticas')

@section('sidebar')
    @parent
@stop

@section('content')
<div class="row">
  <div id="noDataText" class="col-lg-12">
    Cargando Datos
  </div>
  <div id="chartsContent" class="col-lg-12" style="display:none">

  </div>
</div>

@stop

@section('javascript')

<script type="text/javascript">
  var fileName = '{{ $filename }}';
</script>
<script src="{{ asset('js/estadisticas.js') }}"></script>

@stop
