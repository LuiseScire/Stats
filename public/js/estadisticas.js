var descargas = 0;//Descargas totales
var color;

var totalDownloadsImageChart,
    totalDownloadsMonthImageChart,
    countryDownloadsImageChart;

var gridlinesCount = 20;

$(document).ready(function() {
  if(fileName != 'noData'){
    $("#menuOptionCharts").css('display', 'block').addClass('active').find('ul').addClass('in');

    $("#chartsContent").css('display', 'block');
    $("#noDataText").css('display', 'none');
    //$("#navLinkFileName").show();
    //$("#fileNameNavbar").text(fileName);
    //$("#a").text(fileName);

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
      url: getCsvFile,
      //url: "/workspace/stats/public/csvfiles/" + fileName,
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

    /*################## DESCARGAS MENSUALES ####################*/
    if(mes == 1){
      mes = mes - 1;
    } else {
      mes = mes - 1;
    }

    monthsObj[mes].downloads = monthsObj[mes].downloads + descargasMensuales;

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
  google.charts.load("current", {packages:['corechart']});
  google.charts.setOnLoadCallback(drawTotalDownloadsChart);
  google.charts.setOnLoadCallback(drawTotalDownloadsMonthChart);
  google.charts.setOnLoadCallback(drawCountryDownloadsChart);


  setTimeout(function (){
    if(target != "noTarget") {
      $('a[href$="'+target+'"]').click();
    }
  }, 1000);
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

function drawTotalDownloadsChart() {
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
      title: "Descargas: " + $.number(descargas),
      bar: {groupWidth: "30%"},
      legend: { position: "none" },
      height: "500",
      vAxis: {
        gridlines: {count: 30},
        format: 'short',
        viewWindow: {
                max:descargas,
              }
      },

    };

    var chart = new google.visualization.ColumnChart(document.getElementById("totalDownloadsChart"));
    //chart.draw(view, options);

    /*var chart_div = document.getElementById('chartTotalDownloadsImage');
    var chartImage = new google.visualization.ColumnChart(chart_div);*/

    // Wait for the chart to finish drawing before calling the getImageURI() method.
    google.visualization.events.addListener(chart, 'ready', function () {
      //chart_div.innerHTML = '<img src="' + chartImage.getImageURI() + '">';
      //console.log(chart_div.innerHTML);
      totalDownloadsImageChart = chart.getImageURI();
    });
    chart.draw(view, options);
    //chartImage.draw(view, options);
}

function drawTotalDownloadsMonthChart() {
  var d = [
    ['Mes', 'Descargas', { role: 'style' }],
  ];

  $.each(monthsObj, function(index, v) {
    color = colorHexa();
  	var bar = [v.name, v.downloads, 'color: '+color ];
  	d.push(bar);
  })

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
    title: "Descargas: " + $.number(descargas),
    bar: {groupWidth: "70%"},
    legend: { position: "none" },
    height: "500",
    vAxis: {
      gridlines: {count: gridlinesCount},
      format: 'short',
    }
  };

  var chart = new google.visualization.ColumnChart(document.getElementById("totalDownloadsMonthChart"));

  google.visualization.events.addListener(chart, 'ready', function () {
    totalDownloadsMonthImageChart = chart.getImageURI();
  });

  chart.draw(view, options);
}

function drawCountryDownloadsChart() {
  var title;
  //console.log();
  var _countriesObj = countriesObj.sort(dynamicSort("downloads"));

  var d = [
    ['País', 'Descargas', { role: 'style' }],
  ];

  var previewLimit = 16;
  var countPreview = 0;
  $.each(_countriesObj, function(index, v) {
    color = colorHexa();
    var descargas = v.downloads;
    var pais = v.name;
    if(descargas > 0){
      countPreview++;
      if(countPreview < previewLimit) {
        var bar = [pais, descargas, 'color: '+color];
        d.push(bar);
      }
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

  title = 'Países con mayores descargas. Descargas:' + $.number(descargas);

  var options = {
    title: title,
    bar: {groupWidth: "70%"},
    legend: { position: "none" },
    height: "500",
    vAxis: {
      gridlines: {count: gridlinesCount},
      format: 'short',
    }
  };

  var chart = new google.visualization.ColumnChart(document.getElementById("countryDownloadsChart"));

  google.visualization.events.addListener(chart, 'ready', function () {
    countryDownloadsImageChart = chart.getImageURI();
  });

  chart.draw(view, options);
}

function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ['Task', 'Hours per Day'],
    ['Work',     11],
    ['Eat',      2],
    ['Commute',  2],
    ['Watch TV', 2],
    ['Sleep',    7]
  ]);

  var options = {
    title: 'My Daily Activities',
    is3D: true,
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart'));

  chart.draw(data, options);
}

$(".angle-panel-collapse").click(function(event) {
  var parents = $(this).parentsUntil('.col-lg-12');
  var parentElement = parents[parents.length - 1];
  var panelBody = $(parentElement).find('div.panel-body');

  var angleUP = '<i class="fa fa-angle-up fa-lg">';
  var angleDown = '<i class="fa fa-angle-down fa-lg">';

  if(panelBody.hasClass('collapse-up')) {
    $(parentElement).find('div.panel-body').slideUp("slow").removeClass('collapse-up').addClass('collapse-down');
    $(this).attr('title', 'Mostrar').html(angleDown);
  } else if (panelBody.hasClass('collapse-down')) {
    $(parentElement).find('div.panel-body').slideDown("slow").removeClass('collapse-down').addClass('collapse-up');
    $(this).attr('title', 'Ocultar').html(angleUP);
    $("html, body").animate({scrollTop: $(parentElement).offset().top}, 500);
    return false;
  }
});

$(".export-action").click(function() {
  var grafica = $(this).data("charttype");
  var tipoExport = $(this).data("typeexport");
  var imagen, nombre;
  var continuar = false;

  switch (grafica) {
    case 'total':
      imagen = totalDownloadsImageChart;
      nombre = 'descargas-totales.png';
      continuar = true;
      break;
    case 'month':
      imagen = totalDownloadsMonthImageChart;
      nombre = 'descargas-mensuales.png';
      continuar = true;
      break;
    case 'country':
      imagen = countryDownloadsImageChart;
      nombre = 'descargas-por-pais.png';
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

      /*$.ajax({
        type: "POST",
        url : "createchartimage",
        data: data,
        dataType: "JSON",
        success: function(response) {
          console.log(response);
          var path = "/workspace/stats/public/chartimages/";
          if(response.status == 'success'){
            $("#downloadChartImageModal").modal('show');
            $("#imgModalChartImage").attr("src", path + response.fileName);
          } else {
            alert("Error al Guardar Imagen");
          }

        }
      });*/
    }

  }
  /*console.log(chartTotalDownloadsImage);
  console.log(chartTotalDownloadsMonthImage);
  console.log(chartCountryDownloadsImage);*/
});

$("#breakdownButton").click(function (){
  var target = $("#countryDesglosDownloadsPanel");
  if(target.hasClass('hide')){
    target.css('display', 'block').removeClass('hide');
    $(".porcent:first").click();
  }
  $("html, body").animate({scrollTop: target.offset().top}, 500);
  return false;
});

$(".porcent").click(function() {
  var porcent = $(this).data('porcent');

  var downloads = parseFloat(descargas);
  var total = Math.floor(porcent * downloads) / 100;
  var totalDecimal = parseInt(total);
  var _countriesObj = countriesObj.sort(dynamicSort("downloads"));

  var d = [
    ['Task', 'Hours per Day'],
  ];
  var countDownloads = 0;
  var restante = 0;
  $.each(_countriesObj, function(index, v) {
    color = colorHexa();
    var descargas = v.downloads;
    var pais = v.name;
    if(descargas > 0){
      countDownloads = countDownloads + descargas;
      if(countDownloads < totalDecimal){
        var bar = [pais + "("+abbreviateNumber(descargas)+")", descargas];
        d.push(bar);
      }
    }
  });

  var data = google.visualization.arrayToDataTable(d);

  var options = {
    title: porcent + '% de descargas por países',
    is3D: true,
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart'));

  chart.draw(data, options);
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

function abbreviateNumber(value) {
    var newValue = value;
    if (value >= 1000) {
        var suffixes = ["", "k", "m", "b","t"];
        var suffixNum = Math.floor( (""+value).length/3 );
        var shortValue = '';
        for (var precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 != 0)  shortNum = shortValue.toFixed(1);
        newValue = shortValue+suffixes[suffixNum];
    }
    return newValue;
}
