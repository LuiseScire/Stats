@extends('layouts.master')

@section('title', 'Users')

@section('css')
@section('css')
    <style media="screen">
        #NoUserJumbotron i.users {
            transform: scale(0.8);
            opacity: 0.3;
            font-size: 50px;
            margin-bottom: 1rem;
        }

        .register-form h2{
    		color: #636363;
            margin: 0 0 15px;
    		position: relative;
    		text-align: center;
        }
    	.register-form h2:before, .register-form h2:after{
    		content: "";
    		height: 2px;
    		width: 26%;
    		background: #d4d4d4;
    		position: absolute;
    		top: 50%;
    		z-index: 2;
    	}
    	.register-form h2:before{
    		left: 0;
    	}
    	.register-form h2:after{
    		right: 0;
    	}

        .register-form .hint-text{
		color: #999;
		margin-bottom: 30px;
		text-align: center;
	}
    </style>
    <style media="screen">
        .profile-card-background{
            /*background-image: url('https://i.pinimg.com/736x/10/02/e2/1002e25d3a2b4f21dd42015b08646e5f--magdalena-pretty-face.jpg');*/
  		    background-repeat: no-repeat;
  		    background-size: cover;
        }

        .profile-card-container{
            background-position: center top;
            overflow: hidden;
            /*padding: 0px;*/
            /* width: 325px; */
            border-radius: 5px;
            display: inline-block;
            /*margin: 10px;*/
            border: 1px solid #eee;
            margin-bottom: 25px;
        }

        .profile-card-content{
            position: relative;
  		    overflow: hidden;
        }

        .profile-card-background {
		  position: absolute;
		  top: 0px;
		  right: 0px;
		  bottom: 0px;
		  left: 0px;
		  z-index: 1;
		  background-position: center -70px;
		  -webkit-filter: blur(7px);
		  filter: blur(7px);
		}

        .profile-card-image{
            position: relative;
  		    z-index: 2;
  		    padding: 20px;
  		    background: rgb(34,34,34);
  		    background: rgba(34,34,34,0.75);
        }

        .profile-card-image img{
			margin: 25px 25% 0px;
		}

		.profile-card-image h4 { text-align: center; color: #fefefe; font-weight: normal; }

        .profile-card-caption, .profile-card-footer{
			padding: 15px;
		}

        .profile-card-caption-item{
            margin-bottom: 20px;
        }

        .profile-card-caption-item span{
            color: #72777A;
        }

        .profile-card-caption-item h5{
            color: #72777A;
            font-weight: bold;
            margin-top: 0;
            margin-left: 15px;
        }

        .profile-card-caption-options{
            margin: 0;
        }

        .cover-card-background{
        	background-repeat: no-repeat;
		  background-size: cover;
        }

        .cover-card-container{
            background-position: center top;
			overflow: hidden;
			padding: 0px;
			border-radius: 5px;
			display: inline-block;
			/* margin: 10px; */
            width: 100%;
        }

        .cover-card-content{
        	position: relative;
		    overflow: hidden;
        }

        .cover-card-background{
		  position: absolute;
		  top: 0px;
		  right: 0px;
		  bottom: 0px;
		  left: 0px;
		  z-index: 1;
		  background-position: center -70px;
		  -webkit-filter: blur(7px);
		  filter: blur(7px);
        }

        .cover-card-image{
           position: relative;
		  z-index: 2;
		  padding: 20px;
		  background: rgb(34,34,34); /* for IE */
		  background: rgba(34,34,34,0.75);
        }

        .cover-card-image img{
			margin: 25px 25% 0px;
            padding:1px;
            border:1px solid #ccc;
            height: 200px;
            min-height: 200px;
            max-height: 200px;
            border-radius: 5px;
		}

		.cover-card-image h2 { text-align: center; color: #fefefe; font-weight: normal; }
    </style>
@stop
@endsection

@section('content')
<div class="row">
    <div class="col-lg-12">
        <div class="address-bar-content-header">
            <h1>
              <span data-lang="page-title">Usuarios</span>
              @if(auth::id() == 1)
              <span class="btn btn-danger pull-right" id="btnGlobalOpenModalRegister" style="display: none" onclick="userRegisterModalShow()" role="button"><i class="fa fa-user-plus"></i> <span data-lang="btn-new-user">Nuevo Usuario</span></span>
              @endif
            </h1>
            <ol class="breadcrumb">
                <li class="address-item"><a href="{{ url('home') }}"><i class="fa fa-home"></i> Inicio</a></li>
                <li class="address-item"><label><i class="fa fa-users"></i> <span data-lang="address-bar-current-page">Usuarios</span></label></li>
                <li class="current-date pull-right"><span><i class="fa fa-calendar"></i> <span id="currentDateEN" class="date-format-en" style="display:none"></span><span id="currentDateES" class="date-format-es" style="display:none"></span></span></li>
            </ol>
        </div>
    </div> <!--./col-lg-12-->


    @if(auth::id() != 1)
    <div class="col-lg-12">
        <div class="alert alert-warning text-center" role="alert">
          <h1><i class="fa fa-warning"></i> Módulo en contrucción</h1>
        </div>
    </div>
    @else
    <div class="col-md-12">
        <!-- <div id="journalCover">
            <div class="cover-card-container">
        		<div class="cover-card-content">
        			<div class="cover-card-background"
        			style="background-image: url({{ asset('images/your-logo.png') }})"></div>
                    <div class="cover-card-image">
                        <img src="{{ asset('images/your-logo.png') }}" width="50%">
                        <h2>facebook</h2>
                    </div>
        		</div>
        	</div>
        </div> -->

        <div class="cover-card-container" id="journalCover">
    		<div class="cover-card-content">
    			<div class="cover-card-background"
    			style="background-image: url('http://escire.mx/assets/website/images/logo.png')"></div>
                <div class="cover-card-image">
                    <img src="http://escire.mx/assets/website/images/logo.png" width="50%">
                    <h2>facebook</h2>
                </div>
    		</div>
    	</div>
    </div>

    <div class="col-lg-12">
        <div class="jumbotron" id="NoUserJumbotron" style="text-align: center; border-style: dashed; background-color: white; border-color: #eee; display: none">
            <h2 data-lang="main-no-users-legend">Aún no hay usuarios registrados</h2>
            <p><i class="fa fa-users users" aria-hidden="true"></i></p>
            <p>
                <a class="btn btn-danger btn-lg" id="csvFileButton" href="javascript:void(0)" role="button" onclick="userRegisterModalShow()">
                    <i class="fa fa-user-plus"></i> <span data-lang="btn-new-user">Nuevo Usuario</span>
                </a>
            </p>
        </div>
        <br>
    </div>


    <div class="col-md-6 col-md-offset-3">
        <input type="text" class="form-control" id="serchUsers" style="font-family: Arial, FontAwesome" placeholder="&#xF002; buscar usuario">
        <br>
    </div>


    <div id="userList">
        <!-- <div class="col-md-4 col-sm-12">
            <div class="profile-card-container">
                <div class="profile-card-content">
                    <div class="profile-card-background" style="background-image: url('https://i.pinimg.com/736x/10/02/e2/1002e25d3a2b4f21dd42015b08646e5f--magdalena-pretty-face.jpg')"></div>
                    <div class="profile-card-image">
                        <img src="https://i.pinimg.com/736x/10/02/e2/1002e25d3a2b4f21dd42015b08646e5f--magdalena-pretty-face.jpg" width="50%" class="img-circle">
                        <h4>Luis Felipe Zacarías Guzmán</h4>
                    </div>
                </div>
                <div class="profile-card-caption">
                    <div class="profile-card-caption-item">
                        <span><i class="fa fa-user"></i> Tipo de usuario</span>
                        <h5>Administrador</h5>
                    </div>
                    <div class="profile-card-caption-item">
                        <span><i class="fa fa-at"></i> Correo Electrónico</span>
                        <h5>zoemrccavl93@gmail.com</h5>
                    </div>
                    <div class="profile-card-caption-item">
                        <span><i class="fa fa-graduation-cap"></i> Grado Académico</span>
                        <h5>Ingeniero</h5>
                    </div>
                    <div class="profile-card-caption-item">
                        <span><i class="fa fa-phone"></i> Teléfono</span>
                        <h5>222 2202</h5>
                    </div>
                    <div class="profile-card-caption-item">
                        <span><i class="fa fa-map-marker"></i> Origen</span>
                        <h5>San Buenaventura Nealtican, Puebla, México</h5>
                    </div>
                    <div class="profile-card-caption-item">
                        <span><i class="fa fa-check"></i> Estatus</span>
                        <h5>Activo</h5>
                    </div>
                    <div class="profile-card-caption-item text-center">
                        <button type="button" class="btn btn-default" name="button"><i class="fa fa-edit"></i> Editar</button>
                        <button type="button" class="btn btn-danger" name="button"><i class="fa fa-trash"></i> Eliminar</button>
                    </div>
                </div>
            </div>
        </div> -->

    </div> <!-- /#userList-->

    @endif
</div> <!--/.row-->


<div class="modal fade" id="userRegisterModal">
    <div class="modal-dialog ">
        <div class="modal-content">
            <!--<div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <i class="fa fa-user-plus"></i> <span data-lang='user-register-header'>Registrar Nuevo Usuario</span>
            </div>-->
            <div class="modal-body register-form">
                <h2> <i class="fa fa-user-plus"></i> Nuevo Usuario </h2>
                <p class="hint-text"><span>Campos con</span> ( <span style="font-size: 18px">*</span> ) <span>son requeridos</span></p>
                <div class="alert alert-danger" id="registerFormAlert" style="display: none">
                    <strong>!Error¡ </strong><span id="registerFormAlertMessage"></span>
                </div>
                <form id="userRegisterForm">
                    <div class="form-group">
            			<div class="row">
            				<div class="col-xs-6">
                                <div class="input-group">
                                    <span class="input-group-addon"><i class="fa fa-user"></i> </span>
                                    <input type="text" class="form-control" name="userFirstName" placeholder="Nombre(s) *">
                                </div>
                            </div>
            				<div class="col-xs-6">
                                <div class="input-group">
                                    <span class="input-group-addon"><i class="fa fa-user"></i> </span>
                                    <input type="text" class="form-control" name="userLastName" placeholder="Apellidos *">
                                </div>
                            </div>
            			</div>
                    </div>
                    <div class="form-group">
                        <div class="input-group">
                            <span class="input-group-addon"><i class="fa fa-at"></i></span>
                        	<input type="email" class="form-control" name="userEmail" placeholder="Correo Electrónico *">
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="input-group">
                            <span class="input-group-addon"><i class="fa fa-lock"></i></span>
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
                    <!--<div class="form-group">
                        <div class="input-group">
                            <span class="input-group-addon"><i class="fa fa-user"></i> </span>
                            <input type="text" class="form-control" name="userAdscripcion" placeholder="Adscripción *" required="required">
                        </div>
                    </div>-->
                    <div class="form-group">
                        <div class="input-group">
                            <span class="input-group-addon"><i class="fa fa-phone"></i></span>
                            <input type="text" class="form-control" name="userPhone" placeholder="Teléfono">
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="input-group">
                            <span class="input-group-addon"><i class="fa fa-globe"></i> </span>
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
                <button type="button" class="btn btn-danger" onclick="userRegister()">
                    <i class="fa fa-save"></i>
                    Registrar Usuario
                </button>
            </div>
        </div>
    </div>

</div>

@endsection

@section('javascript')
<script src="{{ asset('js/users/users.js') }}" charset="utf-8"></script>
<script type="text/javascript">
    var auth_id = '{{ Auth::id() }}';
    console.log(auth_id);

</script>
@endsection
