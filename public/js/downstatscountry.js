var descargas = 0;
$(document).ready(function() {
  $("#sidebar").hide();

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
  google.charts.setOnLoadCallback(drawChartCountryDownloads);
}

function drawChartCountryDownloads() {
  var title;
  //console.log();
  var _countriesObj = countriesObj.sort(dynamicSort("downloads"));

  var d = [
    ['País', 'Descargas', { role: 'style' }],
  ];

  $.each(_countriesObj, function(index, v) {
    color = colorHexa();
    var descargas = v.downloads;
    var pais = v.name;
    if(descargas > 0){
        var bar = [pais, descargas, 'color: '+color];
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

  title = 'Descargas:' + $.number(descargas);

  var options = {
    title: title,
    width :5000,
    height:300,
    bar: {groupWidth: "95%"},
    legend: { position: "none" },
  };

  var chart = new google.visualization.ColumnChart(document.getElementById("chartCountryDownloads"));

  google.visualization.events.addListener(chart, 'ready', function () {
    chartCountryDownloadsImage = chart.getImageURI();
  });

  chart.draw(view, options);
}

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
