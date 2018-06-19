var descargas = 0;//Descargas totales
var color;

var chartTotalDownloadsImage, chartTotalDownloadsMonthImage, chartCountryDownloadsImage;

$(document).ready(function() {
  if(fileName != 'noData'){
    $("#chartsContent").css('display', 'block');
    $("#noDataText").css('display', 'none');
    obtenerdatos();
  } else {
    $("#noDataText")
    .removeClass('alert-info')
    .addClass('alert-danger')
    .html('<strong>Error al recibir los datos. Inténtelo de nuevo, por favor.</strong>')
  }
});

function obtenerdatos(){
  //var data = {'_token': CSRF_TOKEN, 'filename': fileName};
  $.ajax({
      type: "GET",
      url: "/workspace/stats/public/csvfiles/" + fileName,
      dataType: "text",
      success: function(response) {
        procesarDatos(response);
      }
   });
  //console.log(data);
  /*$.ajax({
    type: "POST",
    url: "readcsv",
    data: data,
    dataType: "JSON",
    success: function(response) {
      console.log(response);
    }
  });*/
}

function procesarDatos(data) {
  var cabeceras = [];
  var datos = [];

  var allRows = data.split(/\r?\n|\r/);
  for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
    var rowCells = allRows[singleRow].split(',');

    if (singleRow === 0) {

    } else {
      	datos.push(rowCells);
    }

	  for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
      if (singleRow === 0) {
        cabeceras.push(rowCells[rowCell]);
      }
    }
  }

  datos.pop()
  $.each(datos, function(index, v){
    var pais = v[4];
  	var mes = parseInt(v[5].substr(5));
  	var descargasMensuales = parseInt(v[6]);

    //descargas por país
    codigoPais[pais] = codigoPais[pais] + descargasMensuales;
    //descargas mensuales
  	meses[mes] = meses[mes] + descargasMensuales;

  	$.each(v, function(indexx, vv){
  		if(indexx == 6){
        //descargas totales
  			descargas = descargas + parseInt(vv);
  		}
  	});
  });

  google.charts.load("current", {packages:['corechart']});
  google.charts.setOnLoadCallback(drawChartTotalDownloads);
  google.charts.setOnLoadCallback(drawChartTotalDownloadsMonth);
  google.charts.setOnLoadCallback(drawChartCountryDownloads);
}

/*function loadCallbackCharts(print, grafica, tipoExport){
  google.charts.load("current", {packages:['corechart']});

  var totalDownloads = function() { drawChartTotalDownloads(print, tipoExport); }
  var downloadsMonth = function() { drawChartTotalDownloadsMonth(print, tipoExport); }
  var countryDownloads = function() { drawChartCountryDownloads(print, tipoExport); }

  if(print){
    switch (grafica) {
      case 'total':
        google.charts.setOnLoadCallback(totalDownloads);
        break;
      case 'month':
        google.charts.setOnLoadCallback(downloadsMonth);
        break;
      case 'country':
        google.charts.setOnLoadCallback(countryDownloads);
        break;
      default:
        alert("¡Error al seleccionar la gráfica a exportar!")
    }
  } else {
    google.charts.setOnLoadCallback(totalDownloads);
    google.charts.setOnLoadCallback(downloadsMonth);
    google.charts.setOnLoadCallback(countryDownloads);
  }

}*/

function drawChartTotalDownloads() {
    var data = google.visualization.arrayToDataTable([
      ["option", "total", { role: "style" } ],
      ["Descargas", descargas, colorHexa()],
    ]);

    var view = new google.visualization.DataView(data);
    view.setColumns([
      0,
      1,
      {
         calc: "stringify",
         sourceColumn: 1,
         type: "string",
         role: "annotation"
       },
       2
     ]);

    var options = {
      title: "Total de descargas: " + descargas,
      bar: {groupWidth: "95%"},
      legend: { position: "none" },
    };

    var chart = new google.visualization.ColumnChart(document.getElementById("chartTotalDownloads"));
    chart.draw(view, options);

    var chart_div = document.getElementById('chartTotalDownloadsImage');
    var chartImage = new google.visualization.ColumnChart(chart_div);

    // Wait for the chart to finish drawing before calling the getImageURI() method.
    google.visualization.events.addListener(chartImage, 'ready', function () {
      //chart_div.innerHTML = '<img src="' + chartImage.getImageURI() + '">';
      //console.log(chart_div.innerHTML);
      chartTotalDownloadsImage = chartImage.getImageURI();
    });

    chartImage.draw(view, options);
}

function drawChartTotalDownloadsMonth() {
  var d = [
    ['Mes', 'Descargas', { role: 'style' }],
  ]

  $.each(meses, function(index, v){
    color = colorHexa();
  	var bar = [mesesTxt[index], v, 'color: '+color ];
  	d.push(bar);
  });

  var data = google.visualization.arrayToDataTable(d);

  var view = new google.visualization.DataView(data);
  view.setColumns([
    0,
    1,
    {
       calc: "stringify",
       sourceColumn: 1,
       type: "string",
       role: "annotation"
    },
    2
  ]);

  var options = {
    title: "Total de descargas mensuales: " + descargas,
    bar: {groupWidth: "95%"},
    legend: { position: "none" },
  };


  var chart = new google.visualization.ColumnChart(document.getElementById("chartTotalDownloadsMonth"));
  chart.draw(view, options);

  var chart_div = document.getElementById('chartTotalDownloadsMonthImage');
  var chartImage = new google.visualization.ColumnChart(chart_div);

  // Wait for the chart to finish drawing before calling the getImageURI() method.
  google.visualization.events.addListener(chartImage, 'ready', function () {
    //chart_div.innerHTML = '<img src="' + chartImage.getImageURI() + '">';
    //console.log(chart_div.innerHTML);
    chartTotalDownloadsMonthImage = chartImage.getImageURI();
  });

  chartImage.draw(view, options);
}

function drawChartCountryDownloads() {
  var d = [
    ['País', 'Descargas', { role: 'style' }],
  ]

  $.each(codigoPais, function(index, v){
    color = colorHexa();
    if(v > 0){
      var bar = [codigoPaisTxt[index], v, 'color: '+color];
    	d.push(bar);
    }
  });

  var data = google.visualization.arrayToDataTable(d);

  var view = new google.visualization.DataView(data);
  view.setColumns([
    0,
    1,
    {
      calc: "stringify",
      sourceColumn: 1,
      type: "string",
      role: "annotation"
    },
    2
  ]);

  var options = {
    title: "Total de descargas por país: " + descargas,
    bar: {groupWidth: "95%"},
    legend: { position: "none" },
  };

  var chart = new google.visualization.ColumnChart(document.getElementById("chartCountryDownloads"));
  chart.draw(view, options);

  var chart_div = document.getElementById('chartCountryDownloadsImage');
  var chartImage = new google.visualization.ColumnChart(chart_div);

  // Wait for the chart to finish drawing before calling the getImageURI() method.
  google.visualization.events.addListener(chartImage, 'ready', function () {
    //chart_div.innerHTML = '<img src="' + chartImage.getImageURI() + '">';
    //console.log(chart_div.innerHTML);
    chartCountryDownloadsImage = chartImage.getImageURI();
  });

  chartImage.draw(view, options);
}

$(".export-action").click(function() {
  var grafica = $(this).data("charttype");
  var tipoExport = $(this).data("typeexport");
  var image, pass;

  switch (grafica) {
    case 'total':
      image = chartTotalDownloadsImage;
      pass = true;
      break;
    case 'month':
      image = chartTotalDownloadsMonthImage;
      pass = true;
      break;
    case 'country':
      image = chartCountryDownloadsImage;
      pass = true;
      break;
    default:
      pass = false;
      alert("¡Error al seleccionar la gráfica a exportar!")
  }

  var data = {'_token': CSRF_TOKEN, 'image': image, 'tipoExport': tipoExport};

  if(pass){
    $.ajax({
      type: "POST",
      url : "createchartimage",
      data: data,
      dataType: "JSON",
      success: function(response) {
        console.log(response);
      }
    });
  }


  /*console.log(chartTotalDownloadsImage);
  console.log(chartTotalDownloadsMonthImage);
  console.log(chartCountryDownloadsImage);*/
});

/*$(".print-chart").click(function() {
  var chart = $(this).data('opc');
});*/

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
