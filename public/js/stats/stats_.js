//config required for each views
var displayDateES, displayDateEN, translate = [];
switch (currentLang) {
	case 'es':
		for(var i in esObject) {
			translate[i] = esObject[i];
		}
        //data for view
		break;
	case 'en':
		for(var i in enObject) {
			translate[i] = enObject[i];
		}
        //data for view
		break;
}
// end config required for each views

var descargas = 0;//Descargas totales
var color;

var globalCSVID = 0;

var globalTypeReport;

var globalTotals = 0;
var globaltotalCountries = 0;
var globalFileType;

//{text: ".NET", weight: 13},
var wordsCountry = [];
var wordsCity = [];
var wordsMonth = [];
var wordsNumber = [];
var wordsRoles = []

var imageChartType,
    imageChartText,
    imageChartJournal,
    imageChartNumber,
    imageChartCity,
    imageChartCountry,
    imageChartMonth,
    imageChartTotal;

var imageChartRoles,
    imageChartGenders;


/*Deprecated*/
var totalDownloadsImageChart,
    totalDownloadsMonthImageChart,
    countryDownloadsImageChart;
/*-------------*/

var gridlinesCount = 20;

var headers = [];
var headersRolesArray = [];

var indexArray = [];//almacena los índices del documento seleccionados cuando se dio de alta
var indexArrayRoles = []
var dataSet = [];//alamacena todos los datos parseados del csv
var showCharts = [];

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

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
        url: "getdatafiles",
        data: data,
        dataType: "JSON",
        success: function(response) {
            globalCSVID = response.filesData.file_id;
            var fileIndices = response.filesData.file_indices;
            var fileIndicesRoles = response.filesData.file_role_indices;
            indexArray = JSON.parse("[" + fileIndices + "]");
            indexArrayRoles = JSON.parse("[" + fileIndicesRoles + "]");
            globalFileType = response.filesData.file_type;

            var typeReportIndex = response.filesData.file_report_index;
            var typeReport = response.filesData.file_report_name;
            var fileFrontName = response.filesData.file_front_name;
            //$("#titlePage").text(typeReport);

            var iconFileSrc = (globalFileType == 'csv') ? 'images/csv-file-primary-color.svg' :
                                                   'images/xml-file-primary-color.png';

            $('.seeAgain').find('img').attr('src', public_path + iconFileSrc);
            $('.fileNamePanels').text(fileFrontName);
            $('.typeReportPanels').text(typeReport);

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
                case 5:
                    globalTypeReport = 'Usuarios';
                    break;
            }

            google.charts.load("current", {packages:['corechart']});
            switch (globalFileType) {
                case 'csv':
                    generateArraysCSV();
                    break;
                case 'xml':
                    generateArraysXML();
                    break;
            }
        }
    });
}

function generateArraysXML(){
    fadeOutLoader();
    var data = {'_token': CSRF_TOKEN, 'fileName': fileName, 'switchCase': 'stats'};

    //var usersDataSet = {};
    //var usersDataSet = {'userType': '', 'totals': 0, 'national': 0, 'international': 0};
    //var usersDataSet = {};
    //var usersDataSet = [];
    var showOnlyGraph = [];

    //cabeceras del documento
    headers = ['Roles', 'Géneros', 'País'];
    indexArrayRoles.forEach(function (values) {
        values.forEach(function (value) {
            //var index = value.i;
            showOnlyGraph.push(value.v);
        });
    });

    var chartCountry = 0,
        chartGenders = 0,
        chartRoles = 0;

    indexArray.forEach(function (values) {
        values.forEach(function (values) {
            switch (values.v) {
                case 'País':
                    chartCountry = 1;
                    break;
                case 'Géneros':
                    chartGenders = 1;
                    break;
                case 'Roles':
                    chartRoles = 1;
                    break;

            }
        });
    });

    $.post('../../readxml', data, function(response) {
        $.each(response, function(index, v){
            var country = v.country;
            var gender = v.gender;

            var counterRoles = 0;
            $.each(v.roles, function(index, v){
                counterRoles++;
            });

            $.each(countriesObj, function(index, v) {
                if(country == ''){
                    if(v.code == 'UNK'){
                        v.downloads = v.downloads + counterRoles;
                    }
                } else {
                    if(country == v.code) {
                        v.downloads = v.downloads + counterRoles;
                    }
                }
            });

            $.each(v.roles, function(index, v){
                var existValue = 0,
                    existData = 0,
                    allowedType = 0;

                for (i in headersRolesArray){
                    if(headersRolesArray[i] == v){
                        existValue = 1;
                    }
                }

                if(existValue == 0){
                    headersRolesArray.push(v);
                }

                for(var i in showOnlyGraph){
                    if(v == showOnlyGraph[i]){
                        allowedType = 1;
                    }
                }

                // if(allowedType){
                //     for(var i in usersDataSet){
                //         if(i == v){
                //             existData = 1;
                //             usersDataSet[i] = parseInt(usersDataSet[i]) + 1;
                //         }
                //     }
                //
                //     if(existData == 0){
                //         usersDataSet[v] = 1;
                //     }
                // }

                if(allowedType){
                    if(country == ''){
                        country = 'UNK';
                    }

                    if(rolesArrg.length == 0){
                        var data = {'role': v, 'totals': 1, 'countries': Array(country)};
                        rolesArrg.push(data);
                    } else {
                        $.each(rolesArrg, function(ind, val){
                            var role = val.role
                            var countries = val.countries;
                            if(role == v){
                                existData = 1;
                                val.totals = val.totals + 1;
                                countries.push(country);
                            }
                        });

                        if(existData == 0) {
                            var data = {'role': v, 'totals': 1, 'countries': Array(country)};
                            rolesArrg.push(data);
                        }
                    }
                }

                // var existValue = 0;
                // for (i in rolesArray){
                //     if(rolesArray[i] == v){
                //         existValue = 1;
                //     }
                // }
                // if(existValue == 0){
                //     rolesArray.push(v);
                // }

                globalTotals = globalTotals + 1;

            });

            if(chartGenders){
                if(gender == ''){
                    gendersObj[0].totals = gendersObj[0].totals + counterRoles;
                } else {
                    $.each(gendersObj, function(index, v) {
                        if(gender == v.shortname) {
                            v.totals = v.totals + counterRoles;
                        }
                    });
                }
            }
        });

        // $.each(usersDataSet, function(index, v) {
        //     //console.log(v);
        //     var userType = index;
        //     var totals = v;
        //     var data = {'userType': userType, 'totals': totals};
        //     rolesArrg.push(data);
        // });

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

        switchData();
    });
}

function generateArraysCSV() {
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
            });
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
    var panelTitle;
    var panelTitleCloudWords = 'Nube de palabras de ';
    // switch (globalTypeReport) {
    //     case 'Descargas':
    //         panelTitle += globalTypeReport + '';
    //         break;
    //     case 'Visitas':
    //         panelTitle += globalTypeReport + '';
    //         break;
    //     case 'Usuarios':
    //         panelTitle = 'Países con ' + globalTypeReport + ' registrados';
    //         panelTitleCloudWords += ' los países donde hay ' + globalTypeReport;
    //         break;
    //     default:
    //
    // }

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
                    $("#panelTitleCity").text(panelTitle + ' ' + v.v);
                    $('#liMenuChartCity').show();
                    processDataCities();
                    break;
                case 'País':
                    switch (globalTypeReport) {
                        case 'Descargas':
                            panelTitle = 'Países que realizan descargas';
                            panelTitleCloudWords += ' los países que realizan descargas';
                            break;
                        case 'Visitas':
                            panelTitle = 'Países donde realizan visitas';
                            panelTitleCloudWords += ' los países que realizan visitas';
                            break;
                        case 'Usuarios':
                            panelTitle = 'Países con usuarios registrados';
                            panelTitleCloudWords += ' los países con usuarios registrados';
                            break;
                        default:

                    }

                    $("#panelTitleCountries").text(panelTitle);
                    $('#panelTitleCloudWordsCountry').text(panelTitleCloudWords);
                    $("#chartPanelCountries").show();
                    $('#liMenuChartCountry').show();
                    processDataCountries();
                    break;
                case 'Mes':
                    $("#chartPanelMonths").show();
                    $("#panelTitleMonths").text(panelTitle);
                    $('#liMenuChartMonth').show();
                    processDataMonths();
                    break;
                case 'Total':
                    $("#chartPanelTotal").show();
                    $("#panelTitleTotal").text(v.v);
                    $('#liMenuChartTotal').show();
                    processDataTotal(v.i);
                    break;
                case 'Roles':
                    $('#panelTitleRoles').text(panelTitle + 'Tipo');
                    $("#chartPanelRoles").show();
                    $('#liMenuChartRole').show();
                    processDataRoles();
                    break;
                case 'Géneros':
                    $('#panelTitleGenders').text(panelTitle + ' ' + v.v);
                    $('#chartPanelGenders').show();
                    $('#liMenuChartGender').show();
                    processDataGenders();
                    break;
            }// end switch
        });
    });

    if(isMobile.any()) {

    } else {
        $("#menuOptionCharts").css('display', 'block').addClass('active').find('ul').addClass('in');
    }

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
        //'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
        'mapsApiKey': 'AIzaSyCG0ClvEMX6LqvqnD-amrqlMriHgiKfb3o'
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
    switch (globalTypeReport) {
        case 'Visitas':
            $('#itotalType, .itotalTypeUnk, #mainCountryPorcentIcon').addClass('fa-eye');
            break;
        case 'Descargas':
            $('#itotalType, .itotalTypeUnk, #mainCountryPorcentIcon').addClass('fa-download');
            break;
        case 'Usuarios':
            $('#itotalType, .itotalTypeUnk, #mainCountryPorcentIcon').addClass('fa-users');
            break;
        default:
    }

    $('#totalType').text(abbreviateNumber(globalTotals)).next('span').text(' '+globalTypeReport);

    /*********************/
    var str = mainCountry+' '+abbreviateNumber(mainTotals)+' ';
    $('#mainCountry').text(str).next('span').text(globalTypeReport);
    $('#mainCountryProgress').css('width', mainPercent+'%');
    $('#mainCountryPorcent').text(mainPercent+'%');
    /*********************/
    $('#totalTypeUnk').text(abbreviateNumber(unknowTotals)).next('span')
        .text(' '+globalTypeReport + ' sin especificar');

    $('#totalTypeUnkProgress').css('width', unknowPercent+'%');
    $('#totalTypeUnkPorcent').text(unknowPercent+ '%')


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

    var countCities = 0;
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

            var word = {text: city, weight: totals};
            wordsCity.push(word);

            countCities++;
        }
    });

    $('#totalCities').text($.number(countCities));
    $('#totalCountriesCities').text(globaltotalCountries);

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
                height: '500',
                vAxis: {
                    title: globalTypeReport,
                    gridlines: {count: gridlinesCount},
                    format: 'short',
                },
                hAxis: {
                    title: 'Ciudades',
                },
                chartArea:{left:50,top:20,width:"100%",height:"75%"},

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
    $('#cloudWordsCity').jQCloud(wordsCity);
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
            maxMonth = v.name;
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

    //$('#totalMonth').text(abbreviateNumber(globalTotals) + ' ' + globalTypeReport).next('span').text($.number(globalTotals));
    $('#totalMonth').text(abbreviateNumber(globalTotals)).next('span').text(globalTypeReport);
    $('#totalMonthLongFormat').text($.number(globalTotals));

    // var mData = maxMonth;
    // var maxName = mData[0];
    // var maxTotals = mData[1];
    var maxName = maxMonth;
    var maxTotals = maxValue;
    var percent = Math.round((maxTotals / globalTotals) * 100);


    //$('#monthUp').text(maxName + ' ' + abbreviateNumber(maxTotals) + ' ' + globalTypeReport).next('span').text(percent + '%');

    $('#monthUp').text(maxName + ' ' + abbreviateNumber(maxTotals)).next('span').text(globalTypeReport);
    $('#totalMonthUpLongFormat').text(percent + '%');
    $('#totalMonthUpProgress').css('width', percent + '%');

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
                vAxis: {
                    title: globalTypeReport,
                    gridlines: {count: gridlinesCount},
                    format: 'short',
                },
                hAxis: {
                    title: 'Meses',
                },
                chartArea:{left:50,top:20,width:"950%",height:"80%"},
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

// function drawChartPie() {
//     var _textArrg = textArrg.sort(dynamicSort("total"));
//
//
//     var rows = [
//         ['Texto/Revistas', 'Totales'],
//     ];
//
//     var previewLimit = 10;
//     var countPreview = 0;
//     $.each(_textArrg, function(index, v) {
//         //console.log(v);
//         color = colorHexa();
//         var totals = v.total;
//         var text = v.text;
//         if(totals > 0){
//             //console.log(v);
//             if(countPreview < previewLimit) {
//                 //console.log(v);
//                 var bar = [text, totals];
//                 rows.push(bar);
//             }
//             countPreview++;
//         }
//     });
//
//     var data = google.visualization.arrayToDataTable(rows);
//
//     var options = {
//         title: 'Rating ' + previewLimit + ' de principales ' + globalTypeReport,
//         is3D: true,
//         chartArea:{left:10,top:20,width:"100%",height:"90%"}
//     };
//
//     var chart = new google.visualization.PieChart(document.getElementById('chartContentText'));
//
//     chart.draw(data, options);
// }

// function drawChartText_() {
//     var title;
//     //console.log();
//     var _textArrg = textArrg.sort(dynamicSort("total"));
//
//
//     var d = [
//         ['Texto/Revistas', 'Totales', { role: 'style' }],
//     ];
//
//     var previewLimit = 10;
//     var countPreview = 0;
//     $.each(_textArrg, function(index, v) {
//         //console.log(v);
//         color = colorHexa();
//         var totals = v.total;
//         var text = v.text;
//         if(totals > 0){
//             //console.log(v);
//             if(countPreview < previewLimit) {
//                 //console.log(v);
//                 var bar = [text, totals, 'color: '+color];
//                 d.push(bar);
//             }
//             countPreview++;
//         }
//     });
//
//     var data = google.visualization.arrayToDataTable(d);
//
//     var view = new google.visualization.DataView(data);
//     view.setColumns([
//         0,
//         1,
//         {
//             calc: "stringify",
//             sourceColumn: 1,
//             type: "string",
//             role: "annotation"
//         },
//         2
//     ]);
//
//     title = '';
//
//     var options = {
//         title: title,
//         bar: {groupWidth: "70%"},
//         legend: { position: "none" },
//         height: "500",
//         vAxis: {
//             gridlines: {count: gridlinesCount},
//             format: 'short',
//         },
//     };
//
//     if(textChartDraw == 'bar') {
//         var chart = new google.visualization.BarChart(document.getElementById("chartContentText"));
//     } else {
//         var chart = new google.visualization.ColumnChart(document.getElementById("chartContentText"));
//     }
//
//     google.visualization.events.addListener(chart, 'ready', function () {
//         imageChartText = chart.getImageURI();
//     });
//
//     chart.draw(view, options);
// }


//############## [Type Total] #################
function processDataTotal(position) {
    //totals

    switch (globalTypeReport) {
        case 'Visitas':
            $('#panelTotalIcon, #panelUnknowsIcon').addClass('fa-eye');
            break;
        case 'Descargas':
            $('#panelTotalIcon, #panelUnknowsIcon').addClass('fa-download');
            break;
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
    // var drawChartT = function(){ drawChartTotal(globalTotals) };
    // google.charts.setOnLoadCallback(drawChartT);
}

// function drawChartTotal(countTotals) {
//     var data = google.visualization.arrayToDataTable([
//         ["option", "total", { role: "style" } ],
//         ["Totales", countTotals, colorHexa()],
//     ]);
//
//     var view = new google.visualization.DataView(data);
//     view.setColumns([
//         0,
//         1,
//         {
//             calc: "stringify",
//             sourceColumn: 1,
//             type: "string",
//             role: "annotation"
//         },
//         2
//     ]);
//
//     var options = {
//         title: "Descargas Totales: " + $.number(countTotals),
//         bar: {groupWidth: "30%"},
//         legend: { position: "none" },
//         height: "500",
//         vAxis: {
//             gridlines: {count: 30},
//             format: 'short',
//             viewWindow: {
//                 max:countTotals,
//             }
//         },
//         animation:{
//             duration: 1000,
//             easing: 'out',
//         },
//
//     };
//
//     var chart = new google.visualization.ColumnChart(document.getElementById("chartContentTotal"));
//
//     google.visualization.events.addListener(chart, 'ready', function () {
//         imageChartTotal = chart.getImageURI();
//     });
//     chart.draw(view, options);
// }


//############## [Type Roles] #################
var rolesChartDraw = 'column';
var rolesTypeColumn = 'stacked';
var cloudWordsRolesStatus = 0
$('.switchUserChart').click(function () {
    rolesChartDraw = $(this).data('chart');
    rolesTypeColumn = $(this).data('typecolumn');

    if(!$(this).hasClass('btn-primary')) {
        $('.switchUserChart').removeClass('btn-primary').addClass('btn-default');
        $(this).addClass('btn-primary');
    }
    $('#relesMainChart').show();
    $('#rolesMapChart').hide();
    google.charts.setOnLoadCallback(drawChartRoles);
});

function processDataRoles() {
    google.charts.setOnLoadCallback(drawChartRoles);
}

var rolesArrg = [];
function drawChartRoles() {
    var _rolesArrg = rolesArrg.sort(dynamicSort("totals"));

    var d, colors, isStacked;

    switch (rolesChartDraw) {
        case 'pie':
            d = [
                ['Usuarios', 'total'],
            ];
            colors = [];
            break;
        case 'column':
            // d = [
            //     ['Usuarios', 'total', { role: 'style' }],
            // ];
            d = [
                ['Usuarios', 'Nacional', 'Internacional', 'Desconocido', { role: 'annotation' }],
            ];
            colors = ['#006D49', '#F6E300', '#E6E7E9'];
            isStacked = rolesTypeColumn == 'stacked' ? true : false;
            break;
    }

    wordsRoles = [];

    $('#usersList').empty();
    $.each(_rolesArrg, function(index, v){

        colorHex = colorHexa();

        var roleType = v.role;
        var totals = v.totals;
        //console.log(v);
        var countries = v.countries;

        var totalNational = 0;
        var totalUnknown = 0;
        var totalInternational = 0;

        for(i in countries) {
            switch (countries[i]) {
                case 'MX':
                    totalNational = totalNational + 1;
                    break;
                case 'UNK':
                    totalUnknown = totalUnknown + 1;
                    break;
                default:
                    totalInternational = totalInternational + 1;
            }
        }

        var per = (totals / globalTotals) * 100;
        if(per < parseFloat(1.0)) {
            per = 1;
        } else {
            per = Math.round(per);
        }

        switch (rolesChartDraw){
            case 'pie':
                var text = roleType + '('+totals+')' + ' ' + globalTypeReport;
                var bar = [text, totals];
                d.push(bar);
                var color = {color: colorHex};
                colors.push(color);

                var per = (totals / globalTotals) * 100;
                if(per < parseFloat(1.0)) {
                    per = 1;
                } else {
                    per = Math.round(per);
                }

                var layer = '<div><h5 style="color: #72777a; font-weight: bold">'+abbreviateNumber(totals)+'</h5>\n' +
                    '              <small style="color: #72777a">'+ globalTypeReport+' de rol <span style="font-weight: bold; color: #000">'+roleType+'</span></small>\n' +
                    '              <span class="pull-right">'+per+'% Totales</span>\n' +

                    '              <div class="c-progress">\n' +
                    '                <div class="c-progress-bar" style="width: '+per+'%; background: '+colorHex+' !important;"></div>\n' +

                    '              </div></div>';

                $("#usersList").append(layer);
                break;
            case 'column':
                var bar = [roleType+'('+totals+')', totalNational, totalInternational, totalUnknown, ''];
                d.push(bar);

                var perNat = (totalNational / totals) * 100;
                var perInternat = (totalInternational / totals) * 100;
                var perUnknown = (totalUnknown / totals) * 100;

                // if(perNat < parseFloat(1.0)) {
                //     perNat = 1;
                // } else {
                //     perNat = Math.round(perNat);
                // }
                perNat = Math.round(perNat);

                // if(perInternat < parseFloat(1.0)) {
                //     perInternat = 1;
                // } else {
                //     perInternat = Math.round(perInternat);
                // }
                perInternat = Math.round(perInternat);

                // if(perUnknown < parseFloat(1.0)){
                //     perUnknown = 1;
                // } else {
                //     perUnknown = Math.round(perUnknown);
                // }
                perUnknown = Math.round(perUnknown);

                var layer = '<div><h5 style="color: #72777a; font-weight: bold">'+abbreviateNumber(totals)+'</h5>\n' +
                    '              <small style="color: #72777a">'+ globalTypeReport+' de rol <span style="font-weight: bold; color: #000">'+roleType+'</span></small>\n' +
                    '              <span class="pull-right">'+per+'% Totales</span><br>\n' +
                    '              <div style="width:100%"><small style="font-weight: bold; color: #000">Nacional: '+abbreviateNumber(totalNational)+'</small><small class="pull-right">'+perNat+'%</small></div>'+
                    '              <div style="width:100%"><small style="font-weight: bold; color: #000">Intenacional: '+abbreviateNumber(totalInternational)+'</small><small class="pull-right">'+perInternat+'%</small></div>'+
                    '              <div style="width:100%"><small style="font-weight: bold; color: #000">Desconocido: '+abbreviateNumber(totalUnknown)+'</small><small class="pull-right">'+perUnknown+'%</small></div>'+
                    '              <div class="c-progress">\n' +
                    '                <div class="c-progress-bar" style="width: '+perNat+'%; background: '+colors[0]+' !important; float:left"></div>\n' +
                    '                <div class="c-progress-bar" style="width: '+perInternat+'%; background: '+colors[1]+' !important; float:left"></div>\n' +
                    '              </div></div>';


                $("#usersList").append(layer);
                break;
        }

        var word = {text: roleType, weight: totals};
        wordsRoles.push(word);
    });

    var data = google.visualization.arrayToDataTable(d);
    var view = new google.visualization.DataView(data);
    var title = 'Roles de Usuarios registrados';

    switch (rolesChartDraw){
        case 'pie':
            var options = {
                title: title,
                is3D: true,
                chartArea:{left:10, top:20, width:"100%", height:"90%"},
                slices: colors
            };
            var chart = new google.visualization.PieChart(document.getElementById("chartContentUsers"));
            break;
        case 'column':
            // view.setColumns([
            //     0,
            //     1,
            //     // {
            //     //     calc: "stringify",
            //     //     sourceColumn: 1,
            //     //     type: "string",
            //     //     role: "annotation"
            //     // },
            //     2,
            //     3
            // ]);

            var options = {
                title: title,
                bar: {groupWidth: "70%"},
                legend: { position: "top" },
                height: "500",
                vAxis: {
                    title: globalTypeReport,
                    gridlines: {count: gridlinesCount},
                    format: 'short',
                },
                hAxis: {
                    title: 'Roles',
                },
                isStacked: Boolean(isStacked),
                series: {
                    0:{color:colors[0]},
                    1:{color:colors[1]},
                    2:{color:colors[2]},
                },
                chartArea:{left:50, top:50, width:"100%", height:"80%"},
            };
            if(rolesChartDraw == 'column'){
                var chart = new google.visualization.ColumnChart(document.getElementById("chartContentUsers"));
            } else {
                //var chart = new google.visualization.AreaChart(document.getElementById("chartContentUsers"));
            }
            break;
    };

    google.visualization.events.addListener(chart, 'ready', function () {
        imageChartRoles = chart.getImageURI();
    });
    chart.draw(view, options);

    //chart.legend.updateState(false);

    google.visualization.events.addListener(chart, 'select', selectHandle)

    function selectHandle(e) {
        var selection = chart.getSelection();
        var column,
            row,
            totals,
            index,
            role,
            allCountries,
            countries = [];
            national = 1;
            passes = 0;
        //var message = '';

        for (var i = 0; i < selection.length; i++) {
            var item = selection[i];

            column = item.column;
            row = item.row;
            if (item.row != null && item.column != null) {
              totals = data.getFormattedValue(item.row, item.column);
            }



            // if(row != null){
            //     passes = 1;
            // }
            // if (item.row != null && item.column != null) {
            //   var str = data.getFormattedValue(item.row, item.column);
            //   message += '{row:' + item.row + ',column:' + item.column + '} = ' + str + '\n';
            // } else if (item.row != null) {
            //   var str = data.getFormattedValue(item.row, 0);
            //   message += '{row:' + item.row + ', column:none}; value (col 0) = ' + str + '\n';
            // } else if (item.column != null) {
            //   var str = data.getFormattedValue(0, item.column);
            //   message += '{row:none, column:' + item.column + '}; value (row 0) = ' + str + '\n';
            // }
        }
        // if (message == '') {
        //     message = 'nothing';
        // }
        //alert(message);
        //if(Boolean(passes)){
        if(row != null){
            index = row;
            role = _rolesArrg[index].role
            allCountries = _rolesArrg[index].countries;
            switch (column) {
                case 1:
                    //alert('Nacional');
                    allCountries = _rolesArrg[index].countries;
                    var counter = 0;
                    $.each(allCountries, function(index, v){
                        if(v == 'MX') {
                            counter++;
                        }
                    });

                    var obj = {code: 'MX', totals: counter};
                    countries.push(obj);
                    passes = 1;
                    break;
                case 2:
                    //alert('Internacional');
                    allCountries = _rolesArrg[index].countries;
                    $.each(allCountries, function(index, v){
                        if(v != 'MX' && v != 'UNK'){
                            if(countries.length < 1){
                                var obj = {code: v, totals: 1};
                                countries.push(obj);
                            } else {
                                var foundValue = false;
                                for(var i in countries) {
                                    if(countries[i].code == v){
                                        foundValue = true;
                                        countries[i].totals = countries[i].totals + 1;
                                    }
                                }

                                if(!Boolean(foundValue)){
                                    var obj = {code: v, totals: 1};
                                    countries.push(obj);
                                }
                            }
                        }
                    });
                    national = 0;
                    passes = 1;
                    break;
            }//end switch

            // console.log(countries);
            if(passes){
                var drawMap = function(){ drawRolesMap(countries, totals, role, national) };
                google.charts.setOnLoadCallback(drawMap);


            }

        }
    }

    if(Boolean(cloudWordsRolesStatus)){
        $('#cloudWordsRoles').jQCloud('update', wordsRoles);
    } else {
        $('#cloudWordsRoles').jQCloud(wordsRoles);
    }

}

function drawRolesMap(countries, gtotals, role, national) {
    $('#relesMainChart').hide();
    $('#rolesMapChart').show();
    $('#rolesListMaps').empty();
    $('.switchUserChart').removeClass('btn-primary').addClass('btn-default');
    wordsRoles = [];
    cloudWordsRolesStatus = 1;
    //var wordsCountryRole = [];

    var _countries = countries.sort(dynamicSort("totals"));
    var d;
    if(national){
        d = [
            ['Country', 'Totals'],
        ]
    } else {

        d = [
            ['Country', 'Totals'],
        ]
    }

    var countriesCounter = 0;
    $.each(_countries, function(index, v){
        var code = v.code;
        var totals = v.totals;
        var country,
            colorHex;

        if(national){
            d.push([code, totals]);
            colorHex = '#00724B';
        } else {
            d.push([code, totals]);
            colorHex = '#fff310';
        }

        for(i in countriesObj){
            var _code = countriesObj[i].code;
            if(_code == code){
                country = countriesObj[i].name;
            }
        }


        var per = Math.round((totals / gtotals) * 100);

        var layer = '<div data-country="'+country+'"><h5 style="color: #72777a; font-weight: bold">'+abbreviateNumber(totals)+'</h5>\n' +
            '              <small style="color: #72777a">'+ role+' de <span style="font-weight: bold; color: #000">'+country+'</span></small>\n' +
            '              <span class="pull-right">'+per+'%</span>\n' +
            '              <div class="c-progress">\n' +
            '                <div class="c-progress-bar" style="width: '+per+'%; background: '+colorHex+' !important;">\n' +
            '                </div>\n' +
            '              </div></div>';

        $("#rolesListMaps").append(layer);

        countriesCounter++;

        // var word = {text: country, weight: totals};
        // wordsCountryRole.push(word);
        var word = {text: country, weight: totals};
        wordsRoles.push(word);
    });

    var data = google.visualization.arrayToDataTable(d);

    var textLegend;
    if(national){
        var options = {
            //region: 'MX',
            region: '013',
            height: "400",
            colorAxis: {colors: ['#00724B', '#00724B']},
        };
        textLegend = '<strong>'+gtotals+'<strong> Usuarios de rol <strong>' + role + '</strong> en <strong>' + countriesCounter + ' en México</strong>';
    } else {
        var options = {
            height: "400",
            colorAxis: {colors: ['#fff310', '#dcd100']},
        };
        var foo = (countriesCounter > 1) ? 'países' : 'país';
        textLegend = '<strong>'+gtotals+'<strong> Usuarios de rol <strong>' + role + '</strong> en <strong>' + countriesCounter + ' '+ foo +'</strong>';

    }

    $('#rolesMapLegend').html(textLegend);

    var chart = new google.visualization.GeoChart(document.getElementById('chartContentRolesMaps'));

    chart.draw(data, options);
    $('#cloudWordsRoles').jQCloud('update', wordsRoles);
}

//############## [Type Genders] #################
var gendersChartDraw = 'column';
$('.switchGenderChart').click(function () {
    gendersChartDraw = $(this).data('chart');
    if(!$(this).hasClass('btn-primary')) {
        $('.switchGenderChart').removeClass('btn-primary').addClass('btn-default');
        $(this).addClass('btn-primary');
    }
    google.charts.setOnLoadCallback(drawChartGenders);
});


function processDataGenders() {
    google.charts.setOnLoadCallback(drawChartGenders);
}

function drawChartGenders(){
    var _gendersObj = gendersObj.sort(dynamicSort("totals"));

    var d;
    switch (gendersChartDraw) {
        case 'pie':
            d = [
                ['Usuarios', 'total'],
            ];
            break;
        case 'column':
            d = [
                ['Usuarios', 'total', { role: 'style' }],
            ];
            break;
    }

    var colors = [];

    $.each(_gendersObj, function(index, v){
        //var colorHex = colorHexa();
        var gEsName = v.esname;
        var gEnName = v.enname;
        var shortName = v.shortname;
        var totals = v.totals;

        //definir idioma
        var gender = gEsName;
        var colorHex =  shortName == 'M' ? '#00BFEC' :
                        shortName == 'F' ? '#E15BB7' :
                        '#00adc1';

        switch (gendersChartDraw){
            case 'pie':
                var text = gender + '('+totals+')';
                var bar = [text, totals];
                d.push(bar);

                var color = {color: colorHex};
                colors.push(color);
                break;
            case 'column':
                var bar = [gender, totals, 'color: '+colorHex];
                d.push(bar);
                break;
        }

        var per = (totals / globalTotals) * 100;
        if(per < parseFloat(1.0)) {
            per = 1;
        } else {
            per = Math.round(per);
        }

        var layer = '<div><h5 style="color: #72777a; font-weight: bold">'+abbreviateNumber(totals)+'</h5>\n' +
            '              <small style="color: #72777a">'+ globalTypeReport+' de género <span style="font-weight: bold; color: #000">'+gender+'</span></small>\n' +
            '              <span class="pull-right">'+per+'%</span>\n' +
            '              <div class="c-progress">\n' +
            '                <div class="c-progress-bar" style="width: '+per+'%; background: '+colorHex+' !important;">\n' +
            '                </div>\n' +
            '              </div></div>';

        $("#gendersList").append(layer);
    });

    var data = google.visualization.arrayToDataTable(d);
    var view = new google.visualization.DataView(data);
    var title = 'Géneros';

    switch (gendersChartDraw){
        case 'pie':
            var options = {
                title: title,
                is3D: true,
                chartArea:{left:10, top:20, width:"100%", height:"90%"},
                slices: colors
            };
            var chart = new google.visualization.PieChart(document.getElementById("chartContentGenders"));
            break;
        case 'column':
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
                    title: 'Géneros',
                },
                //chartArea:{left:50, top:20, width:"100%", height:"80%"},
            };
            if(rolesChartDraw == 'column'){
                var chart = new google.visualization.ColumnChart(document.getElementById("chartContentGenders"));
            } else {
                //var chart = new google.visualization.AreaChart(document.getElementById("chartContentUsers"));
            }
            break;
    };

    google.visualization.events.addListener(chart, 'ready', function () {
        imageChartGenders = chart.getImageURI();
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
            name = globalTypeReport+'-por-pais';
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
            name = globalTypeReport+'-por-numero';
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
        case 'role':
            image = imageChartRoles;
            name = globalTypeReport+'-por-roles';
            typeReport = 'Roles';
            icon = '<i class="fa fa-users"></i>';
            pass = true;
            break;
        case 'gender':
            image = imageChartGenders;
            name = globalTypeReport+'-por-generos';
            typeReport = 'Géneros';
            icon = '<i class="fa fa-transgender"></i>';
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
var typeReportRoleArray = [];
$('#chartOptions').click(function () {
    //chartList

    var chartList = $('#chartList');
    chartList.empty();
    var input;

    headers.forEach(function (value, index) {
        if(value != 'Tipo' && value != 'Revista') {
            var orderId = 0,
                icon;
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
              case 'Roles':
                orderId = 3;
                icon = '<i class="fa fa-users" style="color: #555e81;"></i>';
                /*NOTE orderId = 4 asignado a Roles */
                break;
              case 'Géneros':
                orderId = 5;
                icon = '<i class="fa fa-transgender" style="color: #00adc1;"></i>';
                break;
            }

            input ='<li class="list-group-item" id="orderId'+orderId+'"><label style="width: 100%;">'+icon+' '+value+' <input type="checkbox" name="checkChart" data-index="'+index+'"  data-typechart="'+value+'" value="'+value+'" class="pull-right"></label></li>';

            if(value == 'Roles') {
                input+= '<li class="list-group-item" id="orderId4" style="display:none"><label>Lista de Roles</label><ul class="list-group">';
                headersRolesArray.forEach(function(value, index){
                    input+= '<li class="list-group-item"><label style="width: 100%;"><i class="fa fa-user" style="color: #555e81;;"></i> '+value+' <input type="checkbox" name="checkChartRole" data-index="'+index+'"  data-typerole="'+value+'" value="'+value+'" class="pull-right"></label></li>';
                });
                input+= '</ul></li>';
            }
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
                        if(value == 'Roles'){
                            $('#orderId4').css('display', 'block');
                        }
                    }
                }
            });
        });
    });

    if(globalTypeReport == 'Usuarios'){
        indexArrayRoles.forEach(function(values){
            values.forEach(function(value){
                var index = value.i;
                $('input[name="checkChartRole"]').each(function() {
                    var _index = $(this).data('index');
                    var value = $(this).val();
                    if(index == _index){
                        if(!$(this).is(':checked')){
                            $(this).prop('checked', true);
                            var dataArrg = {'i': index, 'v': value};
                            typeReportRoleArray.push(dataArrg);
                        }
                    }
                });
            });
        });
    }


    $('#configCharts').modal({
        backdrop: 'static',
        keyboard: true,
        show: true
    });

});


$(document).on("click", "input[name='checkChart']", function() {
    var index = $(this).data("index");
    var value = $(this).attr("value");
    var typeChart = $(this).data('typechart');

    if($(this).is(":checked")){
        var dataArrg = {"i": index, "v": value};
        typeReportArray.push(dataArrg);
        if(typeChart == 'Roles'){
            $('#orderId4').slideDown('slow');
        }
    } else {
        for(var i in typeReportArray){
            if(typeReportArray[i].i == index){
                typeReportArray.splice(i, 1);

                if(typeChart == 'Roles'){
                    $('#orderId4').slideUp('slow');
                }
                break;
            }
        }
    }

    typeReportArray.sort();
});

$(document).on('click', 'input[name="checkChartRole"]', function(){
    var index = $(this).data('index');
    var value = $(this).attr('value');
    var typeRole = $(this).data('typerole');

    if($(this).is(':checked')){
        var dataArrg = {"i": index, "v": value};
        typeReportRoleArray.push(dataArrg);
    } else {
        for(var i in typeReportRoleArray){
            if(typeReportRoleArray[i].i == index) {
                typeReportRoleArray.splice(i, 1);
                break;
            }
        }
    }
    typeReportRoleArray.sort();

});

$('#saveChangesChartList').click(function () {
    if(typeReportArray.length > 0){
        var passes = 0;
        var hasRoles = 0;

        for(i in typeReportArray){
            var typeReport = typeReportArray[i].v;

            if(typeReport == 'Roles'){
                hasRoles = 1;
            }
        }

        if(hasRoles){
            if(typeReportRoleArray.length > 0){
                passes = 1;
            }
        } else {
            passes = 1;
        }

        if(passes){
            var data = {
                '_token': CSRF_TOKEN,
                'switchCase': 'upload_report_index',
                'fileId' : globalCSVID,
                'indexArray': typeReportArray,
                'roleIndexArray': typeReportRoleArray,
            };

            $.ajax({
                type: "POST",
                url: "../../files",
                data: data,
                dataType: "JSON",
                success: function(response){
                    location.reload();
                }
            });
        } else {
            swal(
                '¡Error!',
                '¡Debe seleccionar almenos un rol!',
                'error'
            )
        }


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
