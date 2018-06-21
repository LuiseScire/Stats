@extends('layouts.master')

@section('title', 'Home')

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
<div id="chartCountryDownloads"></div>
<!--<div class="row">
  <div class="col-lg-12">

  </div>

</div>-->
@stop

@section('javascript')
<script type="text/javascript">
  var fileName = "statistics-20180614.csv";
</script>
<script type="text/javascript" src="{{ asset('js/pluggins/download.js') }}"></script>
<script type="text/javascript" src="{{ asset('js/statsarrays.js') }}"></script>
<script type="text/javascript" src="{{ asset('js/downstatscountry.js') }}"/></script>
@stop
