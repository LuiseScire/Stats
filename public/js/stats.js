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
                    case 'Texto':
                        indexText = index;
                        chartText = 1;
                        break;
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
                    var month = parseInt(months.substr(5));
                    if(month == 1){
                        month = month - 1;
                    } else {
                        month = month - 1;
                    }
                    monthsObj[month].downloads = monthsObj[month].downloads + totals;


                    //globales
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
                        var countryCode;
                        var continent;

                        $.each(countriesObj, function(index, v) {
                            if(country == ''){
                                _country = 'UNK';
                                continent = 'UNK';
                                countryCode = 'UNK'
                            } else {
                                if(_country == v.code) {
                                    continent = v.continent;
                                    _country = v.name;
                                    countryCode = v.code;
                                }
                            }

                        });

                        //if(count < 10){
                        if(city.trim().length > 0) {
                            if(citiesArrg.length == 0) {
                                var o = {'city': city, 'totals': totals,  'loops': 1, 'countryCode': countryCode, 'country': _country, 'continent': continent};
                                citiesArrg.push(o);

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
                                    }
                                }

                                if(!match) {
                                    var o = {'city': city, 'totals': totals, 'loops': 1, 'countryCode': countryCode, 'country': _country, 'continent': continent};
                                    citiesArrg.push(o);

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
                case 'Texto':
                    $("#chartPanelText").show();
                    $("#panelTitleText").text(v.v);
                    $('#liMenuChartText').show();
                    processDataText(v.i);
                    break;
                case 'Número':
                    $("#chartPanelNumber").show();
                    $("#panelTitleNumber").text(v.v);
                    $('#liMenuChartNumber').show();
                    processDataNumber(v.i);
                    break;
                case 'Ciudad':
                    $("#chartPanelCity").show();
                    $("#panelTitleCity").text(v.v);
                    $('#liMenuChartCity').show();
                    processDataCities();
                    break;
                case 'País':
                    $("#chartPanelCountries").show();
                    $("#panelTitleCountries").text(v.v);
                    $('#liMenuChartCountry').show();
                    processDataCountries();
                    break;
                case 'Mes':
                    $("#chartPanelMonths").show();
                    $("#panelTitleMonths").text(v.v);
                    $('#liMenuChartMonth').show();
                    processDataMonths();
                    break;
                case 'Total':
                    $("#chartPanelTotal").show();
                    $("#panelTitleTotal").text(v.v);
                    $('#liMenuChartTotal').show();
                    processDataTotal(v.i);
                    break;
            }// end switch

        });
    });
    $("#menuOptionCharts").css('display', 'block').addClass('active').find('ul').addClass('in');

    fadeOutLoader();
}

//############## [Countries Chart] #################
var countryChartDraw = 'geo';
$('.switchCountryChart').click(function () {
    countryChartDraw = $(this).data('chart');
    if(!$(this).hasClass('btn-primary')) {
        $('.switchCountryChart').removeClass('btn-primary').addClass('btn-default');
        $(this).addClass('btn-primary');
    }
    google.charts.setOnLoadCallback(drawChartCountries);
});

function processDataCountries() {
    google.charts.load('current', {
        'packages':['geochart'],
        'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
    });
    google.charts.setOnLoadCallback(drawChartCountries);
}

function drawChartCountries() {
    var _countriesObj = countriesObj.sort(dynamicSort("downloads"));

    /*var d = [
        ['País', globalTypeReport, 'Porcentaje'],
    ];*/

    var d;
    switch (countryChartDraw) {
        case 'geo':
            d = [
                ['País', globalTypeReport, 'Porcentaje'],
            ];
            break;
        case 'pie':
            d = [
                ['País', globalTypeReport],
            ];
            break;
        case 'column':
        case 'line':
            d = [
                ['País', 'Totals', { role: 'style' }],
            ];
            break;
    }

    var colors = [];

    $('#countriesList').empty();

    var previewLimit = 10;
    var countPreview = 0;
    var countCountries = 0;
    var unknowTotals = 0;
    $.each(_countriesObj, function(index, v) {
        colorHex = colorHexa();
        var totals = parseInt(v.downloads);
        var country = v.name;
        if(totals > 0){
            if(country != 'Desconocido'){
                countCountries++;
                var per = (totals / globalTotals) * 100;

                if(per < parseFloat(1.0)) {
                    per = 1;
                } else {
                    per = Math.round(per);
                }

                switch (countryChartDraw){
                    case 'geo':
                        var bar = [country, totals, per];
                        d.push(bar);
                        colorHex = '#A41C1E';
                        break;
                    case 'pie':
                        if(countPreview < previewLimit) {
                            var text = country + ' ' + abbreviateNumber(totals) + ' ' + globalTypeReport;
                            var bar = [text, totals];
                            d.push(bar);
                            var color = {color: colorHex};
                            colors.push(color);
                        }
                        break;
                    case 'column':
                        if(countPreview < previewLimit) {
                            var bar = [country, totals, 'color: '+colorHex];
                            d.push(bar);
                            break;
                        }
                    case 'line':
                        if(countPreview < previewLimit) {
                            colorHex = '#A41C1E';
                            var bar = [country, totals, 'color: '+colorHex];
                            d.push(bar);
                        }
                        break;
                }
                countPreview++;



                var layer = '<div data-country="'+country+'"><h5 style="color: #72777a; font-weight: bold">'+abbreviateNumber(totals)+'</h5>\n' +
                    '              <small style="color: #72777a">'+ globalTypeReport+' de <span style="font-weight: bold; color: #000">'+country+'</span></small>\n' +
                    '              <span class="pull-right">'+per+'%</span>\n' +
                    '              <div class="c-progress">\n' +
                    '                <div class="c-progress-bar" style="width: '+per+'%; background: '+colorHex+' !important;">\n' +
                    '                </div>\n' +
                    '              </div></div>';

                $("#countriesList").append(layer);

                var word = {text: country, weight: totals};
                wordsCountry.push(word);
            } else {
                unknowTotals = totals;
                unknowPercent = Math.round((totals / globalTotals) * 100);
            }

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

    var view = new google.visualization.DataView(data);

    var title = 'Rating ' + previewLimit + ' de países con mayores ' + globalTypeReport;

    switch (countryChartDraw){
        case 'geo':
            //title = 'Todos los países que realizan ' + globalTypeReport;
            var options = {
                height: "400",
                colorAxis: {colors: ['#E05740', '#A41C1E']},
            };
            var chart = new google.visualization.GeoChart(document.getElementById("chartContentCountries"));
            break;
        case 'pie':
            var options = {
                title: title,
                is3D: true,
                chartArea:{left:10, top:20, width:"100%", height:"90%"},
                slices: colors
            };
            var chart = new google.visualization.PieChart(document.getElementById("chartContentCountries"));
            break;
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

            var options = {
                title: title,
                bar: {groupWidth: "70%"},
                legend: { position: "none" },
                height: "500",
                vAxis: {
                    title: globalTypeReport,
                    gridlines: {count: gridlinesCount},
                    format: 'short',
                },
                hAxis: {
                    title: 'Ciudades',
                }

            };
            if(countryChartDraw == 'column'){
                var chart = new google.visualization.ColumnChart(document.getElementById("chartContentCountries"));
            } else {
                var chart = new google.visualization.AreaChart(document.getElementById("chartContentCountries"));
            }
            break;
    }

    google.visualization.events.addListener(chart, 'ready', function () {
        imageChartCountry = chart.getImageURI();
    });

    //chart.draw(data, options);
    chart.draw(view, options);
    $('#cloudWordsCountry').jQCloud(wordsCountry);
}

$("#searchCountry").keyup(function() {
    _this = this;
    $.each($("#countriesList > div"), function() {
        if ($(this).data('country').toLowerCase().indexOf($(_this).val().toLowerCase()) === -1)
            $(this).hide();
        else
            $(this).show();
    });
});

//############## [Cities Chart] #################
var cityChartDraw = 'column';
$('.switchCityChart').click(function () {
    cityChartDraw = $(this).data('chart');
    if(!$(this).hasClass('btn-primary')) {
        $('.switchCityChart').removeClass('btn-primary').addClass('btn-default');
        $(this).addClass('btn-primary');
    }
    google.charts.setOnLoadCallback(drawChartCities);
});

var citiesArrg = [];
function processDataCities() {
    /*var chart = function(){ drawChartCities(citiesArrg) };
    google.charts.setOnLoadCallback(drawChartCities);*/
    google.charts.setOnLoadCallback(drawChartCities);
}

function drawChartCities() {
    var _citiesArrg = citiesArrg.sort(dynamicSort("totals"));

    var d;
    switch (cityChartDraw) {
        case 'pie':
            d = [
                ['Ciudad', globalTypeReport],
            ];
            break;
        case 'column':
        case 'line':
            d = [
                ['Ciudad', 'Totals', { role: 'style' }],
            ];
            break;
    }

    var colors = [];

    $('#citiesList').empty();

    var previewLimit = 10;
    var countPreview = 0;
    $.each(_citiesArrg, function(index, v) {
        colorHex = colorHexa();
        var totals = parseInt(v.totals);
        var city = v.city;
        var countryCode = v.countryCode;
        var continent = v.continent;
        var fullName = city+'('+countryCode+', '+continent+')';
        var fullNameCity = city+'('+countryCode+')';
        if(totals > 0){
            if(countPreview < previewLimit) {
                switch (cityChartDraw){
                    case 'pie':
                        fullNameCity = city+'('+countryCode+') ' + abbreviateNumber(totals) + ' ' + globalTypeReport;
                        var bar = [fullNameCity, totals];
                        var color = {color: colorHex};
                        colors.push(color);
                        break;
                    case 'column':
                        var bar = [fullNameCity, totals, 'color: '+colorHex];
                        break;
                    case 'line':
                        colorHex = '#A41C1E';
                        var bar = [fullNameCity, totals, 'color: '+colorHex];
                        //progressColor = colorHex;
                        break;
                }
                d.push(bar);
            }
            countPreview++;

            var percent = (totals / globalTotals) * 100;
            if(percent < parseFloat(1.0)) {
                percent = 1;
            } else {
                percent = Math.round(percent);
            }

            var layer = '<div data-city="'+fullName+'"><h5 style="color: #72777a; font-weight: bold">'+abbreviateNumber(totals)+'</h5>\n' +
                '              <small style="color: #72777a">'+globalTypeReport+' en <span style="font-weight: bold; color: #000">'+fullName+'</span></small>\n' +
                '              <span class="pull-right">'+percent+'%</span>\n' +
                '              <div class="c-progress">\n' +
                '                <div class="c-progress-bar" style="width: '+percent+'%; background: '+colorHex+' !important;">\n' +
                '                </div>\n' +
                '              </div></div>';

            $('#citiesList').append(layer);
        }
    });

    var data = google.visualization.arrayToDataTable(d);

    var view = new google.visualization.DataView(data);

    var title = 'Rating de las '+previewLimit+' ciudades con mayores ' + globalTypeReport;
    switch (cityChartDraw){
        case 'pie':
            var options = {
                title: title,
                is3D: true,
                chartArea:{left:10,top:20,width:"100%",height:"90%"},
                slices: colors
            };
            var chart = new google.visualization.PieChart(document.getElementById("chartContentCities"));
            break;
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

            var options = {
                title: title,
                bar: {groupWidth: "70%"},
                legend: { position: "none" },
                height: "500",
                vAxis: {
                    title: globalTypeReport,
                    gridlines: {count: gridlinesCount},
                    format: 'short',
                },
                hAxis: {
                    title: 'Ciudades',
                }

            };
            if(cityChartDraw == 'column'){
                var chart = new google.visualization.ColumnChart(document.getElementById("chartContentCities"));
            } else {
                var chart = new google.visualization.AreaChart(document.getElementById("chartContentCities"));
            }
            break;
    }

    /*switch (cityChartDraw) {
        case 'pie':
            var chart = new google.visualization.PieChart(document.getElementById("chartContentCities"));
            break;
        case 'column':
            var chart = new google.visualization.ColumnChart(document.getElementById("chartContentCities"));
            break;
        case 'line':
            var chart = new google.visualization.AreaChart(document.getElementById("chartContentCities"));
            break;
    }*/

    google.visualization.events.addListener(chart, 'ready', function () {
        imageChartCity = chart.getImageURI();
    });

    chart.draw(view, options);
}

$("#searchCity").keyup(function() {
    _this = this;
    $.each($("#citiesList > div"), function() {
        if ($(this).data('city').toLowerCase().indexOf($(_this).val().toLowerCase()) === -1)
            $(this).hide();
        else
            $(this).show();
    });
});

//############# [Month Chart] #################
var monthsChartDraw = 'pie';
$('.switchMonthChart').click(function () {
    monthsChartDraw = $(this).data('chart');

    if(!$(this).hasClass('btn-primary')) {
        $('.switchMonthChart').removeClass('btn-primary').addClass('btn-default');
        $(this).addClass('btn-primary');
        //var data = $(this).data('sort');
    }
    google.charts.setOnLoadCallback(drawChartMonths);
});

function processDataMonths() {
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

    var maxValue = 0;
    var maxMonth;
    $.each(monthsObj, function(index, v) {
        colorHex = colorHexa();
        var percent = Math.round((v.downloads / globalTotals) * 100);
        switch (monthsChartDraw){
            case 'pie':
                var text = v.name + ' ' + abbreviateNumber(v.downloads) + ' ' + globalTypeReport;
                var bar = [text , v.downloads];
                var color = {color: colorHex};
                colors.push(color);
                break;
            case 'column':
                var bar = [v.shortname, v.downloads, colorHex];
                break;
            case 'line':
                colorHex = '#A41C1E';
                var bar = [v.shortname, v.downloads, colorHex];
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

    var title = globalTypeReport + ' por mes';

    switch (monthsChartDraw){
        case 'pie':
            var options = {
                title: title,
                is3D: true,
                chartArea:{left:10,top:20,width:"100%",height:"90%"},
                slices: colors
            };
            var chart = new google.visualization.PieChart(document.getElementById("chartContentMonths"));
            break;
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

            var options = {
                title: title,
                bar: {groupWidth: "70%"},
                legend: { position: "none" },
                height: "500",
                vAxis: {
                    title: globalTypeReport,
                    gridlines: {count: gridlinesCount},
                    format: 'short',
                },
                hAxis: {
                    title: 'Meses',
                },
            };


            if(monthsChartDraw == 'column'){
                var chart = new google.visualization.ColumnChart(document.getElementById("chartContentMonths"));
            } else {
                var chart = new google.visualization.AreaChart(document.getElementById("chartContentMonths"));
            }
            break;
    }




    /*switch (monthsChartDraw) {
        case 'pie':
            var chart = new google.visualization.PieChart(document.getElementById("chartContentMonths"));
            break;
        case 'column':
            var chart = new google.visualization.ColumnChart(document.getElementById("chartContentMonths"));
            break;
        case 'line':
            var chart = new google.visualization.LineChart(document.getElementById("chartContentMonths"));
            break;
    }*/

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
                        var _text = '#' + text + ' ' + abbreviateNumber(totals) + ' ' + globalTypeReport;
                        var bar = [_text, totals];
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

    var dov = (globalTypeReport == 'descargas') ? 'descargados' : 'visitados';
    var ratingPercent = Math.round((ratingdov / globalTotals) * 100);
    var title = 'Rating de los '+ previewLimit +' números más ' + dov + ' ('+ ratingPercent +'%)';

    switch (numbersChartDraw){
        case 'pie':
            var options = {
                title: title,
                is3D: true,
                chartArea:{left:10,top:20,width:"100%",height:"90%"},
                slices: colors
            };

            var chart = new google.visualization.PieChart(document.getElementById("chartContentNumber"));
            break;
        case 'column':
        case 'line':
            view.setColumns([0, 1,
                { calc: "stringify",
                    sourceColumn: 1,
                    type: "string",
                    role: "annotation" },
                2]);

            var options = {
                title: title,
                bar: {groupWidth: "70%"},
                legend: { position: "none" },
                height: "500",
                vAxis: {
                    title: globalTypeReport,
                    gridlines: {count: gridlinesCount},
                    format: 'short',
                },
                hAxis: {
                    title: 'Números',
                },
            };

            if(numbersChartDraw == 'column') {
                var chart = new google.visualization.ColumnChart(document.getElementById("chartContentNumber"));
            } else {
                var chart = new google.visualization.AreaChart(document.getElementById("chartContentNumber"));
            }
            break;
    }

    /*downloads or views*/
    /*switch (numbersChartDraw) {
        case 'pie':
            var chart = new google.visualization.PieChart(document.getElementById("chartContentNumber"));
            break;
        case 'column':
            var chart = new google.visualization.ColumnChart(document.getElementById("chartContentNumber"));
            break;
        case 'line':
            var chart = new google.visualization.AreaChart(document.getElementById("chartContentNumber"));
            break;
    }*/


    google.visualization.events.addListener(chart, 'ready', function () {
        imageChartNumber = chart.getImageURI();
    });
    chart.draw(view, options);
}

//############## [Text Chart] #################
var textChartDraw = 'pie';
var textArrg = [];

$('.switchTextChart').click(function () {
    textChartDraw = $(this).data('chart');

    if(!$(this).hasClass('btn-primary')) {
        $('.switchTextChart').removeClass('btn-primary').addClass('btn-default');
        $(this).addClass('btn-primary');
    }

    /*switch (textChartDraw){
        case 'pie':
            $('#parentChartContentText').removeClass().addClass('col-md-12');
            $('#parentChartContentText').next('div').removeClass().addClass('col-md-6 col-md-offset-3');
            break;
        case 'column':
            $('#parentChartContentText').removeClass().addClass('col-md-8');
            $('#parentChartContentText').next('div').removeClass().addClass('col-md-4');
            break;
    }*/

    google.charts.setOnLoadCallback(drawChartText);
});

$("#searchText").keyup(function() {
    _this = this;
    $.each($("#textList > div"), function() {
        if ($(this).data('text').toLowerCase().indexOf($(_this).val().toLowerCase()) === -1)
            $(this).hide();
        else
            $(this).show();
    });
});

function processDataText(position) {
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

    /*var data = [];
    $.each(textArrg, function (index, v) {
        var d = [v.text, $.number(v.total)];
        data.push(d);
    });

    var x = $("#tableContentText").DataTable({
        data : data,
        columns: [
            { title: 'Texto' },
            { title: globalTypeReport }
        ],
        "order": [[ 1, "desc" ]],
        "language": {
            "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        }
    });*/
    if(textChartDraw == 'bar') {
        google.charts.load('current', {packages: ['corechart', 'bar']});
        //google.charts.setOnLoadCallback(drawCountryDownloadsChart);
    }
    //google.charts.setOnLoadCallback(drawChartText);
    google.charts.setOnLoadCallback(drawChartText);

    /*var chart = function() { drawChartText(textArrg) };
    google.charts.setOnLoadCallback(chart);*/
}

function drawChartText() {
    var _textArrg = textArrg.sort(dynamicSort("total"));

    var rows;

    if(textChartDraw == 'pie'){
        rows = [
            ['Texto', 'Totales'],
        ];
    } else {
        rows = [
            ['Texto', 'Totales', { role: 'style' }],
        ];
    }
    var colors = [];

    $('#textList').empty();

    var previewLimit = 10;
    var countPreview = 0;
    $.each(_textArrg, function(index, v) {
        var colorhexa = colorHexa();
        var totals = v.total;
        var text = v.text;
        if(totals > 0){
            if(countPreview < previewLimit) {

                if(textChartDraw == 'pie') {
                    var bar = [text, totals];
                    var color = {color: colorhexa};
                    colors.push(color);
                } else {
                    var bar = [text, totals, 'color: '+colorhexa];
                }
                rows.push(bar);
            }
            countPreview++;

            var per = (totals / globalTotals) * 100;

            if(per < parseFloat(1.0)) {
                per = 1;
            } else {
                per = Math.round(per);
            }
            var layer = '<div data-text="'+text+'"><h5 style="color: #72777a; font-weight: bold">'+abbreviateNumber(totals)+'</h5>\n' +
                '              <small style="color: #72777a">'+ globalTypeReport+' del <span style="font-weight: bold; color: #000">'+text+'</span></small>\n' +
                '              <span class="pull-right">'+per+'%</span>\n' +
                '              <div class="c-progress">\n' +
                '                <div class="c-progress-bar" style="width: '+per+'%; background: '+colorhexa+' !important">\n' +
                '                </div>\n' +
                '              </div></div>';


            $('#textList').append(layer);
        }
    });

    var data = google.visualization.arrayToDataTable(rows);
    var view = new google.visualization.DataView(data);

    var title = 'Rating ' + previewLimit + ' de principales ' + globalTypeReport;

    if(textChartDraw == 'pie'){
        var options = {
            title: title,
            is3D: true,
            chartArea:{left:10,top:20,width:"100%",height:"90%"},
            slices: colors
        };
        var chart = new google.visualization.PieChart(document.getElementById('chartContentText'));
    } else {
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
            title: title,
            bar: {groupWidth: "70%"},
            legend: { position: "none" },
            height: "500",
            vAxis: {
                title: globalTypeReport,
                gridlines: {count: gridlinesCount},
                format: 'short',
            },
            hAxis: {
                title: 'Textos',
            },
        };

        var chart = new google.visualization.ColumnChart(document.getElementById("chartContentText"));
    }

    google.visualization.events.addListener(chart, 'ready', function () {
        imageChartText = chart.getImageURI();
    });

    chart.draw(view, options);
}

function drawChartPie() {
    var _textArrg = textArrg.sort(dynamicSort("total"));


    var rows = [
        ['Texto/Revistas', 'Totales'],
    ];

    var previewLimit = 10;
    var countPreview = 0;
    $.each(_textArrg, function(index, v) {
        //console.log(v);
        color = colorHexa();
        var totals = v.total;
        var text = v.text;
        if(totals > 0){
            //console.log(v);
            if(countPreview < previewLimit) {
                //console.log(v);
                var bar = [text, totals];
                rows.push(bar);
            }
            countPreview++;
        }
    });

    var data = google.visualization.arrayToDataTable(rows);

    var options = {
        title: 'Rating ' + previewLimit + ' de principales ' + globalTypeReport,
        is3D: true,
        chartArea:{left:10,top:20,width:"100%",height:"90%"}
    };

    var chart = new google.visualization.PieChart(document.getElementById('chartContentText'));

    chart.draw(data, options);
}

function drawChartText_() {
    var title;
    //console.log();
    var _textArrg = textArrg.sort(dynamicSort("total"));


    var d = [
        ['Texto/Revistas', 'Totales', { role: 'style' }],
    ];

    var previewLimit = 10;
    var countPreview = 0;
    $.each(_textArrg, function(index, v) {
        //console.log(v);
        color = colorHexa();
        var totals = v.total;
        var text = v.text;
        if(totals > 0){
            //console.log(v);
            if(countPreview < previewLimit) {
                //console.log(v);
                var bar = [text, totals, 'color: '+color];
                d.push(bar);
            }
            countPreview++;
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

    title = '';

    var options = {
        title: title,
        bar: {groupWidth: "70%"},
        legend: { position: "none" },
        height: "500",
        vAxis: {
            gridlines: {count: gridlinesCount},
            format: 'short',
        },
    };

    if(textChartDraw == 'bar') {
        var chart = new google.visualization.BarChart(document.getElementById("chartContentText"));
    } else {
        var chart = new google.visualization.ColumnChart(document.getElementById("chartContentText"));
    }

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
    var icon, typeReport;
    var pass = false;

    switch (chart) {
        case 'total':
            image = imageChartTotal;
            name = globalTypeReport+'-totales';
            pass = true;
            break;
        case 'country':
            image = imageChartCountry;
            name = globalTypeReport+'-por-país';
            typeReport = 'País';
            icon = '<i class="fa fa-globe" style="color: dodgerblue;"></i>';
            pass = true;
            break;
        case 'city':
            image = imageChartCity;
            name = globalTypeReport+'-por-ciudad';
            typeReport = 'Ciudad';
            icon = '<i class="fa fa-building" style="color: cadetblue;"></i>';
            pass = true;
            break;
        case 'month':
            image = imageChartMonth;
            name = globalTypeReport+'-por-mes';
            typeReport = 'Mes';
            icon = '<i class="fa fa-calendar" style="color: darkred"></i>';
            pass = true;
            break;
        case 'number':
            image = imageChartNumber;
            name = globalTypeReport+'-por-número';
            typeReport = 'Número';
            icon = '<i class="fa fa-hashtag" style="color: darkgreen"></i>';
            pass = true;
            break;
        case 'text':
            image = imageChartText;
            name = globalTypeReport+'-por-texto';
            typeReport = 'Texto';
            icon = '<i class="fa fa-font"></i>';
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
            case 'embed':
                //var chartTypeReport = chart.charAt(0).toUpperCase() + chart.slice(1);
                var data = {'_token': CSRF_TOKEN, 'image': image};

                /*$('#shareChartsTypeReport').html(icon+' '+typeReport);
                $('#shareChartsModal').modal('show');*/
                $.ajax({
                    method: 'POST',
                    url   : 'createchartimage',
                    data  : data,
                    dataType  : 'JSON',
                    beforeSend: function() {
                        fadeInLoader();
                    },
                    success   : function(response){
                        if(response.status == 'success') {
                            var public_url = 'http://stats.escire.net/public/chartimages/'+response.fileName;
                            var codeToEmbed = '<iframe width="700" height="500" src="'+public_url+'" frameborder="0" allowfullscreen></iframe>';
                            $('#shareChartsTypeReport').html(icon+' '+typeReport);
                            $('#shareChartsCodeTag').text(codeToEmbed);
                            $('#shareChartsModal').modal('show');
                            fadeOutLoader();
                        }

                        if(response.status == 'error'){
                            alert(response.message);
                        }
                    },

                });
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

function copyToClipboard(element_id) {
    var aux = document.createElement("input");
    aux.setAttribute("value", $('#'+element_id).text());//document.getElementById(element_id).innerHTML);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    $('#shareChartsAlert').slideDown('slow');
}

$('#shareChartsModal').on('hide.bs.modal', function () {
    $('#shareChartsAlert').css('display', 'none');
});


var typeReportArray = [];
$('#chartOptions').click(function () {
    //chartList

    var chartList = $('#chartList');
    chartList.empty();
    headers.forEach(function (value, index) {
        if(value != 'Tipo' && value != 'Revista') {
            var orderId, icon;
            switch (value) {
              case 'Total':
                orderId = 1;
                icon = '<i class="fa fa-trophy" style="color: gold;"></i>';
                break;
              case 'País':
                orderId = 2;
                icon = '<i class="fa fa-globe" style="color: dodgerblue;"></i>';
                break;
              case 'Ciudad':
                orderId = 3;
                icon = '<i class="fa fa-building" style="color: cadetblue;"></i>';
                break
              case 'Mes':
                orderId = 4;
                icon = '<i class="fa fa-calendar" style="color: darkred"></i>';
                break;
              case 'Número':
                orderId = 5;
                icon = '<i class="fa fa-hashtag" style="color: darkgreen"></i>';
                break;
              case 'Texto':
                orderId = 6;
                icon = '<i class="fa fa-font"></i>';
                break;
            }
            var input = '<li class="list-group-item" id="orderId'+orderId+'"><label style="width: 100%;">'+icon+' '+value+' <input type="checkbox" name="checkChart" data-index="'+index+'" value="'+value+'" class="pull-right"></label></li>';
            chartList.append(input);
        }
    });

    var elements = chartList.children('li').get();
    elements.sort(function(a,b) {
      var A = $(a).attr('id');
      var B = $(b).attr('id');
      return (A < B) ? -1 : (A > B) ? 1 : 0;
    });

    elements.forEach(function(element) {
      chartList.append(element);
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
