var descargas = 0;//Descargas totales
var color;

var globalTypeReport;

var globalTotals = 0;

var imageChartType,
    imageChartText,
    imageChartJournal,
    imageChartNumber,
    imageChartCity,
    imageChartCountry,
    imageChartMonth,
    imageChartTotal;

/*Deprecated*/
var totalDownloadsImageChart,
    totalDownloadsMonthImageChart,
    countryDownloadsImageChart;
/*-------------*/

var gridlinesCount = 20;

var headers = [];

var indexArray = [];//almacena los índices del documento seleccionados cuando se dio de alta
var dataSet = [];//alamacena todos los datos parseados del csv
var showCharts = [];
$(document).ready(function() {
  if(fileName != 'noData'){


    $("#chartsContent").css('display', 'block');
    $("#noDataText").css('display', 'none');
    //$("#navLinkFileName").show();
    //$("#fileNameNavbar").text(fileName);
    //$("#a").text(fileName);

    var data = {'_token': CSRF_TOKEN, 'filename': fileName};
    $.ajax({
      type: "POST",
      url: "getdatacsv",
      data: data,
      dataType: "JSON",
      success: function(response) {
        var csvIndices = response.csvFileData.csv_indices;
        indexArray = JSON.parse("[" + csvIndices + "]");

        var typeReportIndex = response.csvFileData.csv_type_report_index;
        var typeReport = response.csvFileData.csv_type_report;
        $("#titlePage").text(typeReport);
          /*alertContent += '<option value="0">Descargas del archivo del artículo</option>';
          alertContent += '<option value="1">Visitas a la página del resumen del artículo</option>';
          alertContent += '<option value="2">Descargas de Archivo del número</option>';
          alertContent += '<option value="3">Visitas a la página de la tabla de contenidos del número</option>';
          alertContent += '<option value="4">Visitas a la página principal de la revista</option>';
*/
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
        //console.log(indexArray);
        indexArray.forEach(function(objects) {
          objects.forEach(function(v) {
              showCharts.push(v.v);
            switch(v.v){
              case 'Tipo':
                $("#chartPanelTipo").show();
                $("#panelTitleTipo").text(v.v);
                var item ='<li>';
                    item+= '<a href="#chartPanelTipo" class="link-menu"><i class="fa fa-bar-chart"></i> '+v.v;
                    item+='</li>';
                break;
              case 'Texto':
                $("#chartPanelText").show();
                $("#panelTitleText").text(v.v);
                item ='<li>';
                item+= '<a href="#chartPanelText" class="link-menu"><i class="fa fa-bar-chart"></i> '+v.v;
                item+='</li>';
                break;
              case 'Revista':
                $("#chartPanelJournal").show();
                $("#panelTitleJournal").text(v.v);
                item ='<li>';
                item+= '<a href="#chartPanelJournal" class="link-menu"><i class="fa fa-bar-chart"></i> '+v.v;
                item+='</li>';
                break;
              case 'Número':
                $("#chartPanelNumber").show();
                $("#panelTitleNumber").text(v.v);
                item ='<li>';
                item+= '<a href="#chartPanelNumber" class="link-menu"><i class="fa fa-hashtag" style="color: darkgreen"></i> '+v.v;
                item+='</li>';
                break;
              case 'Ciudad':
                $("#chartPanelCity").show();
                $("#panelTitleCity").text(v.v);
                item ='<li>';
                item+= '<a href="#chartPanelCity" class="link-menu"><i class="fa fa-bar-chart"></i> '+v.v;
                item+='</li>';
                break;
              case 'País':
                $("#chartPanelCountries").show();
                $("#panelTitleCountries").text(v.v);
                item ='<li>';
                item+= '<a href="#chartPanelCountries" class="link-menu"><i class="fa fa-globe" style="color: dodgerblue;"></i> '+v.v;
                item+='</li>';
                break;
              case 'Mes':
                $("#chartPanelMonths").show();
                $("#panelTitleMonths").text(v.v);
                item ='<li>';
                item+= '<a href="#chartPanelMonths" class="link-menu"><i class="fa fa-calendar" style="color: darkred"></i> '+v.v;
                item+='</li>';
                break;
              case 'Total':
                $("#chartPanelTotal").show();
                $("#panelTitleTotal").text(v.v);
                item ='<li>';
                item+= '<a href="#chartPanelTotal" class="link-menu"><i class="fa fa-circle" style="color: darkgreen;"></i> '+v.v;
                item+='</li>';
                break;
            }// end switch
            $("#menuOptionCharts").find("ul").append(item);
          });
        });
        $("#menuOptionCharts").css('display', 'block').addClass('active').find('ul').addClass('in');

        generateArrays();

        //getCSV();
        /*$.get(getCsvFile, function( response ) {
          generateArrays(response);
          //processCSVData(response);
        });*/

      }
    });

  } else {
    $("#noDataText")
    .removeClass('alert-info')
    .addClass('alert-danger')
    .html('<strong>Error al recibir los datos. Inténtelo de nuevo, por favor.</strong>');
  }
});

function generateArrays() {


  var maxPreviewItems = 5;
  var countItems = 0;

  d3.text(getCsvFile, function(data) {
      var parsedCSV = d3.csv.parseRows(data);
      var h = parsedCSV[5];
      h.shift();
      headers.push(h);
      parsedCSV.splice(0,6);

      $.each(parsedCSV, function(index, v){
        var temp = v;
        temp.shift();
        dataSet.push(temp);
      });//end each(parsedCSV)

      $.each(dataSet, function(index, value) {
          /*Get ALL Totals*/
          var last = value[value.length -1];
          var totals = parseInt(last);
          globalTotals = globalTotals + totals;
      });

      //validateData();
  });//end d3.text()
}

function validateData() {
  google.charts.load("current", {packages:['corechart']});

  $.each(indexArray, function(index, values) {
    $.each(values, function(i, v) {
      switch(v.v){
        case 'Tipo':
          processDataType(v.i);
          break;
        case 'Texto':
          processDataText(v.i);
          break;
        case 'Revista':
          processDataJournal(v.i);
          break;
        case 'Número':
          processDataNumber(v.i);
          break;
        case 'Ciudad':
          processDataCities(v.i);
          break;
        case 'País':
          processDataCountries(v.i);
          break;
        case 'Mes':
          processDataMonths(v.i);
          break;
        case 'Total':
          processDataTotal(v.i);
          break;
      }
    });
  });
    fadeOutLoader();
}



//############## [Type Chart] #################
//Por falta de datos Puede que hayan posibles errores por revisar.
function processDataType(position) {
  var types = [];
  var count = 0;
  var initialValue = 1;

  $.each(dataSet, function(index, value) {
    var i = index;
    var v = String(value[position]);

    if(count > 0){
      $.each(types, function(index, value) {
        var type = value.type;
        if(new String(type).valueOf() == new String(v).valueOf()){
          value.totals = value.totals + 1;
        } else {
          var a = {"type": v, "totals": initialValue};
          types.push(a);
        }
      });
    } else {
      var a = {"type": v, "totals": initialValue};
      types.push(a);
    }
    count++;
  });
  //console.log(types);
  google.charts.setOnLoadCallback(drawChartType);
}

function drawChartType(){

}

//############## [Text Chart] #################
function processDataText(position) {
  var textArrg = [];
  var count = 0;
  $.each(dataSet, function(index, value) {
    var text = value[position];
    var total = parseInt(value[value.length -1]);
    //if(count > 30127) {
      if(textArrg.length == 0){
        var x = {"text": text, "total": total, "loops": 1};
        textArrg.push(x);
      } else {
        var match = false;
        for(i in textArrg) {
          var loops = 0;
          var _text = textArrg[i].text;

          if(_text == text) {
            match = true;
            loops++;

            textArrg[i].total = textArrg[i].total + total;
            textArrg[i].loops = textArrg[i].loops + loops;
          }
        }//end for

        if(!match) {
          var x = {"text": text, "total": total, "loops": 1};
          textArrg.push(x);
        }
      }// end if textArrg.length

    //}//end if test
    count++;
  });
  //console.log(textArrg);
  //google.charts.setOnLoadCallback(drawChartText);

  var chart = function() { drawChartText(textArrg) };
  google.charts.setOnLoadCallback(chart);
}

function drawChartText(textArrg) {
  var title;
  //console.log();
  var _textArrg = textArrg.sort(dynamicSort("total"));

  var d = [
    ['Texto/Revistas', 'Totales', { role: 'style' }],
  ];

  var previewLimit = 16;
  var countPreview = 0;
  $.each(_textArrg, function(index, v) {
    //console.log(v);
    color = colorHexa();
    var totals = v.total;
    var text = v.text;
    if(totals > 0){
      //console.log(v);
      countPreview++;
      if(countPreview < previewLimit) {
        //console.log(v);
        var bar = [text, totals, 'color: '+color];
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

  title = 'Revitas con mayor puntaje';

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

  var chart = new google.visualization.ColumnChart(document.getElementById("chartContentText"));

  google.visualization.events.addListener(chart, 'ready', function () {
    imageChartText = chart.getImageURI();
  });

  chart.draw(view, options);

}

//############## [Journal Chart] #################
function processDataJournal(position) {
  var data = [];
  $.each(dataSet, function(index, v) {
    console.log(v);
    var journal = v[position];



    console.log(journal);
  });
}

function drawChartJournal(position, type) {

}

//############## [Number Chart] #################
function processDataNumber(position) {
  var numberArrg = [];
  $.each(dataSet, function(index, v) {
    var number = v[position];
    var totals = parseInt(v[v.length -1]);
    var count = 0;

    //if(count < 100){
      if(numberArrg.length == 0) {
        var a = {'number': number, totals: totals, 'loops': 1};
        numberArrg.push(a);
      } else {
        var match = false;
        var loops = 0;
        for(i in numberArrg) {
          var _number = numberArrg[i].number;

          if(number == _number){
            match = true;
            loops++;
            numberArrg[i].loops = numberArrg[i].loops + loops;
            numberArrg[i].totals = numberArrg[i].totals + totals;
          }
        }

        if(!match){
          //console.log(!!match);
          var a = {'number': number, totals: totals, 'loops': 1};
          numberArrg.push(a);
        }
      }
    //}
    count++;
  });

  //console.log(numberArrg);
  //google.charts.setOnLoadCallback(drawChartNumber);

  var chart = function() { drawChartNumber(numberArrg) };
  google.charts.setOnLoadCallback(chart);

}

function drawChartNumber(numberArrg) {
  var _numberArrg = numberArrg.sort(dynamicSort("totals"));

  var d = [
    ['Número', 'Totales', { role: 'style' }],
  ];

  var previewLimit = 16;
  var countPreview = 0;
  $.each(_numberArrg, function(index, v) {

    color = colorHexa();
    //var totals = v.total;
    var totals = parseInt(v.totals);
    var text = v.number;
    if(totals > 0){
      //console.log(v);
      countPreview++;
      if(countPreview < previewLimit) {
        //console.log(v);
        var bar = [text, totals, 'color: '+color];
        d.push(bar);
      }
    }
  });// end each

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

  title = 'Principales';

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

  var chart = new google.visualization.ColumnChart(document.getElementById("chartContentNumber"));

  google.visualization.events.addListener(chart, 'ready', function () {
    imageChartNumber = chart.getImageURI();
  });

  chart.draw(view, options);

}

//############## [Cities Chart] #################


function processDataCities(position) {
  var citiesArrg = [];
  var count = 0;
  $.each(dataSet, function(index, v) {
    var city = v[position];
    var totals =  parseInt(v[v.length -1]);

    if(count < 10){
      if(city.trim().length > 0) {

        if(citiesArrg.length == 0) {
          var o = {'city': city, 'totals': totals,  'loops': 1};
          citiesArrg.push(o);
          //console.log(citiesArrg);
        } else {
          var match = false;
          var loops = 0;
          for(i in citiesArrg){
            //console.log(citiesArrg[i]);
            var _city = citiesArrg[i].city;
            if(_city == city) {
              match = true;
              loops++;
              citiesArrg[i].loops = citiesArrg[i].loops + loops;
              citiesArrg[i].totals = citiesArrg[i].totals + totals;
              //console.log("valor encontrado");
            }

          }

          if(!match) {
            var o = {'city': city, 'totals': totals, 'loops': 1};
            citiesArrg.push(o);
            //console.log("agrega: " + city);
          }

        }

      }
    }
  });

  //console.log(citiesArrg);
  //google.charts.setOnLoadCallback(drawChartCities);

  var chart = function(){ drawChartCities(citiesArrg) };
  google.charts.setOnLoadCallback(chart);
}

function drawChartCities(citiesArrg) {
  var title;
  //console.log();
  var _citiesArrg = citiesArrg.sort(dynamicSort("totals"));

  var d = [
    ['País', 'Totals', { role: 'style' }],
  ];

  var previewLimit = 16;
  var countPreview = 0;
  $.each(_citiesArrg, function(index, v) {
    color = colorHexa();
    var downloads = parseInt(v.totals);
    var country = v.city;
    if(downloads > 0){
      countPreview++;
      if(countPreview < previewLimit) {
        var bar = [country, downloads, 'color: '+color];
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

  //title = 'Principales Países:' + $.number(descargas);
  title = 'Principales Ciudades';
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

  var chart = new google.visualization.ColumnChart(document.getElementById("chartContentCities"));

  google.visualization.events.addListener(chart, 'ready', function () {
    imageChartCity = chart.getImageURI();
  });

  chart.draw(view, options);
}

//############## [Countries Chart] #################
function processDataCountries(position) {
  $.each(dataSet, function(index, v) {
    var country = v[position];
    var downloads = parseInt(v[v.length -1]);
    $.each(countriesObj, function(index, v) {
      if(country == ''){
        if(v.code == 'UNK'){
          v.downloads = v.downloads + downloads;
        }
      } else {
        if(country == v.code) {
          v.downloads = v.downloads + downloads;
        }
      }
    });
  });
  //console.log(countriesObj);
    google.charts.load('current', {
        'packages':['geochart'],
        // Note: you will need to get a mapsApiKey for your project.
        // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
        'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
    });
  google.charts.setOnLoadCallback(drawChartCountries);
}

function drawChartCountries() {
  var title;
  //console.log();
  var _countriesObj = countriesObj.sort(dynamicSort("downloads"));

  var d = [
    ['País', globalTypeReport, 'Porcentaje'],
  ];

  var previewLimit = 16;
  var countPreview = 0;
  var countCountries = 0;
  $.each(_countriesObj, function(index, v) {
    color = colorHexa();
    var totals = parseInt(v.downloads);
    var country = v.name;
    var continent = v.continent;
    if(totals > 0){
      countPreview++;
      //if(countPreview < previewLimit) {
        if(country != 'Desconocido'){
          countCountries++;
          var per = (totals / globalTotals) * 100;

          if(per < parseFloat(1.0)) {
              per = 1;
          } else {
              per = Math.round(per);
          }

          var bar = [country, totals, per];
          d.push(bar);

          $.each(continentsObj, function (index, vv) {
              if(vv.name == continent && vv.totals != 1) {
                vv.totals = 1;
              }
          });

          var layer = '<h5 style="color: #72777a; font-weight: bold">'+abbreviateNumber(totals)+'</h5>\n' +
              '              <small style="color: #72777a">Visitantes de '+country+'</small>\n' +
              '              <span class="pull-right">'+per+'%</span>\n' +
              '              <div class="c-progress">\n' +
              '                <div class="c-progress-bar" style="width: '+per+'%;">\n' +
              '                </div>\n' +
              '              </div>';

          $("#countriesList").append(layer);


        }

      //}
    }
  });

  var mainData = d[1];
  var mainCountry =  mainData[0];
  var mainTotals = mainData[1];
  var mainPercent = mainData[2];

  var continents = 0;
  $.each(continentsObj, function (index, v) {
      var theyreThere = Boolean(v.totals);
      if(theyreThere){
          continents++;
      }
  });

    /***************************************/
  $('#totalContinentes').text(continents);

    /***************************************/
  $('#totalCountries').text(countCountries);

    /***************************************/
  if(globalTypeReport == 'Visitas') {
    $('#itotalType').addClass('fa-eye');
  } else {
    $('#itotalType').addClass('fa-download');
  }

  $('#totalType').text(abbreviateNumber(globalTotals)).next('span').text(' '+globalTypeReport);

    /***************************************/
  var str = mainCountry+' '+abbreviateNumber(mainTotals)+' '+globalTypeReport;
  $('#mainCountry').text(str).next('span').text(' '+mainPercent+'%');

  var data = google.visualization.arrayToDataTable(d);

  /*var view = new google.visualization.DataView(data);
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
  ]);*/

  title = 'Principales Países';
  var options = {
    title: title,
    bar: {groupWidth: "70%"},
    legend: { position: "none" },
    height: "400",
    vAxis: {
      gridlines: {count: gridlinesCount},
      format: 'short',
    },
      colorAxis: {colors: ['#E05740', '#A41C1E']}
    //colorAxis: {colors: ['blue', 'green']}
  };

  var chart = new google.visualization.GeoChart(document.getElementById("chartContentCountries"));

  google.visualization.events.addListener(chart, 'ready', function () {
    imageChartCountry = chart.getImageURI();
  });

  chart.draw(data, options);
}

//############## [Month Chart] #################
function processDataMonths(position) {
  $.each(dataSet, function(index, value) {
    var month = parseInt(value[position].substr(5));
    var downloads = parseInt(value[value.length -1]);
    if(month == 1){
      month = month - 1;
    } else {
      month = month - 1;
    }

    monthsObj[month].downloads = monthsObj[month].downloads + downloads;
  });
  //console.log(monthsObj);
  google.charts.setOnLoadCallback(drawChartMonths);

}

function drawChartMonths(){
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
    title: "Meses",
    bar: {groupWidth: "70%"},
    legend: { position: "none" },
    height: "500",
    vAxis: {
      gridlines: {count: gridlinesCount},
      format: 'short',
    }
  };

  var chart = new google.visualization.AreaChart(document.getElementById("chartContentMonths"));

  google.visualization.events.addListener(chart, 'ready', function () {
    imageChartMonth = chart.getImageURI();
  });

  chart.draw(view, options);
}

//############## [Type Total] #################
function processDataTotal(position) {
  /*var countTotals = 0;
  $.each(dataSet, function(index, value) {
    var totals = parseInt(value[position]);
    countTotals = countTotals + totals;
  });*/

  //totals = countTotals;


  //console.log(countTotals);
  //google.charts.setOnLoadCallback(drawChartMonths);
  //var countryDownloads = function() { drawChartCountryDownloads(print, tipoExport); }
  var drawChartT = function(){ drawChartTotal(globalTotals) };
  google.charts.setOnLoadCallback(drawChartT);
}

function drawChartTotal(countTotals) {
  var data = google.visualization.arrayToDataTable([
    ["option", "total", { role: "style" } ],
    ["Totales", countTotals, colorHexa()],
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
    title: "Descargas: " + $.number(countTotals),
    bar: {groupWidth: "30%"},
    legend: { position: "none" },
    height: "500",
    vAxis: {
      gridlines: {count: 30},
      format: 'short',
      viewWindow: {
              max:countTotals,
            }
    },

  };

  var chart = new google.visualization.ColumnChart(document.getElementById("chartContentTotal"));

  google.visualization.events.addListener(chart, 'ready', function () {
    imageChartTotal = chart.getImageURI();
  });
  chart.draw(view, options);
}

$("#breakdownButton").click(function (){
    var target = $("#countryDesglosDownloadsPanel");
    if(target.hasClass('hide')){
        target.css('display', 'block').removeClass('hide');
        //$(".porcent:first").click();
        $("select.porcents").val($("select.porcents option:first").val()).change();

    }
    $("html, body").animate({scrollTop: target.offset().top}, 500);
    return false;
});

$('select.porcents').change(function() {
    var porcent = parseInt($(this).val());
    var downloads = parseFloat(globalTotals);
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
        title: porcent + '% por países',
        is3D: true,
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
});

$(".export-action").click(function() {
    var chart = $(this).data("charttype");
    var typeExport = $(this).data("typeexport");
    var image, name;
    var pass = false;

    switch (chart) {
        case 'type':
            image = imageChartType;
            name = globalTypeReport+'-por-tipo';
            pass = true;
            break;
        case 'text':
            image = imageChartText;
            name = globalTypeReport+'-por-texto';
            pass = true;
            break;
        case 'journal':
            image = imageChartJournal;
            name = globalTypeReport+'-por-revista';
            pass = true;
            break;
        case 'number':
            image = imageChartNumber;
            name = globalTypeReport+'-por-número';
            pass = true;
            break;
        case 'city':
            image = imageChartCity;
            name = globalTypeReport+'-por-ciudad';
            pass = true;
            break;
        case 'country':
            image = imageChartCountry;
            name = globalTypeReport+'-por-país';
            pass = true;
            break;
        case 'month':
            image = imageChartMonth;
            name = globalTypeReport+'-por-mes';
            pass = true;
            break;
        case 'total':
            image = imageChartTotal;
            name = globalTypeReport+'-totales';
            pass = true;
            break;
        default:
            alert("¡Error al seleccionar la gráfica a descargar!");
    }

    if(pass) {
        switch (typeExport) {
            case 'png':
                download(image, name, "image/png");
                break;
            case 'pdf':
              /*
              var data = {'_token': CSRF_TOKEN, 'image': imagen, 'tipoExport': tipoExport};

              $.ajax({
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
              });
              */
              break;
            default:
                alert("¡Error al seleccionar el formato de descarga!");
        }
    }
});


$('#chartOptions').click(function () {
    //chartList
    headers.forEach(function (values) {
      values.forEach(function (value, index) {
          var input = '<li class="list-group-item"><label for=""><input type="checkbox" name="checkChart" value="'+index+'"> '+value+'</label></li>';
          $('#chartList').append(input);
      });
    });

    indexArray.forEach(function (values) {
       values.forEach(function (value) {
          var bdvalue = value.i;
          $('input[name="checkChart"]').each(function (index) {
            var checkvalue = $(this).val();
            console.log(checkvalue);
            if(checkvalue == bdvalue){
              if(!$(this).is(':checked')) {
                  $(this).prop('checked', true);
                  console.log("checkar");
              }
            }
          });
       });
    });

    $('#configCharts').modal('show');

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




















































/*function processCSVData(data) {
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

    if(contador < 5){
      console.log(v);
    }
    contador++;




    $.each(v, function(indexx, vv){
  		if(indexx == 0){
  			descargas = descargas + parseInt(vv);
  		}
  	});

    if(mes == 1){
      mes = mes - 1;
    } else {
      mes = mes - 1;
    }

    monthsObj[mes].downloads = monthsObj[mes].downloads + descargasMensuales;

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
}*/

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

































/*function drawTotalDownloadsChart() {
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

    //var chart_div = document.getElementById('chartTotalDownloadsImage');
    //var chartImage = new google.visualization.ColumnChart(chart_div);

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
}*/

$(".angle-panel-collapse").click(function(event) {
  var parents = $(this).parentsUntil('.col-lg-12');
  var parentElement = parents[parents.length - 1];
  var panelBody = $(parentElement).find('div.panel-body');

  /*var angleUP = 'Oculpar Panel <i class="fa fa-angle-up fa-lg">';
  var angleDown = 'Mostrar Panel <i class="fa fa-angle-down fa-lg">';*/

  var angleUP = 'Ocultar';
  var angleDown = 'Mostar';

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



$(".porcent").click(function() {
  var porcent = $(this).data('porcent');
  var downloads = parseFloat(totals);
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
    title: porcent + '% por países',
    is3D: true,
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart'));

  chart.draw(data, options);
});

