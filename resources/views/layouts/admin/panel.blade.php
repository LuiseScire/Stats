<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <!-- provide the csrf token -->
      <meta name="csrf-token" content="{{ csrf_token() }}"/>
      <link rel="icon" type="image/jpg" href="{{ asset('images/icon.png') }}"/>
      <title>Stats - @yield('title')</title>

      <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">

      <link rel="stylesheet" href="https://cdn.datatables.net/1.10.19/css/dataTables.bootstrap.min.css">
      <link rel="stylesheet" href="{{ asset('css/bootstrap.css') }}">
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
      </style>
      <script src="https://code.jquery.com/jquery-3.3.1.js"></script>
      <script type="text/javascript">
          var messages = [
              'Cargando...',
              'Espere un momento, por favor...',
              'Procesando datos...',
              'Esto podría demorar un poco...'
          ];
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
              //$("wrapper").addClass("blur");
          }

          function fadeOutLoader() {
              $("#preloader").fadeOut("slow");
              clearInterval(timer);
              timer = null;
              //$("#wrapper").removeClass("blur");
          }
      </script>

  </head>
  <body>
      <div id="preloader">
          <div class="loader"></div>
          <div class="msg">Cargando...</div>
      </div>

      <a class="ir-arriba" title="Volver arriba">
          <span class="fa-stack">
              <i class="fa fa-circle fa-stack-2x"></i>
              <i class="fa fa-arrow-up fa-stack-1x fa-inverse"></i>
          </span>
      </a>

      <div id="wrapper">
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
                      <a id="navLinkHome" class="navbar-brand" href="{{ url('admin-panel') }}">Stats</a>
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
                                      {{ __('Salir') }}
                                  </a>

                                  <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                                      @csrf
                                  </form>
                              </li>
                          </ul>
                          <!-- /.dropdown-user -->
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
                                  <a href="#home" class="link-menu">
                                    <i class="fa fa-home fa-fw" style="color: #337ab7;"></i>
                                      Inicio</a>
                                  </a>
                              </li>
                          </ul>
                      </div>
                      <!-- /.sidebar-collapse -->
                  </div>
                  <!-- /.navbar-static-side -->
              </nav>
          @show
          <div id="page-wrapper">
              @yield('content')
          </div>
      </div>
      <script src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>
      <script src="https://cdn.datatables.net/1.10.19/js/dataTables.bootstrap.min.js"></script>
      <script src="{{ asset('js/bootstrap.js') }}"></script>
      <script src="{{ asset('js/metisMenu.js') }}"></script>
      <script src="{{ asset('js/main.js') }}"></script>
      <script src="{{ asset('js/pluggins/jquery.number.js') }}"></script>
      <script src="https://www.gstatic.com/charts/loader.js"></script>
      <script src="http://d3js.org/d3.v3.min.js"></script>
      <script src="{{ asset('js/pluggins/jQCloud/jqcloud.js') }}"></script>
      <script>
          var CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content');
          /*$(window).on('load', function () {
              fadeOutLoader();
          });*/
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

              $("#current-date").text(formatDate());
          });

          function formatDate() {
              var date = new Date();
              var monthNames = [
                  "Enero", "Febrero", "Marzo",
                  "Abril", "Mayo", "Junio", "Julio",
                  "Agosto", "Septimbre", "Octubre",
                  "Noviembre", "Diciembre"
              ];

              var day = date.getDate();
              var monthIndex = date.getMonth();
              var year = date.getFullYear();

              return day + ' de ' + monthNames[monthIndex] + ' de ' + year;
          }

          function colorHexa() {
              hexadecimal = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F")
              color_aleatorio = "#";
              for (i = 0; i < 6; i++) {
                  posarray = aleatorio(0, hexadecimal.length);
                  color_aleatorio += hexadecimal[posarray];
              }
              return color_aleatorio;
          }

          function aleatorio(inferior, superior) {
              numPosibilidades = superior - inferior;
              aleat = Math.random() * numPosibilidades;
              aleat = Math.floor(aleat);
              return parseInt(inferior) + aleat;
          }
      </script>

      @yield('javascript')

  </body>
</html>
