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

        .chip {
            display: inline-block;
            padding: 0 25px;
            height: 50px;
            font-size: 16px;
            line-height: 50px;
            border-radius: 25px;
            background-color: #f1f1f1;
            margin-bottom: 15px;
        }

        .chip img {
            float: left;
            margin: 0 10px 0 -25px;
            height: 50px;
            width: 50px;
            border-radius: 50%;
        }
    </style>
    <style media="screen">
        #bg {
            background-position: center top;
            padding: 0px;
            overflow: hidden;
        }

        #search-bg {
            background-image: url('https://scontent.fpbc2-2.fna.fbcdn.net/v/t1.0-9/38697879_1091318037699519_7971400520453586944_n.jpg?_nc_cat=0&oh=0493c833a71cd2a2c167f819428584a1&oe=5C01A1B8');
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
            filter: url('https://scontent.fpbc2-2.fna.fbcdn.net/v/t1.0-9/38697879_1091318037699519_7971400520453586944_n.jpg?_nc_cat=0&oh=0493c833a71cd2a2c167f819428584a1&oe=5C01A1B8#blur');
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
              <span id="" class="btn btn-danger pull-right" onclick="" role="button"><i class="fa fa-user-plus"></i> <span data-lang="btn-new-user">Nuevo Usuario</span></span>
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
                <a id="csvFileButton" class="btn btn-danger btn-lg" href="#" role="button" onclick="">
                    <i class="fa fa-user-plus"></i> <span data-lang="btn-new-user">Nuevo Usuario</span>
                </a>
            </p>
        </div>
    </div><!--./col-lg-12-->

    <div id="usersList">
        <div class="col-lg-6 col-md-6 col-xs-6">
            <div class="col-lg-6 col-md-6">
                <div class="chip">
                  <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Person" width="96" height="96">
                  Luis F. Zacarías Guzmán
                </div>
            </div>
            <div class="col-lg-6 col-md-6">
                <div class="chip">
                  <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Person" width="96" height="96">
                  Luis F. Zacarías Guzmán
                </div>
            </div>
            <div class="col-lg-6 col-md-6">
                <div class="chip">
                  <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Person" width="96" height="96">
                  Luis F. Zacarías Guzmán
                </div>
            </div>
            <div class="col-lg-6 col-md-6">
                <div class="chip">
                  <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Person" width="96" height="96">
                  Luis F. Zacarías Guzmán
                </div>
            </div>
            <div class="col-lg-6 col-md-6">
                <div class="chip">
                  <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Person" width="96" height="96">
                  Luis F. Zacarías Guzmán
                </div>
            </div>
            <div class="col-lg-6 col-md-6">
                <div class="chip">
                  <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Person" width="96" height="96">
                  Luis F. Zacarías Guzmán
                </div>
            </div>
            <div class="col-lg-6 col-md-6">
                <div class="chip">
                  <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Person" width="96" height="96">
                  Luis F. Zacarías Guzmán
                </div>
            </div>
            <div class="col-lg-6 col-md-6">
                <div class="chip">
                  <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Person" width="96" height="96">
                  Luis F. Zacarías Guzmán
                </div>
            </div>
            <div class="col-lg-6 col-md-6">
                <div class="chip">
                  <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Person" width="96" height="96">
                  Luis F. Zacarías Guzmán
                </div>
            </div>
            <div class="col-lg-6 col-md-6">
                <div class="chip">
                  <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Person" width="96" height="96">
                  Luis F. Zacarías Guzmán
                </div>
            </div>
            <div class="col-lg-6 col-md-6">
                <div class="chip">
                  <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Person" width="96" height="96">
                  Luis F. Zacarías Guzmán
                </div>
            </div>
            <div class="col-lg-6 col-md-6">
                <div class="chip">
                  <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Person" width="96" height="96">
                  Luis F. Zacarías Guzmán
                </div>
            </div>
            <div class="col-lg-6 col-md-6">
                <div class="chip">
                  <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Person" width="96" height="96">
                  Luis F. Zacarías Guzmán
                </div>
            </div>
            <div class="col-lg-6 col-md-6">
                <div class="chip">
                  <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Person" width="96" height="96">
                  Luis F. Zacarías Guzmán
                </div>
            </div>
            <div class="col-lg-6 col-md-6">
                <div class="chip">
                  <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Person" width="96" height="96">
                  Luis F. Zacarías Guzmán
                </div>
            </div>
            <div class="col-lg-6 col-md-6">
                <div class="chip">
                  <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Person" width="96" height="96">
                  Luis F. Zacarías Guzmán
                </div>
            </div>
        </div>
        <div id="profileUserCard" class="col-lg-6 col-md-6 col-xs-12" style="display: none">
            <div id="bg">
              <div id="search-container">
                <div id="search-bg"></div>
                <div id="search" class="text-center">

                  <!--<img src="https://i.pinimg.com/736x/10/02/e2/1002e25d3a2b4f21dd42015b08646e5f--magdalena-pretty-face.jpg" class="img-responsive img-circle" alt="">-->
                  <img src="https://scontent.fpbc2-2.fna.fbcdn.net/v/t1.0-9/38697879_1091318037699519_7971400520453586944_n.jpg?_nc_cat=0&oh=0493c833a71cd2a2c167f819428584a1&oe=5C01A1B8" class="img-responsive img-circle" alt="">
                  <h2>Marie Juar'z Amaro</h2>
                  <h5><a href="#"></a></h5>
                </div>
              </div>
            </div>
            <div class="">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>

        </div>
    </div>
    @endif
</div> <!--./row-->
@endsection

@section('javascript')
<script type="text/javascript">
    var profileUserCardStatus = 0;
    var pucstatus = 0;
    $('.chip').click( function() {
        if(pucstatus == 0){
            $('#profileUserCard').fadeIn('slow');
        }
        pucstatus++;
    });
</script>
@endsection
