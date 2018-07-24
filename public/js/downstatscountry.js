var descargas = 0;
var countryDownloadsTable;
var chartWithout;

var globalTypeReport;
var countriesWithDownloadsImageChart,
    countriesWithoutDownloadsImageChart;

$(window).on('load', function(){
    fadeOutLoader();
});

$(document).ready(function() {
  /*$("#sidebar").hide();
  $("#navLinkHome").hide();
  $("#navLinkBack").show();*/
  /*$(".opc-nav-downstatscountry-view").show();
  $("#fileNameNavbar").text(fileName);*/
  /*$("#a").text(fileName);*/

  $.ajax({
      type: "GET",
      url: getCsvFile,
      dataType: "text",
      success: function(response) {
        procesarDatos(response);
      }
   });

   $("#backToStats").attr('href', backLocation);
   createOptionsMenu();
});

function createOptionsMenu() {
  /*var ulContent = '<li>'+
                    '<a href="'+backLocation+'/totalDownloadsPanel" class="link-menu"><i class="fa fa-bar-chart"></i> Descargas Totales</a>'+
                  '</li>'+
                  '<li>'+
                    '<a href="'+backLocation+'/totalDownloadsMonthPanel" class="link-menu"><i class="fa fa-bar-chart"></i> Descargas Mensuales</a>'+
                  '</li>'+
                  '<li>'+
                    '<a href="'+backLocation+'/countryDownloadsPanel" class="link-menu"><i class="fa fa-bar-chart"></i> Descargas por País</a>'+
                  '</li>';

  $("#menuOptionChartsContent").append(ulContent);
  $("#menuOptionChartsFromCountriesView").css('display', 'block').addClass('active').find('ul').addClass('in');*/
    var data = {'_token': CSRF_TOKEN, 'filename': fileName};
    $.ajax({
        type: "POST",
        url: "getdatacsv2",
        data: data,
        dataType: "JSON",
        success: function(response) {
            var csvIndices = response.csvFileData.csv_indices;
            indexArray = JSON.parse("[" + csvIndices + "]");

            var typeReportIndex = response.csvFileData.csv_type_report_index;
            var typeReport = response.csvFileData.csv_type_report;
            $("#titlePage").text(typeReport);

            switch (typeReportIndex){
                case 0:
                case 2:
                    globalTypeReport = "Descargas";
                    break;
                case 1:
                case 3:
                case 4:
                    globalTypeReport = "Visitas";
                    break;
            }
            $(".tabTypeReport").text(globalTypeReport);
            //console.log(indexArray);
            var item;
            indexArray.forEach(function(objects) {
                objects.forEach(function(v) {
                    switch(v.v){
                        case 'Tipo':
                            $("#chartPanelTipo").show();
                            $("#panelTitleTipo").text(v.v);
                            item ='<li>';
                            item+= '<a href="'+backLocation+'/chartPanelTipo" class="link-menu"><i class="fa fa-bar-chart"></i> '+v.v;
                            item+='</li>';
                            break;
                        case 'Texto':
                            $("#chartPanelText").show();
                            $("#panelTitleText").text(v.v);
                            item ='<li>';
                            item+= '<a href="'+backLocation+'/chartPanelText" class="link-menu"><i class="fa fa-bar-chart"></i> '+v.v;
                            item+='</li>';
                            break;
                        case 'Revista':
                            $("#chartPanelJournal").show();
                            $("#panelTitleJournal").text(v.v);
                            item ='<li>';
                            item+= '<a href="'+backLocation+'/chartPanelJournal" class="link-menu"><i class="fa fa-bar-chart"></i> '+v.v;
                            item+='</li>';
                            break;
                        case 'Número':
                            $("#chartPanelNumber").show();
                            $("#panelTitleNumber").text(v.v);
                            item ='<li>';
                            item+= '<a href="'+backLocation+'/chartPanelNumber" class="link-menu"><i class="fa fa-hash"></i> '+v.v;
                            item+='</li>';
                            break;
                        case 'Ciudad':
                            $("#chartPanelCity").show();
                            $("#panelTitleCity").text(v.v);
                            item ='<li>';
                            item+= '<a href="'+backLocation+'/chartPanelCity" class="link-menu"><i class="fa fa-bar-chart"></i> '+v.v;
                            item+='</li>';
                            break;
                        case 'País':
                            $("#chartPanelCountries").show();
                            $("#panelTitleCountries").text(v.v);
                            item ='<li>';
                            item+= '<a href="'+backLocation+'/chartPanelCountries" class="link-menu"><i class="fa fa-globe"></i> '+v.v;
                            item+='</li>';
                            break;
                        case 'Mes':
                            $("#chartPanelMonths").show();
                            $("#panelTitleMonths").text(v.v);
                            item ='<li>';
                            item+= '<a href="'+backLocation+'/chartPanelMonths" class="link-menu"><i class="fa fa-calendar"></i> '+v.v;
                            item+='</li>';
                            break;
                        case 'Total':
                            $("#chartPanelTotal").show();
                            $("#panelTitleTotal").text(v.v);
                            item ='<li>';
                            item+= '<a href="'+backLocation+'/chartPanelTotal" class="link-menu"><i class="fa fa-circle"></i> '+v.v;
                            item+='</li>';
                            break;
                    }// end switch
                    //$("#menuOptionCharts").find("ul").append(item);
                    //$("#menuOptionChartsContent").append(item);
                    //$("#menuOptionChartsFromCountriesView").css('display', 'block').addClass('active').find('ul').addClass('in');
                });
            });
            //$("#menuOptionCharts").css('display', 'block').addClass('active').find('ul').addClass('in');

        }
    });
}

function procesarDatos(data) {
  var cabeceras = [];//for charts
  var datos = [];//for charts

  var allRows = data.split(/\r?\n|\r/);
  for (var singleRow = 0; singleRow < allRows.length; singleRow++) {

    if(singleRow < 5 ) {
			//se evitan las primeras 5 filas del documento.
		} else {
      var rowCells = allRows[singleRow].split(',');

      if (singleRow === 5) {

      } else {
          rowCells.reverse();
          datos.push(rowCells);
      }

  	  for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
        if (singleRow === 0) {
          cabeceras.push(rowCells[rowCell]);
        }
      }
    }
  }

  datos.pop();
  var contador = 0;//var para pruebas
  $.each(datos, function(index, v){
    var descargasMensuales = parseInt(v[0]);
    var mes = parseInt(v[1].substr(5));
    var pais = v[2];
    var ciudad = v[3];
    var numero = v[4];
    //faltan obtner el tipo y texto

    contador++;
    /*################## DESCARGAS TOTALES ####################*/
    $.each(v, function(indexx, vv){
  		if(indexx == 0){
  			descargas = descargas + parseInt(vv);
  		}
  	});

    /*################## DESCARGAS POR PAÍS ####################*/
    $.each(countriesObj, function(index, v) {
      if(pais == ''){
        if(v.code == 'UNK'){
          v.downloads = v.downloads + descargasMensuales;
        }
      } else {
        if(pais == v.code) {
          v.downloads = v.downloads + descargasMensuales;
        }
      }
    });
  });
  loadDataForChartAndTable();
}

function loadDataForChartAndTable() {
  var dataSet = [],
      dataSetWithout = [];

  var totalCountriesWith = 0,
      totalCountriesWithout = 0;

  $.each(countriesObj, function(index, v) {
    var descargas = v.downloads;
    if(descargas > 0){
      var data = [v.continent, v.code, v.name, $.number(descargas)];
      dataSet.push(data);
      totalCountriesWith++;
    } else {
      var data = [v.continent, v.code, v.name, $.number(descargas)];
      dataSetWithout.push(data);
      totalCountriesWithout++;
    }
  });
  $("#badgeWith").text(totalCountriesWith);
  $("#badgeWithout").text(totalCountriesWithout);
  loadCountryDownloadsTable(dataSet, dataSetWithout);
}

function loadCountryDownloadsTable(dataSet, dataSetWithout) {
  //countryDownloadsTable.destroy();

  countryDownloadsTable = $("#countryDownloadsTable").DataTable({
    data : dataSet,
    columns: [
      { title: 'Continente' },
      { title: 'Código País' },
      { title: 'País' },
      { title: globalTypeReport },
    ],
    "order": [[ 3, "desc" ]],
    "language": {
            "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        }
  });

  countryDownloadsTable = $("#countryWithoutDownloadsTable").DataTable({
    data : dataSetWithout,
    columns: [
      { title: 'Continente' },
      { title: 'Código País' },
      { title: 'País' },
      { title: 'Descargas' },
    ],
    "order": [[ 0, "asc" ]],
    "language": {
            "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        }
  });

  google.charts.load('current', {packages: ['corechart', 'bar']});
  google.charts.setOnLoadCallback(drawCountryDownloadsChart);
}

function drawCountryDownloadsChart() {
  var _countriesObj = countriesObj.sort(dynamicSort("downloads"));

  var d = [
    ["País", "Descargas", { role: "style"}],
  ];

  var withoutD = [
    ["País", "Descargas", { role: "style"}],
  ];

  $.each(_countriesObj, function(index, v) {
    color = colorHexa();
    var pais = v.name;
    var descargas = v.downloads;

    if(descargas > 0){
      var bar = [pais, parseInt(descargas), color];
      d.push(bar);
    } else {
      var bar = [pais, parseInt(descargas), color];
      withoutD.push(bar);
    }
  });

  /**************************************************/
  var data = google.visualization.arrayToDataTable(d);

  var view = new google.visualization.DataView(data);
  view.setColumns([0, 1,
                   { calc: "stringify",
                     sourceColumn: 1,
                     type: "string",
                     role: "annotation" },
                   2]);

  var options = {
    title: "Descargas por país. Total " + $.number(descargas),
    bar: {groupWidth: "60%"},
    legend: { position: "none" },
    fontSize: 14,
    hAxis: {
      title: 'Total de descargas: ' + $.number(descargas),
      minValue: 0,
      format: 'short'
    },
    vAxis: {
      title: 'País',

    },
    chartArea: {width: '90%', height: '95%', left: 200},
  };

  var chart = new google.visualization.BarChart(document.getElementById("countryDownloadsChart"));
  google.visualization.events.addListener(chart, 'ready', function () {
    countriesWithDownloadsImageChart = chart.getImageURI();
  });
  chart.draw(view, options);

  /*************************************************/
  var dataWithout = google.visualization.arrayToDataTable(withoutD);

  var viewWithout = new google.visualization.DataView(dataWithout);

  viewWithout.setColumns([0, 1,
                   { calc: "stringify",
                     sourceColumn: 1,
                     type: "string",
                     role: "annotation" },
                   2]);
  var optionsWithout = {
     title: globalTypeReport + "por país. Total: 0",
     bar: {groupWidth: "60%"},
     legend: { position: "none" },
     fontSize: 14,
     hAxis: {
       title: 'Total de '+globalTypeReport+': 0',
       minValue: 0
     },
     vAxis: {
       title: 'País'
     },
     chartArea: {width: '90%', height: '95%', left: 200},
  };

  chartWithout = new google.visualization.BarChart(document.getElementById("countryWithoutDownloadsChart"));
  google.visualization.events.addListener(chartWithout, 'ready', function () {
    countriesWithoutDownloadsImageChart = chartWithout.getImageURI();
  });
  chartWithout.draw(viewWithout, optionsWithout);

  $("#paisesSinDescargas").removeClass("active");
}

$(".export-action").click(function() {
  var grafica = $(this).data("charttype");
  var tipoExport = $(this).data("typeexport");
  var imagen, nombre;
  var continuar = false;

  switch (grafica) {
    case 'with':
      imagen = countriesWithDownloadsImageChart;
      nombre = globalTypeReport + '-por-paises.png';
      continuar = true;
      break;
    case 'without':
      imagen = countriesWithoutDownloadsImageChart;
      nombre = 'paises-sin-'+globalTypeReport+'.png';
      continuar = true;
      break;
    default:
      alert("¡Error al seleccionar la gráfica a exportar!");
  }

  if(continuar){
    if(tipoExport == 'png'){
      download(imagen, nombre, "image/png");
    } else if (tipoExport == 'pdf') {
      var data = {'_token': CSRF_TOKEN, 'image': imagen, 'tipoExport': tipoExport};

    }
  }
});




/*######### FUNCIONES EXTRA ###########*/
function colorHexa(){
   hexadecimal = new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F")
   color_aleatorio = "#";
   for (i=0;i<6;i++){
      posarray = aleatorio(0,hexadecimal.length);
      color_aleatorio += hexadecimal[posarray];
   }
   return color_aleatorio;
}

function aleatorio(inferior,superior){
   numPosibilidades = superior - inferior;
   aleat = Math.random() * numPosibilidades;
   aleat = Math.floor(aleat);
   return parseInt(inferior) + aleat;
}

function dynamicSort(property) {
  var sortOrder = 1;
  if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
  }
  return function (a,b) {
      var result = (a[property] > b[property]) ? -1 : (a[property] < b[property]) ? 1 : 0;
      return result * sortOrder;
  }
}
