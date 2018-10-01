@extends('layouts.master')

@section('title', 'Admin Panel')

@section('css')
<link rel="stylesheet" href="{{ asset('css/views/jadmin/users.css') }}">
<style media="screen">
    .row-selected{
        background-color: #A41C1E !important;
        color: #ffffff;
    }
    p.header{
        color: #999;
    }
</style>
@stop

@section('sidebar')
    @parent
@stop

@section('content')
    <div class="row">
        <div class="col-lg-12">
            <div class="address-bar-content-header">
                <h1>
                    <span data-lang="page-title">Revistas registradas en Stats</span>
                    <span id="btnGlobalOpenModalRegister" class="btn btn-danger pull-right" data-toggle="modal" data-target="#journalRegisterModal" role="button"><i class="fa fa-user-plus"></i> <span data-lang="btn-new-journal">Registrar Revista</span></span>
                </h1>
                <ol class="breadcrumb">
                    <li class="address-item"><label><i class="fa fa-home"></i> Inicio</label></li>
                    <li class="current-date pull-right"><span><i class="fa fa-calendar"></i> <span id="currentDateEN" class="date-format-en" style="display:none"></span><span id="currentDateES" class="date-format-es" style="display:none"></span></span></li>
                </ol>
            </div>
        </div>
        <div class="col-md-12 col-xs-12">
            <table class="table table-striped table-bordered" id="journalsTable" style="width: 100%"></table>
        </div>
    </div>

    <div class="modal fade" id="journalRegisterModal">
        <div class="modal-dialog ">
            <div class="modal-content">
                <!--<div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <i class="fa fa-user-plus"></i> <span data-lang='user-register-header'>Registrar Nuevo Usuario</span>
                </div>-->
                <div class="modal-body register-form">
                    <h2> <i class="fa fa-user-plus"></i> <span id="modalRegisterTitle">Nueva Revista</span> </h2>
                    <p class="hint-text"><span>Campos con</span> ( <span style="font-size: 18px">*</span> ) <span>son requeridos</span></p>
                    <div class="alert alert-danger" id="registerFormAlert" style="display: none">
                        <strong>!Error¡ </strong><span id="registerFormAlertMessage"></span>
                    </div>
                    <form id="userRegisterForm">
                        <p class="header"><span>Datos de la revista</span></p>
                        <div class="form-group">
                            <div class="input-group">
                                <span class="input-group-addon"><i class="fa fa-book"></i> *</span>
                                <input type="text" class="form-control" name="userJournalName" placeholder="Nombre de la revista *">
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="input-group">
                                <span class="input-group-addon"><i class="fa fa-phone"></i></span>
                                <input type="text" class="form-control" name="userJournalPhone" placeholder="Teléfono">
                            </div>
                        </div>
                        <p class="header">
                            <span>Palabras clave del <em>nombre de la revista</em> para una búsqueda de datos más precisa.</span>
                            <br>
                            <small>Evite escribir artículos por ejemplo: <strong>el o la</strong>, al inicio.</small>
                        </p>
                        <div class="form-group">
                            <div class="input-group">
                                <span class="input-group-addon"><i class="fa fa-key"></i></span>
                                <input type="text" class="form-control" name="userJournalAffiliation" placeholder="">
                            </div>
                        </div>
                        <br>
                        <p class="header"><span>Datos del usuario administrador</span></p>
                        <div class="form-group">
                			<div class="row">
                				<div class="col-xs-6">
                                    <div class="input-group">
                                        <span class="input-group-addon"><i class="fa fa-user"></i> *</span>
                                        <input type="text" class="form-control" name="userFirstName" placeholder="Nombre(s) *">
                                    </div>
                                </div>
                				<div class="col-xs-6">
                                    <div class="input-group">
                                        <span class="input-group-addon"><i class="fa fa-user"></i> *</span>
                                        <input type="text" class="form-control" name="userLastName" placeholder="Apellidos *">
                                    </div>
                                </div>
                			</div>
                        </div>
                        <div class="form-group">
                            <div class="input-group">
                                <span class="input-group-addon"><i class="fa fa-at"></i> *</span>
                            	<input type="email" class="form-control" name="userEmail" placeholder="Correo Electrónico *">
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="input-group">
                                <span class="input-group-addon"><i class="fa fa-lock"></i> *</span>
                                <input type="text" class="form-control" name="userPassword" placeholder="Contraseña *">
                                <span class="input-group-btn">
                                    <button type="button" class="btn btn-default" name="button"onclick="randomPassword()"><i class="fa fa-random"></i> Crear contraseña</button>
                                </span>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="input-group">
                                <span class="input-group-addon"><i class="fa fa-graduation-cap"></i> </span>
                                <select class="form-control" name="userAcademicDegree">
                                    @if(!$degrees->isEmpty())
                                        <option value="---">-- Grado Académico --</option>
                                        @foreach($degrees as $d)
                                        <option value="{{ $d->degree_id }}">{{ $d->degree_name}}</option>
                                        @endforeach
                                    @else
                                        <option>No se resivieron los datos</option>
                                    @endif
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="input-group">
                                <span class="input-group-addon"><i class="fa fa-phone"></i></span>
                                <input type="text" class="form-control" name="userPhone" placeholder="Teléfono">
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="input-group">
                                <span class="input-group-addon"><i class="fa fa-user"></i> *</span>
                                <input type="text" class="form-control" name="userAscription" placeholder="Adscripción *">
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="input-group">
                                <span class="input-group-addon"><i class="fa fa-globe"></i> *</span>
                                <select class="form-control selectpicker" name="userCountry" data-live-search="true">
                                    @if(!$countries->isEmpty())
                                        @if(Auth::user()->lang == 'en')
                                            <option value="---">--- Country * ---</option>
                                            @foreach($countries as $country)
                                                <option value="{{ $country->country_id }}">{{ $country->country_en }}</option>
                                            @endforeach
                                        @else
                                            <option value="---">--- País * ---</option>
                                            @foreach($countries as $country)
                                                <option value="{{ $country->country_id }}">{{ $country->country_es }}</option>
                                            @endforeach
                                        @endif
                                    @else
                                        <option>Datos no recibidos</option>
                                    @endif
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="input-group">
                                <span class="input-group-addon"><i class="fa fa-globe"></i> </span>
                                <input type="text" class="form-control" name="userState" placeholder="Estado">
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="input-group">
                                <span class="input-group-addon"><i class="fa fa-globe"></i> </span>
                                <input type="text" class="form-control" name="userCity" placeholder="Ciudad / Municipio / Localidad">
                            </div>
                        </div>
                        <!--ciudad municipio localidad-->
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">
                        <i class="fa fa-times-circle"></i> Cerrar
                    </button>
                    <button type="button" class="btn btn-danger" id="btnRegisterUserJournal" onclick="userJournalRegister(event)" data-register="journal" data-journalid="">
                        <i class="fa fa-save"></i>
                        Registrar
                    </button>
                </div>
            </div>
        </div>

    </div>
@stop

@section('javascript')
    <script type="text/javascript" src="{{ asset('js/admin/panel.js') }}"></script>
  <script type="text/javascript">

  </script>
@stop
