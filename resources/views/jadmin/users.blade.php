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
        #bg {
            background-position: center top;
            padding: 0px;
            overflow: hidden;
        }

        #search-bg {
            background-image: url('../public/images/default-user-avatar.png');
            background-repeat: no-repeat;
            background-size: cover;
        }

        #search-container {
            position: relative;
        }

        #search-bg {
            /* Absolutely position it, but stretch it to all four corners, then put it just behind #search's z-index */
            position: absolute;
            top: 0px;
            right: 0px;
            bottom: 0px;
            left: 0px;
            z-index: 99;

            /* Pull the background 70px higher to the same place as #bg's */
            background-position: center -70px;

            transform:scale(1.1);

            -webkit-filter: blur(6px);
            /*filter: url('https://scontent.fpbc2-2.fna.fbcdn.net/v/t1.0-9/38697879_1091318037699519_7971400520453586944_n.jpg?_nc_cat=0&oh=0493c833a71cd2a2c167f819428584a1&oe=5C01A1B8#blur');*/
            filter: blur(6px);
        }

        #search {

            /* Put this on top of the blurred layer */
            position: relative;
            z-index: 100;
            padding: 30px 160px;
            background: rgb(34,34,34); /* for IE */
            background: rgba(34,34,34,0.75);
            }

        @media (max-width: 600px ) {
            /*#bg { padding: 10px; }
            #search-bg { background-position: center -10px; }*/
        }

        #search h2, #search h5, #search h5 a { text-align: center; color: #fefefe; font-weight: normal; }
        #search h2 { margin-bottom: 10px }
        /*#search h5 { margin-top: 70px }*/
    </style>
    <style media="screen">
        .imageContainer{
            overflow: hidden;
        }
        .imageContainer img{
            filter: blur(10px);
            transform:scale(1.1);
        }
    </style>
@stop
@endsection

@section('content')
<div class="row">
    <div class="col-lg-12">
        <div class="address-bar-content-header">
            <h1>
              <span data-lang="page-title">Gestión de Usuarios</span>
              @if(auth::id() == 1)
              <span id="" class="btn btn-danger pull-right" onclick="userRegisterModalShow()" role="button"><i class="fa fa-user-plus"></i> <span data-lang="btn-new-user">Nuevo Usuario</span></span>
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
    <div class="col-lg-12">
        <div id="NoUserJumbotron" class="jumbotron" style="text-align: center; border-style: dashed; background-color: white; border-color: #eee; display: block">
            <h2 data-lang="main-no-users-legend">Aún no hay usuarios registrados</h2>
            <p><i class="fa fa-users users" aria-hidden="true"></i></p>
            <p>
                <a id="csvFileButton" class="btn btn-danger btn-lg" href="javascript:void(0)" role="button" onclick="userRegisterModalShow()">
                    <i class="fa fa-user-plus"></i> <span data-lang="btn-new-user">Nuevo Usuario</span>
                </a>
            </p>
        </div>
    </div><!--./col-lg-12-->

    <div id="usersList" class="col-lg-6 col-md-6 col-xs-6">
        <div id="" class="media user-item">
            <div class="media-left">
                <a href="javascript:void(0)">
                    <img class="media-object img-circle" src="../public/images/default-user-avatar.png" alt="icon" width="64px" height="64px">
                </a>
            </div>
            <div class="media-body" style="color: #E05740">
                <h4 class="media-heading csv-file-item" data-csvname="" style="color: #A41C1E; cursor: pointer">Usuario 1</h4>
                type <strong>Usuario</strong>
           </div>
       </div>
       <div id="" class="media user-item">
           <div class="media-left">
               <a href="javascript:void(0)">
                   <img class="media-object img-circle" src="../public/images/default-user-avatar.png" alt="icon" width="64px" height="64px">
               </a>
           </div>
           <div class="media-body" style="color: #E05740">
               <h4 class="media-heading csv-file-item" data-csvname="" style="color: #A41C1E; cursor: pointer">Usuario 2</h4>
               type <strong>Usuario</strong>
          </div>
      </div>
      <div id="" class="media user-item">
          <div class="media-left">
              <a href="javascript:void(0)">
                  <img class="media-object img-circle" src="../public/images/default-user-avatar.png" alt="icon" width="64px" height="64px">
              </a>
          </div>
          <div class="media-body" style="color: #E05740">
              <h4 class="media-heading csv-file-item" data-csvname="" style="color: #A41C1E; cursor: pointer">Usuario 3</h4>
              type <strong>Usuario</strong>
         </div>
      </div>
    </div>

    <div id="profileUserCard" class="col-lg-6 col-md-6 col-xs-12" style="display: none">
        <div id="bg">
          <div id="search-container">
            <div id="search-bg"></div>
            <div id="search" class="text-center">
              <!--<img src="https://i.pinimg.com/736x/10/02/e2/1002e25d3a2b4f21dd42015b08646e5f--magdalena-pretty-face.jpg" class="img-responsive img-circle" alt="">-->
              <img src="../public/images/default-user-avatar.png" class="img-responsive img-circle" alt="">
              <h2>User name</h2>
              <h5><a href="#">User Data</a></h5>
            </div>
          </div>
        </div>
        <div class="">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </div>
    </div>

    @endif
</div> <!--./row-->


<div id="userRegisterModal" class="modal fade">
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
                    <input type="hidden" name="userJournal" value="{{ Auth::user()->journal }}">
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
                                    <option value="">No se resivieron los datos</option>
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
<script type="text/javascript">
    var profileUserCardStatus = 0;
    var pucstatus = 0;
    $('.user-item').click( function() {
        if(pucstatus == 0){
            $('#profileUserCard').fadeIn('slow');
        }
        pucstatus++;
    });

    function userRegisterModalShow(){
        $('#userRegisterModal').modal('show');
    }

    function userRegister(){
        var data = {'_token': CSRF_TOKEN};
        var form = $('#userRegisterForm');

        try {
            if($('input[name="userFirstName"]').val().trim().length < 1) throw 'Nombre de usuario no puede estar vacío';
            if($('input[name="userLastName"]').val().trim().length < 1) throw 'Apellido de usuario no puede estar vacío';
            if($('input[name="userEmail"]').val().trim().length < 1) throw 'Correo electrónico no puede estás vacío';
            if($('input[name="userPassword"]').val().trim().length < 1) throw 'Contraseña no puede estar vacía';
            if($('input[name="userPassword"]').val().trim().length < 8) throw 'La contraseña no puede ser menor a 8 caracteres';
            alert('todo en orden');
            /*$.ajax({
                method  : 'POST',
                url     : '/userregister',
                data    : form.serialize() + '&' + $.param(data),
                dataType: 'JSON',
                success : function(response) {
                    console.log(response);
                },
            });*/
        } catch (e) {
            $('#registerFormAlert').fadeOut('fast').fadeIn('slow');
            $('#registerFormAlertMessage').text(e);
        }



    }

    function randomPassword(){
        var randPass = randomString(10, '#aA!');
        $('input[name="userPassword"]').val(randPass);
        //console.log(randomString(16, 'aA'));
        //console.log(randomString(32, '#aA'));
        //console.log(randomString(64, '#A!'));
    }

    function randomString(length, chars) {
        var mask = '';
        if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
        if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (chars.indexOf('#') > -1) mask += '0123456789';
        if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
        var result = '';
        for (var i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
        return result;
    }

</script>
@endsection
