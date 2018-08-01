var descargas = 0;//Descargas totales
var color;

var globalCSVID = 0;

var globalTypeReport;

var globalTotals = 0;
var globaltotalCountries = 0;

//{text: ".NET", weight: 13},
var wordsCountry = [];
var wordsMonth = [];
var wordsNumber = [];

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
    $('.home-item-menu').css('display', 'none');
    $('.global-item-menu').css('display', 'block');

    if(fileName != 'noData'){
        $("#chartsContent").css('display', 'block');
        $("#noDataText").css('display', 'none');
        //$("#navLinkFileName").show();
        //$("#fileNameNavbar").text(fileName);
        //$("#a").text(fileName);
        getDataDB();
    } else {
        $("#noDataText")
            .removeClass('alert-info')
            .addClass('alert-danger')
            .html('<strong>Error al recibir los datos. Inténtelo de nuevo, por favor.</strong>');
    }
});

function getDataDB() {
    var data = {'_token': CSRF_TOKEN, 'filename': fileName};
    $.ajax({
        type: "POST",
        url: "getdatacsv",
        data: data,
        dataType: "JSON",
        success: function(response) {
            globalCSVID = response.csvFileData.csv_id;
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
            generateArrays();
        }
    });
}

function generateArrays() {
    var maxPreviewItems = 5;
    var countItems = 0;

    d3.text(getCsvFile, function(data) {
        var parsedCSV = d3.csv.parseRows(data);

        var indexNumber = 0;
        var indexCity = 0;
        var indexMonth = 0;
        var indexCountry = 0;

        var chartNumber = 0;
        var chartCity = 0;
        var chartMonth = 0;
        var chartCountry = 0;

        indexArray.forEach(function (values) {
            values.forEach(function (value) {
                var index = value.i;
                switch(value.v){
                    /*case 'Tipo':
                        indexType = index;
                        chartType = 1;
                        break;*/
                    case 'Texto':
                        indexText = index;
                        chartText = 1;
                        break;
                    /*case 'Revista':
                        indexJournal = index;
                        chartJournal = 1;
                        break;*/
                    case 'Número':
                        indexNumber = index;
                        chartNumber = 1;
                        break;
                    case 'Ciudad':
                        indexCity = index;
                        chartCity = 1;
                        break;
                    case 'País':
                        indexCountry = index;
                        chartCountry = 1;
                        break;
                    case 'Mes':
                        indexMonth = index;
                        chartMonth = 1;
                        break;
                }
            })
        });

        /*var h = parsedCSV[5];
        h.shift();
        headers.push(h);*/

        var unusableData = 1;
        if (parsedCSV[0].length > 1) {
            unusableData = 0;
        }

        var contador = 0;
        $.each(parsedCSV, function(index, v){
            var temp = v;
            if(temp.length > 1) {
                if (unusableData) {
                    temp.shift();
                }

                if(contador > 0){

                    var last = temp[temp.length -1];
                    var months = temp[temp.length -2];
                    var country = temp[temp.length -3];

                    //TOTALES
                    var totals = parseInt(last);
                    globalTotals = globalTotals + totals;

                    //MESES
                    //if(chartMonth == 1) {
                    var month = parseInt(months.substr(5));
                    if(month == 1){
                        month = month - 1;
                    } else {
                        month = month - 1;
                    }
                    monthsObj[month].downloads = monthsObj[month].downloads + totals;
                    //}

                    //globales
                    //if(chartCountry == 1) {

                    $.each(countriesObj, function(index, v) {
                        if(country == ''){
                            if(v.code == 'UNK'){
                                v.downloads = v.downloads + totals;
                            }
                        } else {
                            if(country == v.code) {
                                v.downloads = v.downloads + totals;

                            }
                        }
                    });
                    //}

                    //number
                    if(chartNumber == 1) {
                        var number = temp[indexNumber];

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
                    }// end if chartNumber

                    /*Chart City*/
                    if(chartCity == 1) {
                        var city = temp[indexCity];
                        var _country = country;
                        var continent;

                        $.each(countriesObj, function(index, v) {
                            if(country == ''){
                                _country = 'UNK';
                                continent = 'UNK';
                            } else {
                                if(_country == v.code) {
                                    continent = v.continent;
                                    _country = v.name;
                                }
                            }

                        });

                        //if(count < 10){
                        if(city.trim().length > 0) {
                            if(citiesArrg.length == 0) {
                                var o = {'city': city, 'totals': totals,  'loops': 1, 'country': _country, 'continent': continent};
                                citiesArrg.push(o);
                                //console.log(citiesArrg);
                            } else {
                                var match = false;
                                var loops = 0;
                                for(i in citiesArrg){
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
                                    var o = {'city': city, 'totals': totals, 'loops': 1, 'country': _country, 'continent': continent};
                                    citiesArrg.push(o);
                                    //console.log("agrega: " + city);
                                }

                            }

                        }
                        //}
                    }// end if chartCity
                }
                contador++;

                dataSet.push(temp);
            }

        });//end each(parsedCSV)
        $.each(countriesObj, function(index, v) {
            var totals = parseInt(v.downloads);
            var code = v.code;
            var continent = v.continent;
            if(code != 'UNK'){
                if (totals > 0) {
                    globaltotalCountries++;
                    $.each(continentsObj, function (index, vv) {
                        if(vv.name == continent && vv.totals != 1) {
                            vv.totals = 1;
                        }
                    });
                }
            }

        });

        headers = dataSet[0];
        dataSet.shift();
        switchData();
    });//end d3.text()
}

function switchData() {
    google.charts.load("current", {packages:['corechart']});
    indexArray.forEach(function(objects) {
        objects.forEach(function(v) {
            showCharts.push(v.v);
            switch(v.v){
                /*case 'Tipo':
                    $("#chartPanelTipo").show();
                    $("#panelTitleTipo").text(v.v);
                    var item ='<li>';
                    item+= '<a href="#chartPanelTipo" class="link-menu"><i class="fa fa-bar-chart"></i> '+v.v;
                    item+='</li>';
                    break;*/
                case 'Texto':
                    $("#chartPanelText").show();
                    $("#panelTitleText").text(v.v);
                    /*item ='<li>';
                    item+= '<a href="#chartPanelText" class="link-menu"><i class="fa fa-bar-chart"></i> '+v.v;
                    item+='</li>';*/
                    $('#liMenuChartText').show();
                    processDataText(v.i);
                    break;
                /*case 'Revista':
                    $("#chartPanelJournal").show();
                    $("#panelTitleJournal").text(v.v);
                    item ='<li>';
                    item+= '<a href="#chartPanelJournal" class="link-menu"><i class="fa fa-bar-chart"></i> '+v.v;
                    item+='</li>';
                    break;*/
                case 'Número':
                    $("#chartPanelNumber").show();
                    $("#panelTitleNumber").text(v.v);
                    $('#liMenuChartNumber').show();
                    /*item ='<li>';
                    item+= '<a href="#chartPanelNumber" class="link-menu"><i class="fa fa-hashtag" style="color: darkgreen"></i> '+v.v;
                    item+='</li>';*/
                    processDataNumber(v.i);
                    break;
                case 'Ciudad':
                    $("#chartPanelCity").show();
                    $("#panelTitleCity").text(v.v);
                    $('#liMenuChartCity').show();
                    /*item ='<li>';
                    item+= '<a href="#chartPanelCity" class="link-menu"><i class="fa fa-bar-chart"></i> '+v.v;
                    item+='</li>';*/
                    processDataCities(v.i);
                    break;
                case 'País':
                    $("#chartPanelCountries").show();
                    $("#panelTitleCountries").text(v.v);
                    $('#liMenuChartCountry').show();
                    /*item ='<li>';
                    item+= '<a href="#chartPanelCountries" class="link-menu"><i class="fa fa-globe" style="color: dodgerblue;"></i> '+v.v;
                    item+='</li>';*/

                    processDataCountries(v.i);
                    break;
                case 'Mes':
                    $("#chartPanelMonths").show();
                    $("#panelTitleMonths").text(v.v);
                    $('#liMenuChartMonth').show();
                    /*item ='<li>';
                    item+= '<a href="#chartPanelMonths" class="link-menu"><i class="fa fa-calendar" style="color: darkred"></i> '+v.v;
                    item+='</li>';*/
                    processDataMonths(v.i);
                    break;
                case 'Total':
                    $("#chartPanelTotal").show();
                    $("#panelTitleTotal").text(v.v);
                    $('#liMenuChartTotal').show();
                    /*item ='<li>';
                    item+= '<a href="#chartPanelTotal" class="link-menu"><i class="fa fa-circle" style="color: darkgreen;"></i> '+v.v;
                    item+='</li>';*/
                    processDataTotal(v.i);
                    break;
            }// end switch
            //$("#menuOptionCharts").find("ul").append(item);
        });
    });
    $("#menuOptionCharts").css('display', 'block').addClass('active').find('ul').addClass('in');

    fadeOutLoader();
}

//############## [Countries Chart] #################
$("#searchCountry").keyup(function() {
    _this = this;
    // Show only matching TR, hide rest of them
    $.each($("#countriesList > div"), function() {
        if ($(this).data('country').toLowerCase().indexOf($(_this).val().toLowerCase()) === -1)
            $(this).hide();
        else
            $(this).show();
    });
});
function processDataCountries(position) {
    /*$.each(dataSet, function(index, v) {
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
    });*/
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
    var unknowTotals = 0;
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

                /*$.each(continentsObj, function (index, vv) {
                    if(vv.name == continent && vv.totals != 1) {
                        vv.totals = 1;
                    }
                });*/

                var layer = '<div data-country="'+country+'"><h5 style="color: #72777a; font-weight: bold">'+abbreviateNumber(totals)+'</h5>\n' +
                    '              <small style="color: #72777a">'+ globalTypeReport+' de <span style="font-weight: bold; color: #000">'+country+'</span></small>\n' +
                    '              <span class="pull-right">'+per+'%</span>\n' +
                    '              <div class="c-progress">\n' +
                    '                <div class="c-progress-bar" style="width: '+per+'%;">\n' +
                    '                </div>\n' +
                    '              </div></div>';

                $("#countriesList").append(layer);


                var word = {text: country, weight: totals};
                wordsCountry.push(word);
            } else {
                unknowTotals = totals;
                unknowPercent = Math.round((totals / globalTotals) * 100);
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

    /*********************/
    $('#totalContinentes').text(continents);

    /*********************/
    $('#totalCountries').text(countCountries);

    /*********************/
    if(globalTypeReport == 'Visitas') {
        $('#itotalType, #itotalTypeUnk').addClass('fa-eye');
    } else {
        $('#itotalType, #itotalTypeUnk').addClass('fa-download');
    }

    $('#totalType').text(abbreviateNumber(globalTotals)).next('span').text(' '+globalTypeReport);

    /*********************/
    var str = mainCountry+' '+abbreviateNumber(mainTotals)+' ';
    $('#mainCountry').text(str).next('span').text(globalTypeReport +', '+mainPercent+'%');

    /*********************/

    $('#totalTypeUnk').text(abbreviateNumber(unknowTotals)).next('span')
        .text(' '+globalTypeReport + ' sin especificar, ' +unknowPercent+ '%');

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

    title = '';
    var options = {
        title: title,
        bar: {groupWidth: "70%"},
        legend: { position: "none" },
        height: "400",
        vAxis: {
            gridlines: {count: gridlinesCount},
            format: 'short',
        },
        colorAxis: {colors: ['#E05740', '#A41C1E']},
        animation:{
            duration: 1000,
            easing: 'out',
        },
        //colorAxis: {colors: ['blue', 'green']}
    };

    var chart = new google.visualization.GeoChart(document.getElementById("chartContentCountries"));

    google.visualization.events.addListener(chart, 'ready', function () {
        imageChartCountry = chart.getImageURI();
    });

    chart.draw(data, options);
    $('#cloudWordsCountry').jQCloud(wordsCountry);
}

//############## [Cities Chart] #################
var citiesArrg = [];
function processDataCities(position) {
    /*var citiesArrg = [];
    var count = 0;
    $.each(dataSet, function(index, v) {
        var city = v[position];
        var totals =  parseInt(v[v.length -1]);

        //if(count < 10){
            if(city.trim().length > 0) {
                if(citiesArrg.length == 0) {
                    var o = {'city': city, 'totals': totals,  'loops': 1};
                    citiesArrg.push(o);
                    //console.log(citiesArrg);
                } else {
                    var match = false;
                    var loops = 0;
                    for(i in citiesArrg){
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
        //}
    });*/

    //console.log(citiesArrg);
    //google.charts.setOnLoadCallback(drawChartCities);

    /*google.charts.load('current', {packages: ['treemap']});
    google.charts.setOnLoadCallback(drawChartCities);*/
    /*var chart = function(){ drawChartCities(citiesArrg) };
    google.charts.setOnLoadCallback(drawChartCities);*/
    google.charts.setOnLoadCallback(drawChartCitiesFull);
}

function drawChartCitiesFull() {
    var dataSet = [];
    $.each(citiesArrg, function(index, v) {
        var totals = parseInt(v.totals);
        var city = v.city;
        var country = v.country;
        if(totals > 0) {
            //if(countPreview < previewLimit) {

            var data = [city, country,  $.number(totals)];
            //console.log(data);
            dataSet.push(data);
            //}

        }
    });

    var x = $("#tableContentCities").DataTable({
        data : dataSet,
        columns: [
            { title: 'Ciudad' },
            { title: 'País'},
            { title: globalTypeReport }
        ],
        "order": [[ 2, "desc" ]],
        "language": {
            "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        }
    });
}

function drawChartCities() {
    var title;
    //console.log();
    /*var _citiesArrg = citiesArrg.sort(dynamicSort("totals"));*/

    /*var d = [
        ['País', 'Totals', { role: 'style' }],
    ];*/

    var d = [
        ['Location', 'Parent', 'Market trade volume (size)', 'Market increase/decrease (color)'],
        ['Global',    null,                 0,                               0],
    ];

    var continents = 0;
    $.each(continentsObj, function (index, v) {
        var theyreThere = Boolean(v.totals);
        if(theyreThere){
            var data = [v.name, 'Global', 0, 0];
            d.push(data);
        }
    });

    var totalCountries = countriesObj.length;
    var size = Math.round(totalCountries / 100);
    $.each(countriesObj, function(index, v) {
        color = colorHexa();
        var totals = parseInt(v.downloads);
        var country = v.name;
        var continent = v.continent;
        if (totals > 0) {
            //countPreview++;
            //if(countPreview < previewLimit) {
            if (country != 'Desconocido') {
                var data = [country, continent, size, size];
                d.push(data);
            }
        }
    });

    countPreview = 0;
    previewLimit = 100;

    var totalCities = citiesArrg.length;
    var size = Math.round(totalCities / 100);
    $.each(citiesArrg, function(index, v) {
        var totals = parseInt(v.totals);
        var city = v.city;
        var country = v.country;
        if(totals > 0) {
            //if(countPreview < previewLimit) {
            var data = [city, country, size, size];
            //console.log(data);
            d.push(data);
            //}
            countPreview++
        }
        console.log(city);
    });

    var previewLimit = 200;
    var countPreview = 0;
    /*$.each(_citiesArrg, function(index, v) {
        color = colorHexa();
        var downloads = parseInt(v.totals);
        var city = v.city;
        if(downloads > 0){
            countPreview++;
            if(countPreview < previewLimit) {
                var bar = [city, downloads, 'color: '+color];
                d.push(bar);
            }
        }
    });*/

    //console.log(_citiesArrg);

    /*var datax = google.visualization.arrayToDataTable([
        ['Location', 'Parent', 'Market trade volume (size)', 'Market increase/decrease (color)'],
        ['Global',    null,                 0,                               0],
        ['America',   'Global',             0,                               0],
        ['Europe',    'Global',             0,                               0],
        ['Asia',      'Global',             0,                               0],
        ['Australia', 'Global',             0,                               0],
        ['Africa',    'Global',             0,                               0],
        ['Brazil',    'America',            11,                              10],
        ['USA',       'America',            52,                              31],
        ['Mexico',    'America',            24,                              12],
        ['Canada',    'America',            16,                              -23],
        ['France',    'Europe',             42,                              -11],
        ['Germany',   'Europe',             31,                              -2],
        ['Sweden',    'Europe',             22,                              -13],
        ['Italy',     'Europe',             17,                              4],
        ['UK',        'Europe',             21,                              -5],
        ['China',     'Asia',               36,                              4],
        ['Japan',     'Asia',               20,                              -12],
        ['India',     'Asia',               40,                              63],
        ['Laos',      'Asia',               4,                               34],
        ['Mongolia',  'Asia',               1,                               -5],
        ['Israel',    'Asia',               12,                              24],
        ['Iran',      'Asia',               18,                              13],
        ['Pakistan',  'Asia',               11,                              -52],
        ['Egypt',     'Africa',             21,                              0],
        ['S. Africa', 'Africa',             30,                              43],
        ['Sudan',     'Africa',             12,                              2],
        ['Congo',     'Africa',             10,                              12],
        ['Zaire',     'Africa',             8,                               10]
    ]);*/

    var data = google.visualization.arrayToDataTable(d);

    tree = new google.visualization.TreeMap(document.getElementById('chartContentCities'));

    tree.draw(data, {
        midColor: '#E05740',
        maxColor: '#A41C1E',
        headerHeight: 15,
        fontColor: 'white',
        showScale: true
    });
    //['#E05740', '#A41C1E']

    /*var data = google.visualization.arrayToDataTable(d);

    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
        { calc: "stringify",
            sourceColumn: 1,
            type: "string",
            role: "annotation" },
        2]);

    var options = {
        //title: "Descargas por país. Total " + $.number(descargas),
        bar: {groupWidth: "60%"},
        legend: { position: "none" },
        fontSize: 14,
        hAxis: {
            title: 'Total de ' + globalTypeReport + ': ' + $.number(descargas),
            minValue: 0,
            format: 'short'
        },
        vAxis: {
            title: 'Ciudad',

        },
        chartArea: {width: '90%', height: '95%', left: 100},
    };

    var chart = new google.visualization.BarChart(document.getElementById("chartContentCities"));
    google.visualization.events.addListener(chart, 'ready', function () {
        countriesWithDownloadsImageChart = chart.getImageURI();
    });
    chart.draw(view, options);*/
}

/*function drawChartCities(citiesArrg) {
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
        var city = v.city;
        if(downloads > 0){
            countPreview++;
            if(countPreview < previewLimit) {
                var bar = [city, downloads, 'color: '+color];
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
    title = 'Principales Ciudades con mayores' + globalTypeReport;
    var options = {
        title: title,
        bar: {groupWidth: "70%"},
        legend: { position: "none" },
        height: "500",
        vAxis: {
            gridlines: {count: gridlinesCount},
            format: 'short',
        },
        animation:{
            duration: 1000,
            easing: 'out',
        },
    };

    var chart = new google.visualization.ColumnChart(document.getElementById("chartContentCities"));

    google.visualization.events.addListener(chart, 'ready', function () {
        imageChartCity = chart.getImageURI();
    });

    chart.draw(view, options);
}*/

//############# [Month Chart] #################
var monthsChartDraw = 'pie';
$('.switchMonthChart').click(function () {
    monthsChartDraw = $(this).data('chart');

    if(!$(this).hasClass('btn-primary')) {
        $('.switchMonthChart').removeClass('btn-primary').addClass('btn-default');
        $(this).addClass('btn-primary');
        var data = $(this).data('sort');
    }

    google.charts.setOnLoadCallback(drawChartMonths);
});

function processDataMonths(position) {
    /*$.each(dataSet, function(index, value) {
        var month = parseInt(value[position].substr(5));
        var downloads = parseInt(value[value.length -1]);
        if(month == 1){
            month = month - 1;
        } else {
            month = month - 1;
        }

        monthsObj[month].downloads = monthsObj[month].downloads + downloads;
    });*/
    //console.log(monthsObj);
    google.charts.setOnLoadCallback(drawChartMonths);

}

function drawChartMonths(){

    var d;
    switch (monthsChartDraw) {
        case 'pie':
            d = [
                ['Mes', globalTypeReport],
            ];
            break;
        case 'column':
        case 'line':
            d = [
                ['Mes', globalTypeReport, { role: "style" }],
            ];
            break;
    }

    var colors = [];

    $('#monthsList').empty();

    var count = 0;
    var maxValue = 0;
    var maxMonth;
    $.each(monthsObj, function(index, v) {
        colorHex = colorHexa();
        var percent = Math.round((v.downloads / globalTotals) * 100);

        switch (monthsChartDraw){
            case 'pie':
                var bar = [v.name, v.downloads];
                var color = {color: colorHex};
                colors.push(color);
                break;
            case 'column':
            case 'line':
                var bar = [v.shortname, v.downloads, colorHex];
                //progressColor = colorHex;
                break;
        }

        if(bar[1] > maxValue){
            maxValue = bar[1];
            maxMonth = bar;
        }

        var layer = '<h5 style="color: #72777a; font-weight: bold">'+abbreviateNumber(v.downloads)+'</h5>\n' +
            '              <small style="color: #72777a">'+globalTypeReport+' en <span style="font-weight: bold; color: #000">'+v.name+'</span></small>\n' +
            '              <span class="pull-right">'+percent+'%</span>\n' +
            '              <div class="c-progress">\n' +
            '                <div class="c-progress-bar" style="width: '+percent+'%; background: '+colorHex+' !important;">\n' +
            '                </div>\n' +
            '              </div>';

        d.push(bar);
        $('#monthsList').append(layer);

        var word = {text: v.name, weight: v.downloads};
        wordsMonth.push(word);
    });

    if(globalTypeReport == 'Visitas') {
        $('#itotalTypeMonth').addClass('fa-eye');
    } else {
        $('#itotalTypeMonth').addClass('fa-download');
    }

    $('#totalMonth').text(abbreviateNumber(globalTotals) + ' ' + globalTypeReport).next('span').text($.number(globalTotals));


    var mData = maxMonth;
    var maxName = mData[0];
    var maxTotals = mData[1];
    var percent = Math.round((maxTotals / globalTotals) * 100);


    $('#monthUp').text(maxName + ' ' + abbreviateNumber(maxTotals) + ' ' + globalTypeReport).next('span').text(percent + '%');


    var data = google.visualization.arrayToDataTable(d);

    var view = new google.visualization.DataView(data);

    switch (monthsChartDraw){
        case 'column':
        case 'line':
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
            break;
    }

    var options = {
        title: "",
        bar: {groupWidth: "70%"},
        legend: { position: "none" },
        pieSliceText: 'label',
        height: "500",
        animation:{
            duration: 1000,
            easing: 'out',
        },
        is3D: true,
        slices: colors
    };


    switch (monthsChartDraw) {
        case 'pie':
            var chart = new google.visualization.PieChart(document.getElementById("chartContentMonths"));
            break;
        case 'column':
            var chart = new google.visualization.ColumnChart(document.getElementById("chartContentMonths"));
            break;
        case 'line':
            var chart = new google.visualization.LineChart(document.getElementById("chartContentMonths"));
            break;
    }

    google.visualization.events.addListener(chart, 'ready', function () {
        imageChartMonth = chart.getImageURI();
    });

    chart.draw(view, options);
    $('#cloudWordsMonth').jQCloud(wordsMonth);
}

//############## [Number Chart] #################
$("#searchNumber").keyup(function() {
    _this = this;
    // Show only matching TR, hide rest of them
    $.each($(".md-chips > div, #numbersList > div"), function() {
        if (String($(this).data('number')).indexOf(String($(_this).val())) === -1 )
            $(this).hide();
        else
            $(this).show();
    });
});

var numberArrg = [];
function processDataNumber(position) {

    //var count = 0;
    /*$.each(dataSet, function(index, v) {
        var number = v[position];
        var totals = parseInt(v[v.length -1]);

        //if(count < 10){
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
        //count++;
    });*/

    //console.log(numberArrg);
    //google.charts.setOnLoadCallback(drawChartNumber);

    //var order = 'desc';
    var chart = function() { drawChartNumber() };
    google.charts.setOnLoadCallback(chart);
    /*var order = 'desc';
    drawChartNumber(order);*/

}

var numbersChartDraw = 'column';
$('.switchNumberChart').click(function () {
    numbersChartDraw = $(this).data('chart');

    if(!$(this).hasClass('btn-primary')) {
        $('.switchNumberChart').removeClass('btn-primary').addClass('btn-default');
        $(this).addClass('btn-primary');
        var data = $(this).data('sort');
    }
    console.log(numbersChartDraw);

    google.charts.setOnLoadCallback(drawChartNumber);
});

/*$('.btn-sort-numbers').click( function () {
    if(!$(this).hasClass('btn-primary')){
        $('.btn-sort-numbers').removeClass('btn-primary').addClass('btn-default');
        $(this).addClass('btn-primary');
        var data = $(this).data('sort');

        var order;
        if(data == 'desc'){
            order = 'desc';
        } else {
            order = 'asc';
        }
        drawChartNumber(order);
    }
});*/

function drawChartNumber() {
    var totalNumbers = 0;
    var ratingdov = 0;
    var _numberArrg = numberArrg.sort(dynamicSort("totals"));
    /*if(order == 'desc'){
        var _numberArrg = numberArrg.sort(dynamicSort("totals"));
    } else {
        var _numberArrg = numberArrg.sort(dynamicSortMenor("totals"));
    }*/

    //$('#sorterByTypeReport').text(globalTypeReport);

    /*var faIcon;
    if (globalTypeReport == 'Descargas') {
        faIcon = '<i class="fa fa-download"></i>';
    } else {
        faIcon = '<i class="fa fa-eye"></i>';
    }*/
    var dataArrg;
    switch (numbersChartDraw) {
        case 'pie':
            dataArrg = [
                ['Mes', globalTypeReport],
            ];
            break;
        case 'column':
        case 'line':
            dataArrg = [
                ['Número', 'Totales', { role: 'style' }],
            ];
            break;
    }

    var colors = [];

    /*var dataArrg = [
        ['Número', 'Totales', { role: 'style' }],
    ];*/

    var previewLimit = 10;
    var countPreview = 0;



    $('.md-chips, #numbersList').empty();
    $.each(_numberArrg, function(index, v) {
        var colorhexa = colorHexa();
        //var totals = v.total;
        var totals = parseInt(v.totals);
        var text = v.number;
        if(totals > 0){
            //console.log(v);
            if(countPreview < previewLimit) {
                //console.log(v);
                ratingdov = ratingdov + totals;
                //var bar = ['#' + text, totals, 'color: '+color];

                switch (numbersChartDraw){
                    case 'pie':
                        var bar = ['#' + text, totals];
                        var color = {color: colorhexa};
                        colors.push(color);
                        break;
                    case 'column':
                        var bar = ['#' + text, totals, 'color: '+colorhexa];
                        break;
                    case 'line':
                        colorhexa = '#A41C1E';
                        var bar = ['#' + text, totals, 'color: '+colorhexa];
                        //progressColor = colorHex;
                        break;
                }
                dataArrg.push(bar);
            }
            countPreview++;
            /*var chip = '<div class="md-chip col-md-2 col-xs-12" data-number="'+text+'">\n' +
                '                <div class="md-chip-icon">#'+text+'</div>\n' +
                '                ' + abbreviateNumber(totals) + ' ' + faIcon +
                '              </div>';
            $('.md-chips').append(chip);*/

            var per = (totals / globalTotals) * 100;

            if(per < parseFloat(1.0)) {
                per = 1;
            } else {
                per = Math.round(per);
            }
            var layer = '<div data-number="'+text+'"><h5 style="color: #72777a; font-weight: bold">'+abbreviateNumber(totals)+'</h5>\n' +
                '              <small style="color: #72777a">'+ globalTypeReport+' del <span style="font-weight: bold; color: #000">#'+text+'</span></small>\n' +
                '              <span class="pull-right">'+per+'%</span>\n' +
                '              <div class="c-progress">\n' +
                '                <div class="c-progress-bar" style="width: '+per+'%; background: '+colorhexa+' !important">\n' +
                '                </div>\n' +
                '              </div></div>';


            $('#numbersList').append(layer);

            totalNumbers++;
        }
    });// end each

    $('#totalNumbers').text(totalNumbers);

    var data = google.visualization.arrayToDataTable(dataArrg);

    var view = new google.visualization.DataView(data);

    switch (numbersChartDraw){
        case 'column':
        case 'line':
            view.setColumns([0, 1,
                { calc: "stringify",
                    sourceColumn: 1,
                    type: "string",
                    role: "annotation" },
                2]);
            break;
    }

    /*downloads or views*/
    var dov = (globalTypeReport == 'descargas') ? 'descargados' : 'visitados';
    var ratingPercent = Math.round((ratingdov / globalTotals) * 100);


    var options = {
        title: 'Rating de los '+ previewLimit +' números más ' + dov + ' ('+ ratingPercent +'%)',
        subtitle: 'Números totales:' + totalNumbers,
        bar: {groupWidth: "70%"},
        legend: { position: "none" },
        pieSliceText: 'label',
        height: "500",
        hAxis: {
            title: 'Números',

        },
        vAxis: {
            title: globalTypeReport,
            gridlines: {count: gridlinesCount},
            format: 'short',
        },
        animation:{
            duration: 1000,
            easing: 'out',
        },
        is3D: true,
        slices: colors
    };

    switch (numbersChartDraw) {
        case 'pie':
            var chart = new google.visualization.PieChart(document.getElementById("chartContentNumber"));
            break;
        case 'column':
            var chart = new google.visualization.ColumnChart(document.getElementById("chartContentNumber"));
            break;
        case 'line':
            var chart = new google.visualization.AreaChart(document.getElementById("chartContentNumber"));
            break;
    }


    google.visualization.events.addListener(chart, 'ready', function () {
        imageChartNumber = chart.getImageURI();
    });
    chart.draw(view, options);
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

    var data = [];
    $.each(textArrg, function (index, v) {

        //var d = [v.text, v.loops, $.number(v.total)];
        var d = [v.text, $.number(v.total)];
        data.push(d);
        /*$.each(values, function (i, v) {

        });*/
    });

    var x = $("#tableContentText").DataTable({
        data : data,
        columns: [
            { title: 'Texto' },
            /*{ title: 'Repeticiones'},*/
            { title: globalTypeReport }
        ],
        "order": [[ 1, "desc" ]],
        "language": {
            "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        }
    });
    //google.charts.setOnLoadCallback(drawChartText);

    /*var chart = function() { drawChartText(textArrg) };
    google.charts.setOnLoadCallback(chart);*/

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










//############## [Type Total] #################
function processDataTotal(position) {
    //totals
    if(globalTypeReport == 'Visitas') {
        $('#panelTotalIcon, #panelUnknowsIcon').addClass('fa-eye');
    } else {
        $('#panelTotalIcon, #panelUnknowsIcon').addClass('fa-download');
    }
    $('#panelTotals').text(abbreviateNumber(globalTotals));
    $('#panelTotalsTypeReport').text(globalTypeReport + '(' + $.number(globalTotals) + ')');

    //months
    var totalMonths = 0;
    $.each(monthsObj, function(index, v) {
        if(v.downloads > 0){
            totalMonths++;
        }
    });
    $('#panelMonths').text(totalMonths);

    //countries
    $('#panelCountries').text(globaltotalCountries);

    /*var unKnows = countriesObj[0];
    var unktotals = unKnows.downloads;
    var percent = Math.round((unktotals / globalTotals) * 100);
    $('#panelUnknows').text($.number(unktotals));
    $('#panelUnknowsSpan').text(percent);*/


    /*var mainData = d[1];

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


    $('#totalContinentes, #panelCountContinents').text(continents);



    $('#totalCountries, #panelCountCountries').text(countCountries);



    if(globalTypeReport == 'Visitas') {
        $('#itotalType, #panelTypeReport').addClass('fa-eye');
    } else {
        $('#itotalType, #panelTypeReport').addClass('fa-download');
    }

    $('#totalType').text(abbreviateNumber(globalTotals)).next('span').text(' '+globalTypeReport);
    $('#panelTotalType').text(abbreviateNumber(globalTotals)).next('div').text(globalTypeReport);



    var str = mainCountry+' '+abbreviateNumber(mainTotals)+' '+globalTypeReport;
    $('#mainCountry').text(str).next('span').text(' '+mainPercent+'%');*/


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
        title: "Descargas Totales: " + $.number(countTotals),
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
        animation:{
            duration: 1000,
            easing: 'out',
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


var typeReportArray = [];
$('#chartOptions').click(function () {
    //chartList

    var chartList = $('#chartList');
    chartList.empty();
    headers.forEach(function (value, index) {
        if(value != 'Tipo' && value != 'Revista') {
            var input = '<li class="list-group-item"><label for=""><input type="checkbox" name="checkChart" data-index="'+index+'" value="'+value+'"> '+value+'</label></li>';
            chartList.append(input);
        }
    });

    indexArray.forEach(function (values) {
        values.forEach(function (value) {
            var indexBD = value.i;
            $('input[name="checkChart"]').each(function (index) {
                var index = $(this).data('index');
                var value = $(this).val();
                if(index == indexBD){
                    if(!$(this).is(':checked')) {
                        $(this).prop('checked', true);
                        var dataArrg = {"i": index, "v": value};
                        typeReportArray.push(dataArrg);
                    }
                }
            });
        });
    });

    $('#configCharts').modal({
        backdrop: 'static',
        keyboard: true,
        show: true
    });

});

$(document).on("click", "input[name='checkChart']", function() {
    var index = $(this).data("index");
    var value = $(this).attr("value");

    if($(this).is(":checked")){
        var dataArrg = {"i": index, "v": value};
        typeReportArray.push(dataArrg);
    } else {
        for(var i in typeReportArray){
            if(typeReportArray[i].i == index){
                typeReportArray.splice(i, 1);
                break;
            }
        }
    }

    typeReportArray.sort();
});

$('#saveChangesChartList').click(function () {
    if(typeReportArray.length > 0){
        var data = {
            '_token': CSRF_TOKEN,
            'action': 'upload_report_index',
            'csvId' : globalCSVID,
            'indexArray': typeReportArray
        };

        $.ajax({
            type: "POST",
            url: "/uploadcsv",
            data: data,
            dataType: "JSON",
            success: function(response){
                location.reload();
            }
        });
    } else {
        alert("Debe seleccionar al menos una casilla de selección para generar gráficas");
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

function dynamicSortMenor(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (b,a) {
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

