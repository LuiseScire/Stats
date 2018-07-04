<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <!-- provide the csrf token -->
        <meta name="csrf-token" content="{{ csrf_token() }}" />

        <title>Stats - @yield('title')</title>

        <!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">-->

        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
        <link rel="stylesheet" href="https://cdn.datatables.net/1.10.19/css/dataTables.bootstrap.min.css">
        <link rel="stylesheet" href="{{ asset('css/bootstrap.css') }}">
        <link rel="stylesheet" href="{{ asset('css/metisMenu.css') }}">
        <link rel="stylesheet" href="{{ asset('css/main.css') }}">
        <link rel="stylesheet" href="{{ asset('css/custom.css') }}">
        @yield('css')
        <style>

        </style>
    </head>
    <body>
      <div id="preloader">
        <div id="loaderContent">
          Cargando...
        </div>
      </div>

      <a class="ir-arriba primary"  href="#" title="Volver arriba">
        <span class="fa-stack">
            <i class="fa fa-circle fa-stack-2x"></i>
            <i class="fa fa-arrow-up fa-stack-1x fa-inverse"></i>
        </span>
      </a>

      <div id="wrapper">
        @section('sidebar')
        <nav id="navBar" class="navbar navbar-default navbar-custom navbar-fixed-top" role="navigation" style="margin-bottom: 0">
          <div class="navbar-header">
              <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                  <span class="sr-only">Toggle navigation</span>
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>
              </button>
              <a id="navLinkHome" class="navbar-brand" href="{{ url('home') }}">Stats</a>
              <!-- show in downstatscountry view -->
              <a id="navLinkBack" class="navbar-brand opc-nav-downstatscountry-view" href="javascript:void(0)" style="display:none">
                <i class="fa fa-arrow-left"></i> Volver
              </a>
              <a id="navLinkFileName" class="navbar-brand opc-nav-downstatscountry-view" href="javascript:void(0)" style="display:none">
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

          <div id="sidebar" class="navbar-default sidebar" role="navigation">
              <div class="sidebar-nav navbar-collapse">
                  <ul class="nav" id="side-menu">
                      <li>
                          <a href="{{ url('home') }}"><i class="fa fa-home fa-fw"></i> Home</a>
                      </li>
                      <li>
                          <a href="{{ url('subircsv') }}"><i class="fa fa-upload fa-fw"></i> Subir CSV</a>
                      </li>
                      <li id="menuOptionCharts" style="display: none">
                        <a href="#"><i class="fa fa-bar-chart"></i> Estadísticas<span class="fa arrow"></span></a>
                        <ul class="nav nav-second-level">
                          <li>
                            <a href="#totalDownloadsPanel" class="link-menu"><i class="fa fa-bar-chart"></i> Descargas Totales</a>
                          </li>
                          <li>
                            <a href="#totalDownloadsMonthPanel" class="link-menu"><i class="fa fa-bar-chart"></i> Descargas Mensuales</a>
                          </li>
                          <li>
                            <a href="#countryDownloadsPanel" class="link-menu"><i class="fa fa-bar-chart"></i> Descargas por País</a>
                          </li>
                          <!-- Si se agrega otra opción también agregar en el menú de downstatscountry.js para la vista de los países-->
                        </ul>
                      </li>
                      <li id="menuOptionChartsFromCountriesView" style="display: none">
                        <a href="#"><i class="fa fa-bar-chart"></i> Estadísticas<span class="fa arrow"></span></a>
                        <ul id="menuOptionChartsContent" class="nav nav-second-level"></ul>
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

      <script src="https://code.jquery.com/jquery-3.3.1.js"></script>
      <!--<script src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js" charset="utf-8"></script>
      -->
      <script src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>
      <script src="https://cdn.datatables.net/1.10.19/js/dataTables.bootstrap.min.js"></script>
      <script src="{{ asset('js/bootstrap.js') }}"></script>
      <script src="{{ asset('js/metisMenu.js') }}"></script>
      <script src="{{ asset('js/main.js') }}"></script>
      <script src="{{ asset('js/pluggins/jquery.number.js') }}"></script>
      <script src="https://www.gstatic.com/charts/loader.js"></script>
      <script>
        var CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content');
        $(window).on('load', function(){
           fadeOutLoader();
        });

        function fadeInLoader(){
          $("#preloader").fadeIn("slow");
          //$("wrapper").addClass("blur");
        }

        function fadeOutLoader(){
          $("#preloader").fadeOut("slow");
          //$("#wrapper").removeClass("blur");
        }

        $(document).ready(function() {
          $('.ir-arriba').click(function(){
              $('body, html').animate({
                  scrollTop: '0px'
              }, 1000);
          });

          $(window).scroll(function(){
              if( $(this).scrollTop() > 0 ){
                  $('.ir-arriba').slideDown(600);
              } else {
                  $('.ir-arriba').slideUp(600);
              }

              if($(this).scrollTop() > 100 ){
                //$("#navBar").removeClass("navbar-static-top").addClass("navbar-fixed-top");
              }
          });
          /*hacia abajo*/
          /*$('.ir-abajo').click(function(){
              $('body, html').animate({
                    scrollTop: '1000px'
                }, 1000);
          });*/

          $('a.link-menu[href^="#"]').click(function() {
            var target = $(this.hash);

            $('html, body').animate({ scrollTop: target.offset().top }, 500);
            return false;
          });

          $("#current-date").text(formatDate());
        });

        function formatDate() {
          var date = new Date();
          var monthNames = [
            "Enero", "Febrero", "Marzo",
            "Abril", "Mayo", "Junio", "Julio",
            "Augosto", "Septimbre", "Octubre",
            "Noviembre", "Diciembre"
          ];

          var day = date.getDate();
          var monthIndex = date.getMonth();
          var year = date.getFullYear();

          return day + ' de ' + monthNames[monthIndex] + ' de ' + year;
        }
      </script>

      @yield('javascript')
    </body>
</html>
