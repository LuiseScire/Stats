var descargas = 0;
var countryDownloadsTable;
var chartWithout;

var countriesWithDownloadsImageChart,
    countriesWithoutDownloadsImageChart;

$(document).ready(function() {
  $("#sidebar").hide();
  $("#navLinkHome").hide();
  $(".opc-nav-downstatscountry-view").show();
  $("#fileNameNavbar").text(fileName);

  $.ajax({
      type: "GET",
      url: "/workspace/stats/public/csvfiles/" + fileName,
      dataType: "text",
      success: function(response) {
        procesarDatos(response);
      }
   });
});

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
      { title: 'Descargas' },
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
      minValue: 0
    },
    vAxis: {
      title: 'País'
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
     title: "Descargas por país. Total: 0",
     bar: {groupWidth: "60%"},
     legend: { position: "none" },
     fontSize: 14,
     hAxis: {
       title: 'Total de descargas: 0',
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
      nombre = 'paises-con-descargas.png';
      continuar = true;
      break;
    case 'without':
      imagen = countriesWithoutDownloadsImageChart;
      nombre = 'paises-sin-descargas.png';
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
