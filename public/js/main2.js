var descargas = 0;//Descargas totales

$(document).ready(function(){
  getList();
});

function getList(){
  var data = {'_token': CSRF_TOKEN}
  $.ajax({
    type: "POST",
    url: "listcsvfiles",
    data: data,
    dataType: "JSON",
    success: function(response){
      var count = 0;
      $.each(response.fileList, function(index, v){
        count++;
        var li = '<li class="list-group-item csv-file-item" data-name="'+v+'">';
            li+=  '<i class="fa fa-file"></i> '+v;
            li+= '</li>';
        $("#csvList").append(li);
      });

      if(count > 0){
        $("#csvListContent").css('display', 'block');
        $("#noFiles").css('display', 'none');
      } else {
        $("#noFiles").css('display', 'none');
      }
    }
  });
}

$(document).on('click', '.csv-file-item', function() {
  var fileName = $(this).data('name');

  //aquì deberá enlazar a una nueva vista para mostrar únicamente los datos de
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

function drawChartTotalDownloads() {
    var data = google.visualization.arrayToDataTable([
      ["option", "total", { role: "style" } ],
      ["Descargas", descargas, "#b87333"],

    ]);

    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
                     { calc: "stringify",
                       sourceColumn: 1,
                       type: "string",
                       role: "annotation" },
                     2]);

    var options = {
      title: "Total de descargas",
      width: 600,
      height: 400,
      bar: {groupWidth: "95%"},
      legend: { position: "none" },
    };
    var chart = new google.visualization.ColumnChart(document.getElementById("drawChartTotalDownloads"));
    chart.draw(view, options);
}

function drawChartTotalDownloadsMonth() {
  var d = [
    ['Mes', 'Descargas', { role: 'style' }],
  ]

  $.each(meses, function(index, v){
  	var bar = [mesesTxt[index], v, 'color: #e5e4e2' ];
  	d.push(bar);
  });

  var data = google.visualization.arrayToDataTable(d);

  var view = new google.visualization.DataView(data);
  view.setColumns([0, 1, { calc: "stringify",
                           sourceColumn: 1,
                           type: "string",
                           role: "annotation" },
                           2]);

  var options = {
    title: "Total de descargas mensuales",
    bar: {groupWidth: "95%"},
    legend: { position: "none" },
  };
  var chart = new google.visualization.ColumnChart(document.getElementById("drawChartTotalDownloadsMonth"));
  chart.draw(view, options);
}

function drawChartCountryDownloads() {
  var d = [
    ['País', 'Descargas', { role: 'style' }],
  ]

  $.each(codigoPais, function(index, v){
    if(v > 0){
      var bar = [codigoPaisTxt[index], v, 'color: #e5e4e2' ];
    	d.push(bar);
    }
  });

  var data = google.visualization.arrayToDataTable(d);

  var view = new google.visualization.DataView(data);
  view.setColumns([0, 1, { calc: "stringify",
                           sourceColumn: 1,
                           type: "string",
                           role: "annotation" },
                           2]);

  var options = {
    title: "Total de descargas por país",
    bar: {groupWidth: "95%"},
    legend: { position: "none" },
  };
  var chart = new google.visualization.ColumnChart(document.getElementById("drawChartCountryDownloads"));
  chart.draw(view, options);
}
