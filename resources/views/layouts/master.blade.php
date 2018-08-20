<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- provide the csrf token -->
    <meta name="csrf-token" content="{{ csrf_token() }}"/>
    <link rel="icon" type="image/jpg" href="{{ asset('images/icon.png') }}"/>
    <title>Stats - @yield('title')</title>

    <!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">-->

    <!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">-->
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome-animation/0.2.1/font-awesome-animation.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.10.19/css/dataTables.bootstrap.min.css">
    <link rel="stylesheet" href="{{ asset('css/bootstrap.css') }}">
    <link rel="stylesheet" href="{{ asset('pluggins/bootstrap-select-picker/dist/css/bootstrap-select.css') }}">
    <link rel="stylesheet" href="{{ asset('css/metisMenu.css') }}">
    <link rel="stylesheet" href="{{ asset('css/main.css') }}">
    <link rel="stylesheet" href="{{ asset('css/custom.css') }}">
    <link rel="stylesheet" href="{{ asset('css/jQCloud/jqcloud.css') }}">
    @yield('css')

    <style>
        #sidebar > .sidebar-nav > .nav > li > a,
        #sidebar > .sidebar-nav > .nav > li > .nav-second-level > li > a {
            color: #000000;
        }

        .swal2-popup {
          font-size: 1.6rem !important;
        }

        footer{
            margin-left: 250px;
            min-height:50px;
            padding-top:20px;
            border: 1px solid #e7e7e7;
            /* position: fixed; */
            bottom: 0;
            width: 82%;
            background: #FFFFFF;
            z-index: 3;
        }

        /*
          ##Device = Tablets, Ipads (portrait)
          ##Screen = B/w 768px to 1024px
        */

        /* @media (min-width: 768px) and (max-width: 1024px) {
            .navbar-brand{
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 55%;
            }
        } */

        /*
          ##Device = Tablets, Ipads (landscape)
          ##Screen = B/w 768px to 1024px
        */

        /* @media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {

        } */

        /* @media (max-width: 768px) {

            footer{
                margin: 0 !important;
                width: 100% !important;
            }

              .navbar-brand{
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 85%;
            }
        } */

        /*
          ##Device = Most of the Smartphones Mobiles (Portrait)
          ##Screen = B/w 320px to 479px
        */

        @media (min-width: 320px) and (max-width: 480px) {
            .navbar-brand{
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              width: 85%;
            }

            footer{
                margin: 0 !important;
                width: 100% !important;
            }
        }

        /*
          ##Device = Low Resolution Tablets, Mobiles (Landscape)
          ##Screen = B/w 481px to 767px
        */

        @media (min-width: 481px) and (max-width: 767px) {


            footer{
                margin: 0 !important;
                width: 100% !important;
            }
        }



    </style>
    <script src="https://code.jquery.com/jquery-3.3.1.js"></script>
    <script src="{{ asset('js/translate/translate.js') }}"></script>
    <script type="text/javascript">
        var public_path = "{{ asset('/') }}";
        var currentLang = '{{ Auth::user()->lang }}';

        //currentLang = 'en';
        //default's Spanish
        let stateCheck = setInterval(() => {
          if (document.readyState === 'complete') {
            clearInterval(stateCheck);
            // document ready
            if(currentLang == 'en'){
                $('#translate').click();
            } else {
                $('#langPreloader').fadeOut('slow');
                $('#wrapper').removeClass('blur');
            }
          }
        }, 100);

        var messages;
        if(currentLang == 'en'){
            messages = [
                'Loading...',
                'Wait a moment, please...',
                'Processing data...',
                'This could take a while...',
                'Your file exceeds 3 MB, wait a moment, please...'
            ];

        } else {
            messages = [
                'Cargando...',
                'Espere un momento, por favor...',
                'Procesando datos...',
                'Esto podría demorar un poco...',
                'Su archivo excede los 3MB, espere, por favor...'
            ];

        }
        var message = messages[0];
        var secondsCount = 0;

        var timer = null;
        var interval = 1000;

        $(function () {
            setLoaderMessage();
        });

        function setLoaderMessage() {
            if (timer !== null) return;
            timer = setInterval(function () {
                switch (secondsCount) {
                    case 3:
                        message = messages[1];
                        break;
                    case 6:
                        message = messages[2];
                        break;
                    case 9:
                        message = messages[3];
                        break;
                    case 12:
                        message = messages[4]
                    default:
                        message = message;
                        break;
                }
                secondsCount++;
                $('.msg').text(message);
            }, interval);
            //clearInterval(stopIntervalSetMessage);
        }
        function fadeInLoader() {
            $("#preloader").fadeIn("slow");
            secondsCount = 0;
            setLoaderMessage();
        }

        function fadeOutLoader() {
            $("#preloader").fadeOut("slow");
            clearInterval(timer);
            timer = null;

        }
    </script>
</head>
<body>

<div id="langPreloader">
    <div class="lmsg">
        <i class="fa fa-language faa-flash animated"></i>
        <span id="preLoaderLangMSG">Procesando traducción / Process the translation</span>
    </div>
</div>

<div id="preloader">
    <div class="loader"></div>
    @if(Auth::user()->lang == 'en')
        <div class="msg">Loading...</div>
    @else
        <div class="msg">Cargando...</div>
    @endif
</div>

<a class="ir-arriba" title="Volver arriba">
    <span class="fa-stack">
        <i class="fa fa-circle fa-stack-2x"></i>
        <i class="fa fa-arrow-up fa-stack-1x fa-inverse"></i>
    </span>
</a>

<div id="wrapper" class="blur">
    @section('sidebar')
        <nav id="navBar" class="navbar navbar-default navbar-custom navbar-fixed-top" role="navigation"
             style="margin-bottom: 0">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <!-- {{ url('home') }} -->

                @if(Auth::user()->user_type == 'Admin')
                <a class="navbar-brand" href="javascript:void(0)" style="padding:0">
                    <img alt="Brand" src="{{ asset('images/escire_logo.png') }}" style="min-height: 50px; max-height: 50px">
                </a>
                @else
                    @php
                        $logo = App\JournalUser::getLogo(Auth::user()->journal);
                    @endphp
                    @if(!$logo)
                    <a class="navbar-brand" href="javascript:void(0)">{{ App\JournalUser::getJName(Auth::user()->journal) }} </a>
                    @else
                    <a class="navbar-brand" href="javascript:void(0)" style="padding:0">
                        <img alt="Brand" src="http://escire.mx/assets/website/images/logo.png" style="min-height: 50px; max-height: 50px">
                    </a>
                    @endif
                    <!-- /if getLogo -->
                @endif
                <!-- /if user_type -->

                <!-- show in downstatscountry view -->
                <a id="navLinkBack" class="navbar-brand opc-nav-downstatscountry-view" href="javascript:void(0)"
                   style="display:none">
                    <i class="fa fa-arrow-left"></i> Volver
                </a>
                <a id="navLinkFileName" class="navbar-brand opc-nav-downstatscountry-view" href="javascript:void(0)"
                   style="display:none">
                    <i class="fa fa-file"></i> Documento: <span id="fileNameNavbar"></span>
                </a>
                <!-- -->
            </div>
            <ul class="nav navbar-nav navbar-top-links navbar-right">
                <li class="dropdown">
                    <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                        <i class="fa fa-user fa-fw"></i>{{ Auth::user()->name }} <i class="fa fa-caret-down"></i>
                    </a>
                    <ul class="dropdown-menu dropdown-user">
                        <!--<li>
                          <a href="#"><i class="fa fa-user fa-fw"></i> User Profile</a>
                        </li>
                        <li>
                          <a href="#"><i class="fa fa-gear fa-fw"></i> Settings</a>
                        </li>
                        <li class="divider"></li>-->
                        <li>
                            <a class="dropdown-item" href="{{ route('logout') }}"
                               onclick="event.preventDefault();
                                         document.getElementById('logout-form').submit();">
                                <i class="fa fa-sign-out fa-fw"></i>
                                <span data-lang="menu-opt-logout">{{ __('Salir') }}</span>
                            </a>

                            <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                                @csrf
                            </form>
                        </li>
                    </ul>
                    <!-- /.dropdown-user -->
                </li>
                <li>
                    <a href="javascript:void(0)">
                        <i class="fa fa-language"></i>
                        <span id="translate" data-text="EN,ES" data-file="es,en" data-index="1" data-page="home">EN</span>
                    </a>
                </li>
                <!-- /.dropdown -->
            </ul>

            <!-- /.navbar-top-links -->

            <div id="sidebar" class="navbar-default sidebar" role="navigation"
                 style="background-color: #fff; color: #000">
                <div class="sidebar-nav navbar-collapse">
                    <ul class="nav nav-colors" id="side-menu">
                        <!--MENU INICIO-->

                        <li class="home-item-menu">
                            <a href="{{ url('home') }}" class="link-menu">
                                <i class="fa fa-home fa-fw" style="color: #337ab7;"></i>
                                <span data-lang="menu-opt-home">Inicio</span>
                            </a>
                        </li>
                        <!--<li class="home-item-menu">
                            <a href="#history" class="link-menu"><i class="fa fa-list" style="color: #A41C1E"></i> Historial</a>
                        </li>-->


                        <li class="global-item-menu" style="display: none">
                            <a href="{{ url('home') }}"><i class="fa fa-home fa-fw" style="color: #337ab7;"></i> Inicio</a>
                        </li>
                    <!--<li class="global-item-menu">
                          <a href="{{ url('home') }}#history" class="link-menu"><i class="fa fa-list" style="color: #A41C1E"></i> Historial</a>
                      </li>-->

                    <!--<li>
                          <a href="{{ url('historial') }}#history" class="link-menu"><i class="fa fa-list"></i> Historial</a>
                      </li>
                      <li class="global-item-menu" style="display: none">
                          <a href="{{ url('subircsv') }}"><i class="fa fa-upload fa-fw"></i> Subir CSV</a>
                      </li>-->


                        <li id="menuOptionCharts" style="display: none">
                            <a href="#"><i class="fa fa-bar-chart" style="color: #D800FC;"></i> <span data-lang="menu-opt-charts">Gráficas</span><span
                                        class="fa arrow"></span></a>
                            <ul class="nav nav-second-level nav-colors">
                                <li id="liMenuChartTotal" style="display: none">
                                    <a href="#chartPanelTotal" class="link-menu"> <i class="fa fa-trophy"
                                                                                     style="color: gold;"></i>
                                        Total</a>
                                </li>
                                <li id="liMenuChartCountry" style="display: none">
                                    <a href="#chartPanelCountries" class="link-menu"><i class="fa fa-globe"
                                                                                        style="color: dodgerblue;"></i>
                                        País</a>
                                </li>
                                <li id="liMenuChartCity" style="display: none">
                                    <a href="#chartPanelCity" class="link-menu"><i class="fa fa-building" style="color: cadetblue;"></i>
                                        Ciudad</a>
                                </li>
                                <li id="liMenuChartMonth" style="display: none">
                                    <a href="#chartPanelMonths" class="link-menu"><i class="fa fa-calendar"
                                                                                     style="color: darkred"></i> Mes</a>
                                </li>
                                <li id="liMenuChartNumber" style="display: none">
                                    <a href="#chartPanelNumber" class="link-menu"><i class="fa fa-hashtag"
                                                                                     style="color: darkgreen"></i>
                                        Número</a>
                                </li>
                                <li id="liMenuChartText" style="display: none">
                                    <a href="#chartPanelText" class="link-menu"><i class="fa fa-font"></i>
                                        Texto</a>
                                </li>
                                <!--<li>
                                  <a href="#totalDownloadsPanel" class="link-menu"><i class="fa fa-bar-chart"></i> Descargas Totales</a>
                                </li>
                                <li>
                                  <a href="#totalDownloadsMonthPanel" class="link-menu"><i class="fa fa-bar-chart"></i> Descargas Mensuales</a>
                                </li>
                                <li>
                                  <a href="#countryDownloadsPanel" class="link-menu"><i class="fa fa-bar-chart"></i> Descargas por País</a>
                                </li>-->
                                <!-- Si se agrega otra opción también agregar en el menú de downstatscountry.js para la vista de los países-->
                            </ul>
                        </li>
                        <li id="menuOptionChartsFromCountriesView" style="display: none">
                            <a href="#"><i class="fa fa-bar-chart"></i> Estadísticas<span class="fa arrow"></span></a>
                            <ul id="menuOptionChartsContent" class="nav nav-second-level"></ul>
                        </li>
                        @if(Auth::user()->journal_type == 'Admin')
                        <li>
                            <a href="{{ url('users') }}">
                                <i class="fa fa-users" style="color: #A41C1E;"></i>
                                <span data-lang="menu-opt-users">Usuarios</span>
                            </a>
                        </li>
                        @endif
                    </ul>
                </div>
                <!-- /.sidebar-collapse -->
            </div>
            <!-- /.navbar-static-side -->
        </nav>
    @show
    <div id="page-wrapper" style="/*margin-bottom: 58px;*/">
        @yield('content')
    </div>


     <footer class="main-footer text-center" style="">
         <strong>Copyright © 2018 <a href="javascript:void(0)" style="text-decoration: none; color: #A41C1E">stats.escire.net</a></strong> Todos los derechos reservados.
     </footer>
    <!-- <div class="page-footer">
        <div class="page-footer-text text-center">
                © Copyright 2018 stats.escire.net - Todos los derechos reservados
        </div>
    </div> -->
</div>


<!--<script src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js" charset="utf-8"></script>
-->
<script src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.10.19/js/dataTables.bootstrap.min.js"></script>
<script src="{{ asset('js/bootstrap.js') }}"></script>
<script src="{{ asset('pluggins/bootstrap-select-picker/dist/js/bootstrap-select.js') }}"></script>
<script src="{{ asset('js/metisMenu.js') }}"></script>
<script src="{{ asset('js/main.js') }}"></script>
<script src="{{ asset('js/pluggins/jquery.number.js') }}"></script>
<script src="https://www.gstatic.com/charts/loader.js"></script>
<script src="http://d3js.org/d3.v3.min.js"></script>
<script src="{{ asset('js/pluggins/jQCloud/jqcloud.js') }}"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@7.25.0/dist/sweetalert2.all.min.js"></script>
<script>
    var CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content');
    $(document).ready(function () {
        $('.ir-arriba').click(function () {
            $('body, html').animate({
                scrollTop: '0px'
            }, 1000);
        });

        $(window).scroll(function () {
            if ($(this).scrollTop() > 0) {
                $('.ir-arriba').slideDown(600);
            } else {
                $('.ir-arriba').slideUp(600);
            }

            if ($(this).scrollTop() > 100) {
                //$("#navBar").removeClass("navbar-static-top").addClass("navbar-fixed-top");
            }
        });

        $(document).on('click', 'a.link-menu[href^="#"]', function () {
            var target = $(this.hash);
            var scroll = target.offset().top - 55;
            $('html, body').animate({scrollTop: scroll}, 500);
            return false;
        });

        $('#currentDateES').text(currentDateFormat('es'));
        $('#currentDateEN').text(currentDateFormat('en'));

        switch (currentLang){
            case 'es':
                $('#currentDateES').show();
                break;
            case 'en':
                $('#currentDateEN').show();
                break;
        }
    });

    function currentDateFormat(lang) {
        var dateFormat, date = new Date();
        switch (lang) {
            case 'es':
                var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septimbre", "Octube", "Nomviembre", "Diciembre"];
                dateFormat = date.getDate() + ' de ' + months[date.getMonth()] + ' de ' + date.getFullYear();

                break;
            case 'en':
                var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                dateFormat =  months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();

                break;
        }
        return dateFormat;
    }
</script>

@yield('javascript')
</body>
</html>
