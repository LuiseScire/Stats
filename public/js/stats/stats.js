var folderIdActive = 0;

//globalCSVID
var globalFileId;
var globalTypeReport;

var globalTotals = 0;
var globaltotalCountries = 0;
var globalFileType;

// specifies how many lines to draw on the chart
var gridlinesCount = 20;

/**
* Array's for each Clouds Words
*
* Sample: {text: "some text", weight: 13},
*/
var wordsCountry    = [],
    wordsCity       = [],
    wordsMonth      = [],
    wordsNumber     = [],
    wordsRoles      = [];

/**
* Variabes for each chart's image
*/
var imageChartType,
    imageChartText,
    imageChartJournal,
    imageChartNumber,
    imageChartCity,
    imageChartCountry,
    imageChartMonth,
    imageChartTotal,
    imageChartRoles,
    imageChartRolesNationality,
    imageChartGenders,
    imageChartAffiliation,
    imageChartAcceptedRefused,
    imageChartTypeItems;

/**
*
*/
var headers = [],
    headersRolesArray = [];

//almacena los índices del documento seleccionados cuando se dio de alta
var indexArray = [];
var indexArrayRoles = []

var liFolderId;
var filePath;

// FIXME: define function
// validate how many click's event fired in .chartOption class
var chartOptionClickCounter = 0;

/**
* Set the initial type chart for each chart
*/
var countryChartDraw        = 'geo',
    cityChartDraw           = 'column',
    monthsChartDraw         = 'pie',
    numbersChartDraw        = 'column',
    textChartDraw           = 'pie',
    rolesChartDraw          = 'column',
    rolesTypeColumn         = 'stacked',
    gendersChartDraw        = 'column',
    affiliationChartDraw    = 'column',
    acceptedRefusedChartDraw    = 'column',
    tipoItemChartDraw       = 'column';

/**
* array data for single chart
*/
var citiesArrg = [],
    numberArrg = [],
    textArrg = [],
    rolesArrg = [],
    acceptedRefusedArrg = [],
    tipoItemArrg = [];

var dataSet = [];
var showCharts = [];

/*=================================================
=============== STATS MODULE ======================
==================================================*/
/**
* fileNameParam var is defined in view file
*/
$(document).ready(function(){
    let data;
    if(!fileNameParam){
        data = {'_token': CSRF_TOKEN, 'switchCase': 'getLastFile'};
    } else {
        data = {'_token': CSRF_TOKEN, 'switchCase': 'seeFileAgain', 'fileName': fileNameParam};
    }
    start(data);
});

function start(data){
    $('#chartsModuleContent').show();
    var url = (!fileNameParam) ? 'files' : '../files';

    var counter = 0;
    $.post(url, data, function(response){
        var file_folder_id,
            file_back_name,
            file_front_name,
            fileIndices,
            fileIndicesRoles,
            fileTimestamp,
            fileUserName,
            type_report,
            typeReportIndex;

        if(response[0] == null){
            // configLocation is defined in view file
            location.href = configLocation;
        } else {
            $.each(response, function(index, v){
                file_folder_id = v.file_folder_id;
                liFolderId = file_folder_id;
                file_back_name = v.file_back_name;
                file_front_name = v.file_front_name;
                globalFileId = v.file_id;
                fileIndices = v.file_indices;
                fileIndicesRoles = v.file_role_indices;

                fileTimestamp = v.file_timestamp;
                fileUserName = v.name + ' ' + v.last_name;
                indexArray = JSON.parse("[" + fileIndices + "]");
                indexArrayRoles = JSON.parse("[" + fileIndicesRoles + "]");
                globalFileType = v.file_type;
                typeReportIndex = v.file_report_index;
                type_report = v.file_report_name;
            });

            lang = 'es';
            var uploadDate = dateFormat(fileTimestamp, lang, fileUserName);
            var titleHeader = 'Informe: <strong style="color: #ad0004;"><i>'+type_report+'.</i></strong>'+
                '<br> <small><strong>Archivo:</strong> ' + file_front_name + '</small> <small>'+uploadDate+'</small>';

            $('#topTitle').html(titleHeader);
            filePath = public_path + 'files/'+file_back_name

            switch (typeReportIndex){
                case 0:
                case 2:
                    globalTypeReport = 'Descargas';
                    break;
                case 1:
                case 3:
                case 4:
                    globalTypeReport = 'Visitas';
                    break;
                case 5:
                    globalTypeReport = 'Usuarios';
                    break;
                case 7:
                    globalTypeReport = 'Artículos';
                    break;
                case 8:
                    globalTypeReport = 'DSpace';
                    break;
            }

            folderIdActive = liFolderId;
            let data = {'_token': CSRF_TOKEN, 'switchCase': 'getFolders'};
            var countFolders = 2;
            $.post(url, data, function(response){
                $.each(response, function(index, v){
                    $.each(v, function(ind, val){
                        var folder_name = val.folder_name;
                        var folder_id = val.folder_id;
                        var folder_total_files = val.folder_total_files;

                        var sortOrder = countFolders;
                        //console.log(file_folder_id);
                        if(file_folder_id == folder_id){
                            sortOrder = 1;
                        }

                        var li = '<li class="folder-list"  id="liFolder'+folder_id+'" title="Gráficas de '+folder_name+'" data-folderid="'+folder_id+'" data-folderorder="'+sortOrder+'" data-totalfiles="'+folder_total_files+'" data-filebackname="">'+
                                    '<a href="#">'+
                                        '<span class="folder-title"> Gráficas de '+folder_name+'</span>'+
                                        '<span class="fa arrow"></span>'+
                                    '</a>'+
                                    '<ul class="nav nav-second-level" id="folder'+folder_id+'" data-folderid="'+folder_id+'">'+

                                    '</ul>'+
                                '</li>';

                        $('#side-menu').append(li);
                        countFolders++;
                    });
                });

                $('.folder-list').find('ul#folder'+file_folder_id).addClass('in').parent('.folder-list').addClass('active');

                google.charts.load("visualization", "1.1", {
                    packages: ["corechart"]
                });

                google.charts.load('current', {'packages':['table']});
                switch (globalFileType) {
                    case 'csv':
                        generateArraysCSV();
                        break;
                    case 'xml':
                        generateArraysXML(file_back_name);
                        break;
                }
            });
        }
    });
}

$(document).on('click', 'li.folder-list', function(event){
    var thisFolderId = $(this).data('folderid');
    var totalFiles = parseInt($(this).data('totalfiles'));

    if(thisFolderId != folderIdActive) {
        //folderIdActive = thisFolderId;
        //$('#side-menu').find('li.folder-list').remove();
        //fadeInLoader();
        // headers = [];
        // indexArray = [];
        if(totalFiles == 0){
            swal({
                title: 'Aún no ha subido ningun archivo',
                text: '¿Desea subir un archivo a esta carpeta?',
                type: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, subir archivo'
            }).then((result) => {
                if(result.value){
                    location.href = configLocation;
                    // var data = {'_token': CSRF_TOKEN, 'swi tchCase': 'getLastFileRequest', 'folderId': thisFolderId};
                    // start(data);
                }else if (result.dismiss === swal.DismissReason.cancel) {
                    $('#liFolder'+folderIdActive+'>a').click();
                }
            });
        } else {
            // folderIdActive = thisFolderId;
            // $('#side-menu').find('li.folder-list').remove();
            // fadeInLoader();
            var data = {'_token': CSRF_TOKEN, 'switchCase': 'getLastFileRequest', 'folderId': thisFolderId};
            var url = (!fileNameParam) ? 'files' : '../files';
            $.post(url, data, function(response){
                var file_back_name;
                $.each(response, function(index, v){
                    file_back_name = v.file_back_name;
                });

                var location_ = (!fileNameParam) ? 'stats/'+file_back_name : file_back_name;
                location.href = location_;
            });
        }
    }
});

function generateArraysXML(fileName){
    var data = {'_token': CSRF_TOKEN, 'fileName': fileName, 'switchCase': 'stats'};

    globalTotals = 0;
    var showOnlyGraph = [];

    //
    headers = ['Roles', 'Géneros', 'País', 'Afiliación'];

    // status of the chart visibility. 0 = not
    var chartCountry = 0,
        chartGenders = 0,
        chartRoles = 0,
        chartAffiliation = 0;

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
                case 'Afiliación':
                    chartAffiliation = 1;
                    break;
            }
        });
    });

    if(Boolean(chartRoles)){
        indexArrayRoles.forEach(function (values) {
            values.forEach(function (value) {
                //var index = value.i;
                showOnlyGraph.push(value.v);
            });
        });
    }

    $.post('../../readxml', data, function(response) {
        contador = 0;
        $.each(response, function(index, v){
            var country = v.country;
            var gender = v.gender;
            var affiliation = String(v.affiliation);

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

                globalTotals = globalTotals + 1;
            });

            if(chartGenders){
                if(country == ''){
                    country = 'UNK';
                }

                if(gender == ''){
                    gendersObj[0].totals = gendersObj[0].totals + counterRoles;
                    for(var i = 0; i < counterRoles; i++){
                        gendersObj[0].countries.push(country);
                    }
                } else {
                    $.each(gendersObj, function(index, v) {
                        if(gender == v.shortname) {
                            v.totals = v.totals + counterRoles;
                            for(var i = 0; i < counterRoles; i++){
                                v.countries.push(country);
                            }
                        }
                    });
                }
             }

             //en esta parte se comparará desde bd las coincidencias
             if(chartAffiliation) {
                 var match = [
                    'El Colegio de México, A.C.',
                    'El Colegio de México, CEE',
                    'El Colegio de México, CEDUA',
                    'El Colegio de México, A. C. CEDUA',
                    'El Colegio de México, CES',
                    'El Colegio de México, CEH',
                    'El Colegio de México, Coordinación de Servicios de Cómputo',
                    'El Colegio de México (Centro de Estudios Históricos)',
                    'El Colegio de México, Centro de Estudios Sociológicos',
                    'El Colegio de México, Centro de Estudios Internacionales',
                    'El Colegio de México, Centro de Estudios Demográficos, Urbanos y Ambientales',
                    'El Colegio de México, A.C., Centro de Estudios Económicos',
                    'El Colegio de México',
                    'Colegio de México',
                    'COLEGIO DE MÉXICO',
                    'Colegio de M[exico',
                    'Seminario sobre Violencia y Paz de El Colegio de México'
                 ];

                 //jnalAffiliation = 'Guadalajara';

                 //var strToSearch = jnalAffiliation.replace(/\s/g, '+');
                 var strToSearch = jnalAffiliation;
                 //console.log('strToSearch: ' + strToSearch);
                 //omitir artículos
                 var regexp = new RegExp(strToSearch, 'i');
                 //console.log(regexp);
                 //var n = affiliation.search(/colegio de méxico/i);
                 var n = regexp.test(affiliation);
                 //console.log(n);
                 var foundValue = 0;
                 if(Boolean(n)){
                    // console.log('< N\''+n);
                     contador++;
                     foundValue = 1;
                     //console.log('Afiliciación: '+affiliation);
                     //console.log('Contador: '+contador);
                 }
                 //console.log('Affiliation in xml: ' + affiliation);
                 //console.log('----------');
                 //83

                // for(var i = 0; i < match.length; i++){
                //     if(match[i] == affiliation){
                //         foundValue = 1;
                //         // console.log('Afiliciación Array: '+affiliation);
                //         //console.log('----------');
                //     }
                // }

                if(Boolean(foundValue)){
                     affiliationArrg[0].totals = affiliationArrg[0].totals + 1;
                 } else {
                     if(affiliation == ''){
                          affiliationArrg[2].totals = affiliationArrg[2].totals + 1;
                     } else {
                         affiliationArrg[1].totals = affiliationArrg[1].totals + 1;
                     }
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
    // set empty global dataSet
    dataSet = [];
    d3.text(filePath, function(data) {
        var parsedCSV = d3.csv.parseRows(data);

        globalTotals = 0;

        // set index in the dataSet array
        var indexNumber = 0;
            indexCity = 0,
            indexMonth = 0,
            indexCountry = 0,
            indexAcceptedRefused = 0,
            indexTipoItem = 0,
            indexFechaHoraAcceso = 0,
            indexIpAddress = 0;

        // status of the chart visibility. 0 = not
        var chartNumber = 0,
            chartCity = 0,
            chartMonth = 0,
            chartCountry = 0,
            chartacceptedRefused = 0,
            chartTipoItem = 0,
            chartFechaHoraAcceso = 0,
            chartIpAddress = 0;

        indexArray.forEach(function (values) {
            values.forEach(function (value) {
                var index = value.i;
                var acceptedRefused = 'Decisión del director(Estatus Aceptado/Rechazado)';

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
                    case acceptedRefused:
                        indexAcceptedRefused = index;
                        chartacceptedRefused = 1;
                        break;
                    case 'Tipo_Item':
                        indexTipoItem = index;
                        chartTipoItem = 0;
                        break;
                    case 'Fecha_Hora_Acceso':
                        indexFechaHoraAcceso = index;
                        chartFechaHoraAcceso = 0;
                        break;
                    case 'Direccion':
                        indexIpAddress = index;
                        chartIpAddress = 0;
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
                    if(chartacceptedRefused == 1){

                    } else if (globalTypeReport == 'DSpace') {

                    } else {
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
                                    countryCode = 'UNK';
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
    });
}

function switchData() {
    var panelTitle, li, liHeaderNT;
    var panelTitleCloudWords;

    var showNumber = 0,
        showText = 0;

    var chartList = $("#liFolder"+liFolderId).find('ul#folder'+liFolderId);

    google.charts.load("current", {packages:['corechart']});

    let acceptedRefused = 'Decisión del director(Estatus Aceptado/Rechazado)';
    indexArray.forEach(function(objects) {
        objects.forEach(function(v) {
            showCharts.push(v.v);

            switch(v.v){
                case 'Texto':
                    //$("#chartPanelText").show();
                    switch (globalTypeReport) {
                        case 'Descargas':
                            panelTitle = 'Principales artículos con mayores descargas';
                            break;
                        case 'Visitas':
                            panelTitle = 'Principales artículos con mayores visitas';
                            break;
                    }

                    $("#panelTitleText").text(panelTitle);
                    //$('#liMenuChartText').show();
                    // li =
                    // '<li class="header">'+
                    //     '<a>'+
                    //         '<i class="fa fa-file fa-fw"></i>'+
                    //         '<span>Principales Artículos</span>'+
                    //     '</a>'+
                    // '</li>'+
                    // '<li id="liMenuChartText" data-orderid="5" class="chartOption" data-paneltarget="chartPanelText" data-position="'+v.i+'">'+
                    //     '<a class="link-menu"> '+
                    //         '<i class="fa fa-font"></i> '+
                    //         'Por Artículo'+
                    //     '</a>'+
                    // '</li>';
                    li = '<li id="liMenuChartText" data-orderid="5" class="chartOption" data-paneltarget="chartPanelText" data-position="'+v.i+'">'+
                        '<a class="link-menu"> '+
                            '<i class="fa fa-newspaper-o"></i> '+
                            'Principales Artículos'+
                        '</a>'+
                    '</li>';

                    // li = '<li data-orderid="5">'+
                    //         '<a href="javascript:void(0)"><i class="fa fa-bar-chart fa-fw" style="color: darkred"></i> Principales Artículos <span class="fa arrow"></span></a>'+
                    //         '<ul class="nav nav-third-level">'+
                    //             '<li id="liMenuChartText"  class="chartOption" data-paneltarget="chartPanelText" data-position="'+v.i+'">'+
                    //                 '<a class="link-menu"> '+
                    //                     '<i class="fa fa-font"></i> '+
                    //                     'Por Artículo'+
                    //                 '</a>'+
                    //             '</li>'+
                    //         '</ul>'+
                    //     '</li>';

                    //processDataText(v.i);
                    break;
                case 'Número':
                    //$("#chartPanelNumber").show();
                    switch (globalTypeReport) {
                        case 'Descargas':
                            panelTitle = 'Principales 10 números con mayores descargas';
                            panelTitleCloudWords = 'Nube de palabras de todos los números descargados';
                            break;
                        case 'Visitas':
                            panelTitle = 'Principales 10 números con mayores visitas';
                            panelTitleCloudWords = 'Nube de palabras de todos los números visitados';
                            break;
                    }

                    $("#panelTitleNumber").text(panelTitle);
                    $('#panelTitleCloudWordsNumber').text(panelTitleCloudWords);

                    //$('#liMenuChartNumber').show();

                    // li =
                    // '<li>'+
                    //     '<a>'+
                    //         '<i class="fa fa-file fa-fw"></i>'+
                    //         '<span>Principales Números</span>'+
                    //     '</a>'+
                    // '</li>'+
                    // '<li id="liMenuChartNumber" data-orderid="4" class="chartOption" data-paneltarget="chartPanelNumber" data-position="'+v.i+'">'+
                    //     '<a class="link-menu">'+
                    //         '<i class="fa fa-hashtag" style="color: darkgreen"></i> '+
                    //         'Por Número'+
                    //     '</a>'+
                    // '</li>';

                    li =
                    '<li id="liMenuChartNumber" data-orderid="4" class="chartOption" data-paneltarget="chartPanelNumber" data-position="'+v.i+'">'+
                        '<a class="link-menu">'+
                            '<i class="fa fa-hashtag" style="color: darkgreen"></i> '+
                            'Principales Números'+
                        '</a>'+
                    '</li>';

                    // li = '<li data-orderid="4">'+
                    //         '<a href="javascript:void(0)"><i class="fa fa-bar-chart fa-fw" style="color: darkred"></i> Principales Números <span class="fa arrow"></span></a>'+
                    //         '<ul class="nav nav-third-level">'+
                    //             '<li id="liMenuChartNumber" class="chartOption" data-paneltarget="chartPanelNumber" data-position="'+v.i+'">'+
                    //                 '<a class="link-menu">'+
                    //                     '<i class="fa fa-hashtag" style="color: darkgreen"></i> '+
                    //                     'Por Número'+
                    //                 '</a>'+
                    //             '</li>'+
                    //         '</ul>'+
                    //     '</li>';

                    //processDataNumber(v.i);
                    break;
                case 'Ciudad':
                    //$("#chartPanelCity").show();
                    switch (globalTypeReport) {
                        case 'Descargas':
                            panelTitle = '10 ciudades con mayores descargas';
                            panelTitleCloudWords = 'Nube de palabras de todas las ciudades que realizan descargas';
                            break;
                        case 'Visitas':
                            panelTitle = '10 ciudades con mayores visitas realizadas';
                            panelTitleCloudWords = 'Nube de palabras de todas las ciudades que realizan visitas';
                            break;
                        case 'Usuarios':
                            panelTitle = '10 ciudades con mayores usuarios registrados';
                            panelTitleCloudWords = 'Nube de palabras de todas las ciudades con usuarios registrados';
                            break;
                        default:
                    }

                    $("#panelTitleCity").text(panelTitle);
                    $('#panelTitleCloudWordsCity').text(panelTitleCloudWords);
                    //$('#liMenuChartCity').show();
                    li = '<li id="liMenuChartCity" data-orderid="2" class="chartOption" data-paneltarget="chartPanelCity" data-position="'+v.i+'">'+
                        '<a class="link-menu">'+
                            '<i class="fa fa-building" style="color: cadetblue;"></i> '+
                            'Por Ciudad'+
                        '</a>'+
                    '</li>';
                    //processDataCities();
                    break;
                case 'País':
                    switch (globalTypeReport) {
                        case 'Descargas':
                            //panelTitle = 'Gráfica de Países desde donde realizan descargas en el mundo';
                            panelTitleCloudWords = 'Nube de palabras de los países que realizan descargas';
                            break;
                        case 'Visitas':
                            //panelTitle = 'Gráfica de Países desde donde realizan visitas en el mundo';
                            panelTitleCloudWords = 'Nube de palabras de los países que realizan visitas';
                            break;
                        case 'Usuarios':
                            //panelTitle = 'Gráfica de usuarios regitrados por País';
                            panelTitleCloudWords = 'Nube de palabras de los países con usuarios registrados';
                            break;
                    }

                    //si se cambia el título, cambiarlo también en la función processDataCountries()
                    //$("#panelTitleCountries").text(panelTitle);
                    $('#panelTitleCloudWordsCountry').text(panelTitleCloudWords);
                    $("#chartPanelCountries").show();
                    //$('#liMenuChartCountry').show();
                    li = '<li id="liMenuChartCountry" data-orderid="1" class="chartOption"  data-paneltarget="chartPanelCountries" data-position="'+v.i+'">'+
                        '<a class="link-menu">'+
                            '<i class="fa fa-globe" style="color: dodgerblue;"></i> '+
                            'Por País'+
                        '</a>'+
                    '</li>';
                    //processDataCountries();
                    break;
                case 'Mes':
                    //$("#chartPanelMonths").show();
                    switch (globalTypeReport) {
                        case 'Descargas':
                            panelTitle = 'Comparación de descargas realizadas por mes';
                            panelTitleCloudWords = 'Nube de palabras de los meses en que se realizaron descargas';
                            break;
                        case 'Visitas':
                            panelTitle = 'Comparación de visitas realizadas por mes';
                            panelTitleCloudWords = 'Nube de palabras de los meses en que se realizaron descargas';
                            break;
                        // case 'Usuarios':
                        //     panelTitle = 'Países con usuarios registrados';
                        //     panelTitleCloudWords = 'Nube de palabras de los países con usuarios registrados';
                        //     break;
                    }
                    $("#panelTitleMonths").text(panelTitle);
                    $('#panelTitleCloudWordsMonth').text(panelTitleCloudWords);
                    //$('#liMenuChartMonth').show();
                    li = '<li id="liMenuChartMonth" data-orderid="3" class="chartOption" data-paneltarget="chartPanelMonths" data-position="'+v.i+'">'+
                        '<a class="link-menu">'+
                            '<i class="fa fa-calendar" style="color: darkred"></i> '+
                            'Por Mes'+
                        '</a>'+
                    '</li>';
                    //processDataMonths();
                    break;
                case 'Total':
                    //$("#chartPanelTotal").show();
                    $("#panelTitleTotal").text(v.v);
                    $('#liMenuChartTotal').show();
                    //processDataTotal(v.i);
                    break;
                case 'Roles':
                    panelTitle = 'Tipos de usuario registrados';
                    panelTitleCloudWords = 'Nube de palabras por tipo de usuario';
                    $('#panelTitleRoles').text(panelTitle);
                    $('#panelTitleCloudWordsRoles').text(panelTitleCloudWords);
                    //$("#chartPanelRoles").show();
                    //$('#liMenuChartRole').show();
                    li = '<li id="liMenuChartRole" data-orderid="2" class="chartOption" data-paneltarget="chartPanelRoles" data-position="'+v.i+'">'+
                        '<a class="link-menu">'+
                            '<i class="fa fa-users" style="color: #555e81"></i> '+
                            'Por Tipo de usuario'+
                        '</a>'+
                    '</li>';
                    //processDataRoles();
                    break;
                case 'Géneros':
                    panelTitle = 'Usuarios registrados por géneros';
                    $('#panelTitleGenders').text(panelTitle);
                    $('#chartPanelGenders').show();
                    //$('#liMenuChartGender').show();
                    li = '<li id="liMenuChartGender" data-orderid="3" class="chartOption" data-paneltarget="chartPanelGenders" data-position="'+v.i+'">'+
                        '<a class="link-menu">'+
                            '<i class="fa fa-transgender" style="color: #00adc1"></i> '+
                            'Por Géneros'+
                        '</a>'+
                    '</li>';
                    //processDataGenders();
                    break;
                case 'Afiliación':
                    panelTitle = 'Usuarios registrdos por afiliación';
                    $('#panelTitleAffiliation').text(panelTitle);
                    $('#chartPanelAffiliation').show();

                    li = '<li id="liMenuChartAffiliation" data-orderid="4" class="chartOption" data-paneltarget="chartPanelAffiliation" data-position="'+v.i+'">'+
                        '<a class="link-menu">'+
                            '<i class="fa fa-handshake-o" style="color: purple"></i> '+
                            'Por Afiliación'+
                        '</a>'+
                    '</li>';
                    break;
                case acceptedRefused:
                    panelTitle = 'Decisión editorial de los artículos';
                    $('#panelTitleAcceptedRefused').text(panelTitle);
                    $('#chartPanelAcceptedRefused').show();

                    li = '<li id="liMenuChartAcceptedRefused" data-orderid="8" class="chartOption" data-paneltarget="chartPanelAcceptedRefused" data-position="'+v.i+'">'+
                        '<a class="link-menu">'+
                            '<i class="fa fa-check-square-o" style="color: #CBC717"></i> '+
                            'Por Decisión editorial'+
                        '</a>'+
                    '</li>';
                    break;
                case 'Tipo_Item':
                    panelTitle = 'Chart Title';
                    $('#panelTitleTypeItems').text(panelTitle);
                    $('#chartPanelTypeItems').show();

                    li = '<li id="liMenuChartTipoItem" data-orderid="9" class="chartOption" data-paneltarget="chartPanelTypeItems" data-position="'+v.i+'">'+
                        '<a class="link-menu">'+
                            '<i class="fa fa-handshake-o" style="color: #5B78D8"></i> '+
                            'Por Tipo item'+
                        '</a>'+
                    '</li>';
                    break;
                case 'Fecha_Hora_Acceso':
                    li = '';
                    break;
                case 'Direccion':
                    li = '';
                    break;
            }// end switch
            //$("#liFolder"+liFolderId).find('ul#folder'+liFolderId).append(li);
            chartList.append(li);
        });
    });

    $('#side-menu').metisMenu();

    var elements = chartList.children('li').get();
    elements.sort(function(a,b) {
      var A = $(a).data('orderid');
      var B = $(b).data('orderid');
      return (A < B) ? -1 : (A > B) ? 1 : 0;
    });

    elements.forEach(function(element) {
      chartList.append(element);
    });

    $('.chartOption:first').click();
}

$(document).on('click', '.chartOption', function() {
    var el = $(this);
    var paneltarget = el.data('paneltarget');
    var position = el.data('position');

    if(chartOptionClickCounter > 0) showPreloader('Cargando estadísticas, espere un momento por favor');

    setTimeout(function(){
        $('.chartContent').hide();
        $('.chartOption').find('a').removeClass('active');
        el.find('a').addClass('active');
        $('#'+paneltarget).slideDown('slow');

        switch (paneltarget) {
            case 'chartPanelText':
                processDataText(position);
                break;
            case 'chartPanelNumber':
                processDataNumber(position);
                break;
            case 'chartPanelCity':
                processDataCities(position);
                break;
            case 'chartPanelCountries':
                processDataCountries();
                break;
            case 'chartPanelMonths':
                processDataMonths(position);
                break;
            case 'chartPanelRoles':
                processDataRoles();
                break;
            case 'chartPanelGenders':
                processDataGenders();
                break;
            case 'chartPanelAffiliation':
                processDataAffiliation();
                break;
            case 'chartPanelAcceptedRefused':
                processDataAcceptedRefused(position);
                break;
            case 'chartPanelTypeItems':
                processDataTipoItem(position);
                break;
        }

        chartOptionClickCounter++;
        fadeOutLoader();
    }, 1000);
});

/*====================================================================================================================
============================================ <!-- COUNTRIES CHART -->  ===============================================
====================================================================================================================*/
$('.switchCountryChart').click(function () {
    countryChartDraw = $(this).data('chart');
    if(!$(this).hasClass('btn-primary')) {
        $('.switchCountryChart').removeClass('btn-primary').addClass('btn-default');
        $(this).addClass('btn-primary');
    }
    google.charts.setOnLoadCallback(drawChartCountries);
});

$("#searchCountry").keyup(function() {
    _this = this;
    $.each($("#countriesList > div"), function() {
        if ($(this).data('country').toLowerCase().indexOf($(_this).val().toLowerCase()) === -1)
            $(this).hide();
        else
            $(this).show();
    });
});

function processDataCountries() {
    google.charts.load('current', {
        'packages':['geochart'],
        'mapsApiKey': 'AIzaSyCG0ClvEMX6LqvqnD-amrqlMriHgiKfb3o'
    });
    google.charts.setOnLoadCallback(drawChartCountries);
}

function drawChartCountries() {
    var _countriesObj = countriesObj.sort(dynamicSort("downloads"));
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
    //wordsCountry = [];

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


    $('#totalContinentes').text(continents);

    $('#totalCountries').text(countCountries);

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

    $('#totalType').text($.number(globalTotals) + ' / ' + abbreviateNumber(globalTotals)).next('span').text(' '+globalTypeReport + ' totales');

    /*********************/
    var str = mainCountry+' '+abbreviateNumber(mainTotals)+' ';
    var str = mainCountry;
    var str2 = 'País principal en ' + globalTypeReport;
    $('#mainCountry').text(str).next('span').text(str2);
    $('#mainCountryProgress').css('width', mainPercent+'%');
    var bcProgressDescription = abbreviateNumber(mainTotals) +', '+mainPercent+'%'
    $('#mainCountryPorcent').text(bcProgressDescription);
    /*********************/
    $('#totalTypeUnk').text(abbreviateNumber(unknowTotals)).next('span')
        .text(' '+globalTypeReport + ' sin especificar');

    $('#totalTypeUnkProgress').css('width', unknowPercent+'%');
    $('#totalTypeUnkPorcent').text(unknowPercent+ '%');


    var data = google.visualization.arrayToDataTable(d);

    var view = new google.visualization.DataView(data);

    var title = 'Rating ' + previewLimit + ' de países con mayores ' + globalTypeReport;
    var panelTitle;


    switch (countryChartDraw){
        case 'geo':
            //title = 'Todos los países que realizan ' + globalTypeReport;
            switch (globalTypeReport) {
                case 'Descargas':
                    //panelTitle = 'Gráfica de Países desde donde realizan descargas en el mundo';
                    panelTitle = 'Países con descargas';
                    //panelTitleCloudWords += ' los países que realizan descargas';
                    break;
                case 'Visitas':
                    panelTitle = 'Países con visitas';
                    //panelTitleCloudWords += ' los países que realizan visitas';
                    break;
                case 'Usuarios':
                    panelTitle = 'Países con usuarios';
                    //panelTitleCloudWords += ' los países con usuarios registrados';
                    break;
            }

            var options = {
                height: "400",
                colorAxis: {colors: ['#E05740', '#A41C1E']},
            };
            var chart = new google.visualization.GeoChart(document.getElementById("chartContentCountries"));
            break;
        case 'pie':
            switch (globalTypeReport) {
                case 'Descargas':
                    panelTitle = '10 Países con mayor número de descargas.';
                    title = '10 Países con mayor número de descargas. Descargas totales: ' + $.number(globalTotals) + '('+abbreviateNumber(globalTotals)+')';
                    //panelTitleCloudWords += ' los países que realizan descargas';
                    break;
                case 'Visitas':
                    panelTitle = '10 Países con mayor número de visitas';
                    title = title = '10 Países con mayor número de visitas. Visitas totales: ' + $.number(globalTotals) + '('+abbreviateNumber(globalTotals)+')';;
                    //panelTitleCloudWords += ' los países que realizan visitas';
                    break;
                case 'Usuarios':
                    panelTitle = '10 Países con mayor número de usuarios registrados';
                    title = title = '10 Países con mayor número de usuarios registrados. Usuarios totales: ' + $.number(globalTotals) + '('+abbreviateNumber(globalTotals)+')';
                    //panelTitleCloudWords += ' los países con usuarios registrados';
                    break;
            }

            var options = {
                title: title,
                titleTextStyle: {
                    bold: true,
                    italic: true,
                    fontSize: 16,
                },
                is3D: true,
                chartArea:{left:10, top:50, width:"100%", height:"90%"},
                slices: colors
            };
            var chart = new google.visualization.PieChart(document.getElementById("chartContentCountries"));
            break;
        case 'column':
        case 'line':
            switch (globalTypeReport) {
                case 'Descargas':
                    panelTitle = '10 Países con mayor número de descargas';
                    title = '10 Países con mayor número de descargas. Descargas totales: ' + $.number(globalTotals) + '('+abbreviateNumber(globalTotals)+')';
                    break;
                case 'Visitas':
                    panelTitle = '10 Países con mayor número de visitas';
                    title = title = '10 Países con mayor número de visitas. Visitas totales: ' + $.number(globalTotals) + '('+abbreviateNumber(globalTotals)+')';;
                    break;
                case 'Usuarios':
                    panelTitle = '10 Países con mayor número de usuarios registrados';
                    title = title = '10 Países con mayor número de usuarios registrados. Usuarios totales: ' + $.number(globalTotals) + '('+abbreviateNumber(globalTotals)+')';
                    break;
            }

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
                titleTextStyle: {
                    bold: true,
                    italic: true,
                    fontSize: 16,
                },
                bar: {groupWidth: "70%"},
                legend: { position: "none" },
                height: "400",
                vAxis: {
                    title: globalTypeReport,
                    gridlines: {count: gridlinesCount},
                    format: 'short',
                },
                hAxis: {
                    title: 'Ciudades',
                },
                chartArea:{left:50,top:50,width:"100%",height:"75%"},
                animation: {
                    duration: 1500,
                    startup: true
                },

            };
            if(countryChartDraw == 'column'){
                var chart = new google.visualization.ColumnChart(document.getElementById("chartContentCountries"));
            } else {
                var chart = new google.visualization.AreaChart(document.getElementById("chartContentCountries"));
            }
            break;
    }

    $("#panelTitleCountries").text(panelTitle);

    google.visualization.events.addListener(chart, 'ready', function () {
        imageChartCountry = chart.getImageURI();
    });

    //chart.draw(data, options);
    chart.draw(view, options);
    $('#cloudWordsCountry').jQCloud(wordsCountry);

    hidePreloader();
}

/*====================================================================================================================
============================================== <!-- CITIES CHART --> =================================================
====================================================================================================================*/
$('.switchCityChart').click(function (event) {
    showPreloader();
    cityChartDraw = $(this).data('chart');
    if(!$(this).hasClass('btn-primary')) {
        $('.switchCityChart').removeClass('btn-primary').addClass('btn-default');
        $(this).addClass('btn-primary');
    }
    google.charts.setOnLoadCallback(drawChartCities);
});

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

    var title;

    switch (globalTypeReport) {
        case 'Descargas':
            title = '10 ciudades con mayores descargas';
            break;
        case 'Visitas':
            title = '10 ciudades con mayores visitas';
            break;
        case 'Usuarios':
            title = '10 ciudades con mayores usuarios registrados';
            break;
    }

    switch (cityChartDraw){
        case 'pie':
            var options = {
                title: title,
                titleTextStyle: {
                    bold: true,
                    italic: true,
                    fontSize: 16,
                },
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
                titleTextStyle: {
                    bold: true,
                    italic: true,
                    fontSize: 16,
                },
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
                animation: {
                    duration: 1500,
                    startup: true
                },

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

    hidePreloader();
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

/*====================================================================================================================
============================================== <!-- MONTHS CHART --> =================================================
====================================================================================================================*/
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

        if(v.downloads > 0){
            var word = {text: v.name, weight: v.downloads};
            wordsMonth.push(word);
        }


    });

    var title = '';
    switch (globalTypeReport) {
        case 'Visitas':
            $('#itotalTypeMonth').addClass('fa-eye');
            title = 'Comparación de visitas realizadas por mes';
            break;
        case 'Descargas':
            $('#itotalTypeMonth').addClass('fa-download');
            title = 'Comparación de descargas realizadas por mes';
            break;
        default:

    }

    // if(globalTypeReport == 'Visitas') {
    //     $('#itotalTypeMonth').addClass('fa-eye');
    // } else {
    //     $('#itotalTypeMonth').addClass('fa-download');
    // }

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

    // var title = 'Comparación por mes de las descargas realizadas';

    switch (monthsChartDraw){
        case 'pie':
            var options = {
                title: title,
                titleTextStyle: {
                    bold: true,
                    italic: true,
                    fontSize: 16,
                },
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
                titleTextStyle: {
                    bold: true,
                    italic: true,
                    fontSize: 16,
                },
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
                chartArea:{left:50,top:20,width:"95%",height:"80%"},
                animation: {
                    duration: 1500,
                    startup: true
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

    hidePreloader();
}

/*===================================================================================================================
============================================= <!-- NUMBER CHART --> =================================================
====================================================================================================================*/
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

function processDataNumber(position) {
    //var order = 'desc';
    var chart = function() { drawChartNumber() };
    google.charts.setOnLoadCallback(chart);
    /*var order = 'desc';
    drawChartNumber(order);*/

}

$('.switchNumberChart').click(function () {
    numbersChartDraw = $(this).data('chart');

    if(!$(this).hasClass('btn-primary')) {
        $('.switchNumberChart').removeClass('btn-primary').addClass('btn-default');
        $(this).addClass('btn-primary');
        var data = $(this).data('sort');
    }
    google.charts.setOnLoadCallback(drawChartNumber);
});

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

            var word = {text: '#'+text, weight: totals};
            wordsNumber.push(word);

            totalNumbers++;
        }
    });// end each

    $('#totalNumbers').text(totalNumbers);

    var data = google.visualization.arrayToDataTable(dataArrg);

    var view = new google.visualization.DataView(data);

    var dov = (globalTypeReport == 'descargas') ? 'descargados' : 'visitados';
    var ratingPercent = Math.round((ratingdov / globalTotals) * 100);
    var title = '';
    switch (globalTypeReport) {
        case 'Descargas':
            title = 'Principales 10 números con mayores descargas';
            break;
        case 'Visitas':
            title = 'Principales 10 números con mayores visitas';
            break;
    }

    switch (numbersChartDraw){
        case 'pie':
            var options = {
                title: title,
                titleTextStyle: {
                    bold: true,
                    italic: true,
                    fontSize: 16,
                },
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
                titleTextStyle: {
                    bold: true,
                    italic: true,
                    fontSize: 16,
                },
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
                chartArea:{left:50,top:20,width:"95%",height:"80%"},
                animation: {
                    duration: 1500,
                    startup: true
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
    $('#cloudWordsNumber').jQCloud(wordsNumber);

    hidePreloader();
}

/*===================================================================================================================
============================================== <!-- TEXT CHART --> ==================================================
===================================================================================================================*/
var tableContentText;
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
        var number = value[position + 1];
        var total = parseInt(value[value.length -1]);
        //if(count > 30127) {
        if(textArrg.length == 0){
            var x = {"text": text, "total": total, "loops": 1, 'number': number};
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
                var x = {"text": text, "total": total, "loops": 1,  'number': number};
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
    var faIcon = (globalTypeReport == 'Descargas') ? '<i class="fa fa-download"></i>' : '<i class="fa fa-eye"></i>';
    // tableContentText = $('#tableContentText').DataTable({
    //     columns : [
    //         {'title': '<i class="fa fa-newspaper-o"></i> Artículo',  'width': '80%'},
    //         {'title': faIcon + ' ' + globalTypeReport}
    //     ],
    // });
    // tableContentText.destroy();
    var tdataSet = [];

    var _textArrg = textArrg.sort(dynamicSort("total"));

    var rows;

    switch (textChartDraw) {
        case 'pie':
            rows = [
                ['Texto', 'Totales'],
            ];
            break;
        case 'column':
            rows = [
                ['Texto', 'Totales', { role: 'style' }],
            ];
            break;
        // case 'table':
        //     rows = [
        //         ['Texto', globalTypeReport],
        //     ];
        //     break;
    }
    var colors = [];

    $('#textList').empty();

    var previewLimit = 10;
    var countPreview = 0;
    $.each(_textArrg, function(index, v) {
        var colorhexa = colorHexa();
        var totals = v.total;
        var text = v.text;
        var number =  v.number;
        if(totals > 0){
            if(countPreview < previewLimit) {
                switch (textChartDraw) {
                    case 'pie':
                        var bar = [text, totals];
                        var color = {color: colorhexa};
                        colors.push(color);
                        break;
                    case 'column':
                        var bar = [text, totals, 'color: '+colorhexa];
                        break;
                    // case 'table':
                    //     var bar = [text, totals];
                    //     break;
                    // default:

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
            // var layer = '<div data-text="'+text+'"><h5 style="color: #72777a; font-weight: bold">'+abbreviateNumber(totals)+'</h5>\n' +
            //     '              <small style="color: #72777a">'+ globalTypeReport+' del <span style="font-weight: bold; color: #000">'+text+'</span></small>\n' +
            //     '              <span class="pull-right">'+per+'%</span>\n' +
            //     '              <div class="c-progress">\n' +
            //     '                <div class="c-progress-bar" style="width: '+per+'%; background: '+colorhexa+' !important">\n' +
            //     '                </div>\n' +
            //     '              </div></div>';
            //
            //
            // $('#textList').append(layer);

            var data = [
                number,
                text,
                $.number(totals),
            ];

            tdataSet.push(data);
        }
    });

    var data = google.visualization.arrayToDataTable(rows);
    var view = new google.visualization.DataView(data);

    var title = '';
    switch (globalTypeReport) {
        case 'Descargas':
            title = 'Principales artículos con mayores descargas';
            break;
        case 'Visitas':
            title = 'Principales artículos con mayores visitas';
            break;
    }
    // var title = 'Rating ' + previewLimit + ' de principales ' + globalTypeReport;

    switch (textChartDraw) {
        // case 'table':
        //     var chart = new google.visualization.Table(document.getElementById('chartContentText'));
        //     break;
        case 'pie':
            var options = {
                title: title,
                titleTextStyle: {
                    bold: true,
                    italic: true,
                    fontSize: 16,
                },
                is3D: true,
                chartArea:{left:10,top:20,width:"100%",height:"90%"},
                slices: colors
            };
            var chart = new google.visualization.PieChart(document.getElementById('chartContentText'));
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
                titleTextStyle: {
                    bold: true,
                    italic: true,
                    fontSize: 16,
                },
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
                chartArea:{left:50,top:20,width:"95%",height:"80%"},
                animation: {
                    duration: 1500,
                    startup: true
                },
            };

            var chart = new google.visualization.ColumnChart(document.getElementById("chartContentText"));
            break;
    }

    google.visualization.events.addListener(chart, 'ready', function () {
        imageChartText = chart.getImageURI();
    });

    chart.draw(view, options);
    hidePreloader();

    $('#tableContentTextLabel').html('<i class="fa fa-newspaper-o"></i> Lista de todos los artículos ordenados por el total de '+ globalTypeReport +' de mayor a menor<small class="pull-right">Artículos totales: ' + $.number(countPreview) + '</small>');

    currentLang = 'es';
    dataTableLangeURL = (currentLang == 'es')
    ? '//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json'
    : '//cdn.datatables.net/plug-ins/1.10.19/i18n/English.json';

    if ( $.fn.dataTable.isDataTable( '#tableContentText' ) ) {

    } else {
        var faIcon = (globalTypeReport == 'Descargas') ? '<i class="fa fa-download"></i>' : '<i class="fa fa-eye"></i>';

        tableContentText =  $('#tableContentText').DataTable({
            columns : [
                {'title': '# Número', 'width': '10%'},
                {'title': '<i class="fa fa-newspaper-o"></i> Artículo'},
                {'title': faIcon + ' ' + globalTypeReport, 'width': '15%'}
            ],
            data: tdataSet,
            "ordering": false,
            "order": [[ 1, "desc" ]],
            "language": {
                "url": dataTableLangeURL
            },
            responsive: true,
        });
    }
}

/*===================================================================================================================
============================================== <!-- ROLES CHART --> =================================================
===================================================================================================================*/
var cloudWordsRolesStatus = 0,
    rolesTypePie = '';
$(document).on('click', '.switchUserChart', function() {
    //$('.switchUserChart').click(function () {
    rolesChartDraw = $(this).data('chart');

    switch (rolesChartDraw) {
        case 'column':
            rolesTypeColumn = $(this).data('typecolumn');
            break;
        case 'pie':
            rolesTypePie = $(this).data('typepie');
            break;
    }
    //rolesTypeColumn = $(this).data('typecolumn');

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
    $('#rolesPieChartList').empty();

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
                // var text = roleType + '('+totals+')' + ' ' + globalTypeReport;
                // var bar = [text, totals];
                // d.push(bar);

                if(rolesTypePie == roleType){
                    d.push(['Nacional - ' + totalNational + ' usuarios', totalNational]);
                    colors.push({color: '#006D49'});
                    d.push(['Internacional - ' + totalInternational + ' usuarios', totalInternational]);
                    colors.push({color: '#F6E300'});
                    d.push(['Desconocido - ' + totalUnknown + ' usuarios', totalUnknown]);
                    colors.push({color: '#E6E7E9'});

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

                    // var layer = '<div><h5 style="color: #72777a; font-weight: bold">'+abbreviateNumber(totals)+'</h5>\n' +
                    //     '              <small style="color: #72777a">'+ globalTypeReport+' de tipo <span style="font-weight: bold; color: #000">'+roleType+'</span></small>\n' +
                    //     '              <span class="pull-right">'+per+'% Totales</span>\n' +
                    //
                    //     '              <div class="c-progress">\n' +
                    //     '                <div class="c-progress-bar" style="width: '+per+'%; background: '+colorHex+' !important;"></div>\n' +
                    //
                    //     '              </div></div>';
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
                        '              <small style="color: #72777a">'+ globalTypeReport+' de tipo <span style="font-weight: bold; color: #000">'+roleType+'</span></small>\n' +
                        '              <span class="pull-right">'+per+'% Totales</span><br>\n' +
                        '              <div style="width:100%"><small style="font-weight: bold; color: #000">Nacional: '+abbreviateNumber(totalNational)+'</small><small class="pull-right">'+perNat+'%</small></div>'+
                        '              <div style="width:100%"><small style="font-weight: bold; color: #000">Intenacional: '+abbreviateNumber(totalInternational)+'</small><small class="pull-right">'+perInternat+'%</small></div>'+
                        '              <div style="width:100%"><small style="font-weight: bold; color: #000">Desconocido: '+abbreviateNumber(totalUnknown)+'</small><small class="pull-right">'+perUnknown+'%</small></div>'+
                        '              <div class="c-progress">\n' +
                        '                <div class="c-progress-bar" style="width: '+perNat+'%; background: '+colors[0].color+' !important; float:left"></div>\n' +
                        '                <div class="c-progress-bar" style="width: '+perInternat+'%; background: '+colors[1].color+' !important; float:left"></div>\n' +
                        '              </div></div>';

                    $("#usersList").append(layer);
                }


                break;
            case 'column':
                var bar = [
                    roleType+'('+totals+')',
                    totalNational,
                    totalInternational,
                    totalUnknown,
                    ''
                ];
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
                    '              <small style="color: #72777a">'+ globalTypeReport+' de tipo <span style="font-weight: bold; color: #000">'+roleType+'</span></small>\n' +
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

        var options = '<li class="switchUserChart" data-chart="pie" data-typepie="'+roleType+'"><a href="javascript:void(0)"><i class="fa fa-user"></i> '+roleType+'</a></li>';
        $('#rolesPieChartList').append(options);

        var word = {text: roleType, weight: totals};
        wordsRoles.push(word);
    });

    var data = google.visualization.arrayToDataTable(d);
    var view = new google.visualization.DataView(data);
    var title = 'Tipos de usuario registrados';

    switch (rolesChartDraw){
        case 'pie':
            title = 'Gráfica comparativa por usuario de tipo Autor';
            var options = {
                title: title,
                titleTextStyle: {
                    bold: true,
                    italic: true,
                    fontSize: 16,
                },
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
                titleTextStyle: {
                    bold: true,
                    italic: true,
                    fontSize: 16,
                },
                bar: {groupWidth: "70%"},
                legend: { position: "top" },
                height: "500",
                vAxis: {
                    title: globalTypeReport,
                    gridlines: {count: gridlinesCount},
                    format: 'short',
                },
                hAxis: {
                    title: 'Tipo de usuarios',
                },
                isStacked: Boolean(isStacked),
                series: {
                    0:{color:colors[0]},
                    1:{color:colors[1]},
                    2:{color:colors[2]},
                },
                animation: {
                    duration: 1500,
                    startup: true
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

    hidePreloader();
}

function drawRolesMap(countries, gtotals, role, national) {
    $('#relesMainChart, #rolesOptionMain').hide();
    $('#rolesMapChart, #rolesOptionSecond').show();
    $('#rolesListMaps').empty();



    $('.switchUserChart').hide();//.removeClass('btn-primary').addClass('btn-default');
    $('.backUserRole').show();

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
            '              <small style="color: #72777a">Usuarios en <span style="font-weight: bold; color: #000">'+country+'</span></small>\n' +
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
        textLegend = '<strong style="color: #A41C1E">'+gtotals+'</strong> usuarios de tipo <strong style="color: #A41C1E">' + role + '</strong> en <strong style="color: #A41C1E">' + countriesCounter + ' en México</strong>';
    } else {
        var options = {
            height: "400",
            colorAxis: {colors: ['#fff310', '#dcd100']},
        };
        var foo = (countriesCounter > 1) ? 'países' : 'países';
        textLegend = '<strong style="color: #A41C1E">'+gtotals+'</strong> usuarios de tipo <strong style="color: #A41C1E">' + role + '</strong> en <strong style="color: #A41C1E">' + countriesCounter + ' '+ foo +'</strong>';
    }

    var panelTitle = 'Usuarios internacionales de tipo ' + role;
    var panelTitleCloudWords = 'Nube de palabras con países de usuarios de tipo ' + role;
    $('#panelTitleRoles').text(panelTitle);
    $('#panelTitleCloudWordsRoles').text(panelTitleCloudWords);

    $('#rolesMapLegend').html(textLegend);

    var chart = new google.visualization.GeoChart(document.getElementById('chartContentRolesMaps'));

    google.visualization.events.addListener(chart, 'ready', function () {
        imageChartRolesNationality = chart.getImageURI();
    });

    chart.draw(data, options);
    $('#cloudWordsRoles').jQCloud('update', wordsRoles);
}

$('.backUserRole').click(function(){
    $('.switchUserChart').show().first().click();
    $(this).hide();
    panelTitle = 'Gráfica comparativa por tipo de usuario';
    panelTitleCloudWords = 'Nube de palabras por tipo de usuario';
    $('#panelTitleRoles').text(panelTitle);
    $('#panelTitleCloudWordsRoles').text(panelTitleCloudWords);

    $('#rolesOptionMain').show();
    $('#rolesOptionSecond').hide();
});

/*===================================================================================================================
============================================ <!-- Genders CHART --> =================================================
===================================================================================================================*/
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

    var colors = [];
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
            // d = [
            //     ['Géneros', 'Nacional', 'Internacional', 'Desconocido', { role: 'annotation' }],
            // ];
            // colors = ['#0081a0', '#00BFEC', '#E6E7E9'];
            // isStacked = true;
            break;
    }


    $("#gendersList").empty();

    $.each(_gendersObj, function(index, v){

        //var colorHex = colorHexa();
        var gEsName = v.esname;
        var gEnName = v.enname;
        var shortName = v.shortname;
        var totals = v.totals;

        var countries = v.countries;
        var totalNational = 0;
        var totalUnknown = 0;
        var totalInternational = 0;
        //definir idioma
        var gender = gEsName;
        var colorHex =  shortName == 'M' ? '#00BFEC' :
                        shortName == 'F' ? '#E15BB7' :
                        '#ffff00';

        // for(i in countries) {
        //     switch (countries[i]) {
        //         case 'MX':
        //             totalNational = totalNational + 1;
        //             break;
        //         case 'UNK':
        //             totalUnknown = totalUnknown + 1;
        //             break;
        //         default:
        //             totalInternational = totalInternational + 1;
        //     }
        // }

        // var per = (totals / globalTotals) * 100;
        // if(per < parseFloat(1.0)) {
        //     per = 1;
        // } else {
        //     per = Math.round(per);
        // }
        var per = Math.round((totals / globalTotals) * 100);

        switch (gendersChartDraw){
            case 'pie':
                var text = gender + '('+totals+')';
                var bar = [text, totals];
                d.push(bar);

                var color = {color: colorHex};
                colors.push(color);

                // var layer = '<div><h5 style="color: #72777a; font-weight: bold">'+abbreviateNumber(totals)+'</h5>\n' +
                //     '              <small style="color: #72777a">'+ globalTypeReport+' de género <span style="font-weight: bold; color: #000">'+gender+'</span></small>\n' +
                //     '              <span class="pull-right">'+per+'%</span>\n' +
                //     '              <div class="c-progress">\n' +
                //     '                <div class="c-progress-bar" style="width: '+per+'%; background: '+colorHex+' !important;">\n' +
                //     '                </div>\n' +
                //     '              </div></div>';
                //
                // $("#gendersList").append(layer);
                break;
            case 'column':
                var bar = [gender+'('+totals+')', totals, 'color: '+colorHex];
                d.push(bar);

                // var bar = [
                //     gender+'('+totals+')',
                //     totalNational,
                //     totalInternational,
                //     totalUnknown,
                //     ''
                // ];
                // d.push(bar);


                break;
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
    var title = 'Usuarios registrados por géneros';

    switch (gendersChartDraw){
        case 'pie':
            var options = {
                title: title,
                titleTextStyle: {
                    bold: true,
                    italic: true,
                    fontSize: 16,
                },
                is3D: true,
                chartArea:{left:10, top:20, width:"100%", height:"90%"},
                slices: colors
            };
            var chart = new google.visualization.PieChart(document.getElementById("chartContentGenders"));
            break;
        case 'column':
            // view.setColumns([
            //     0,
            //     1,
            //     {
            //         calc: "stringify",
            //         sourceColumn: 1,
            //         type: "string",
            //         role: "annotation"
            //     },
            //     2
            // ]);

            var options = {
                title: title,
                titleTextStyle: {
                    bold: true,
                    italic: true,
                    fontSize: 16,
                },
                bar: {groupWidth: "70%"},
                legend: { position: "none" },
                height: "400",
                vAxis: {
                    title: globalTypeReport,
                    gridlines: {count: gridlinesCount},
                    format: 'short',
                },
                hAxis: {
                    title: 'Géneros',
                },
                animation: {
                    duration: 1500,
                    startup: true
                },
                chartArea:{left:50, top:20, width:"100%", height:"80%"},
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

    hidePreloader();
}

/*===================================================================================================================
============================================ <!-- AFFILIATION CHART --> =============================================
===================================================================================================================*/
var affiliationArrg = [
    {'affiliation': jnalAffiliation, 'totals': 0},
    {'affiliation': 'Otros', 'totals': 0},
    {'affiliation': 'Desconocido', 'totals': 0},
];

$('.switchAffiliationChart').click(function () {
    affiliationChartDraw = $(this).data('chart');
    if(!$(this).hasClass('btn-primary')) {
        $('.switchAffiliationChart').removeClass('btn-primary').addClass('btn-default');
        $(this).addClass('btn-primary');
    }
    google.charts.setOnLoadCallback(drawChartAffiliation);
});

function processDataAffiliation(){
    google.charts.setOnLoadCallback(drawChartAffiliation);
}

function drawChartAffiliation(){
    var _affiliationArrg = affiliationArrg.sort(dynamicSort("totals"));

    var d,
        isStacked,
        colors = [];

    switch (affiliationChartDraw) {
        case 'pie':
            d = [
                ['Afiliación', 'total'],
            ];
            break;
        case 'column':
             d = [
                ['Afiliación', 'total', { role: 'style' }],
            ];
            break;
    }


    $.each(_affiliationArrg, function(index, v) {
        var affiliation = v.affiliation;
        var totals = v.totals;

        switch (affiliation) {
            case 'Otros':
                color =  '#0000ff';
                break;
            case 'Desconocido':
                color = '#E6E7E9';
                break;
            default:
                color = '#A41C1E';
        }

        switch (affiliationChartDraw) {
            case 'pie':
                var text = affiliation;
                var bar = [text, totals];
                d.push(bar);
                var color = {color: color};
                colors.push(color);
                break;
            case 'column':
                var data = [affiliation, totals, 'color:' + color];
                d.push(data);
                break;
        }

    });

    var data = google.visualization.arrayToDataTable(d);
    var view = new google.visualization.DataView(data);
    var title = 'Usuarios registrdos por afiliación';

    switch (affiliationChartDraw){
        case 'pie':
            var options = {
                title: title,
                titleTextStyle: {
                    bold: true,
                    italic: true,
                    fontSize: 16,
                },
                is3D: true,
                chartArea:{left:10, top:20, width:"100%", height:"90%"},
                slices: colors
            };
            var chart = new google.visualization.PieChart(document.getElementById("chartContentAffiliation"));
            break;
        case 'column':
            var options = {
                title: title,
                titleTextStyle: {
                    bold: true,
                    italic: true,
                    fontSize: 16,
                },
                bar: {groupWidth: "70%"},
                legend: { position: "none" },
                height: "500",
                vAxis: {
                    title: globalTypeReport,
                    gridlines: {count: gridlinesCount},
                    format: 'short',
                },
                hAxis: {
                    title: 'Afiliación',
                },
                chartArea:{left:50, top:50, width:"100%", height:"80%"},
                animation: {
                    duration: 1500,
                    startup: true
                },
            };

            var chart = new google.visualization.ColumnChart(document.getElementById("chartContentAffiliation"));
            break;
    };

    google.visualization.events.addListener(chart, 'ready', function () {
        imageChartAffiliation = chart.getImageURI();
    });
    chart.draw(view, options);

    hidePreloader();
}

/*===================================================================================================================
========================================== <!-- ACCEPTED/REFUSED CHART --> ==========================================
===================================================================================================================*/

$('.switchAcceptedRefusedChart').click(function () {
    acceptedRefusedChartDraw = $(this).data('chart');
    if(!$(this).hasClass('btn-primary')) {
        $('.switchAcceptedRefusedChart').removeClass('btn-primary').addClass('btn-default');
        $(this).addClass('btn-primary');
    }
    google.charts.setOnLoadCallback(drawChartAcceptedRefused);
});


function processDataAcceptedRefused(position){
    $.each(dataSet, function(index, v) {
        if(v[position]){
            var match = 0;
            if(acceptedRefusedArrg.length > 0){
                // passes match = 0;
                for(var i in acceptedRefusedArrg) {
                    if(acceptedRefusedArrg[i].statusArt == v[position]){
                        acceptedRefusedArrg[i].totals = acceptedRefusedArrg[i].totals + 1;
                        match = 1;
                    }
                }
            }

            if(!Boolean(match)){
                let data = {'statusArt': v[position], 'totals': 1};
                acceptedRefusedArrg.push(data);
            }
        }
    });

    //console.log(acceptedRefusedArrg);
    // var chart = function() { drawChartAcceptedRefused(position) };
    // google.charts.setOnLoadCallback(chart);
    google.charts.setOnLoadCallback(drawChartAcceptedRefused);
}

function drawChartAcceptedRefused(){
    var _acceptedRefusedArrg = acceptedRefusedArrg.sort(dynamicSort("totals"));

    var colors = [],
        d;

    switch (acceptedRefusedChartDraw) {
        case 'pie':
            d = [
                ['Estado', 'Total'],
            ];
            break;
        case 'column':
            d = [
                ['Estado', 'Total', { role: 'style' }],
            ];
            break;
    }

    $.each(_acceptedRefusedArrg, function(index, v) {
        //show all typeData
        var statusArt = v.statusArt;
        var totals = v.totals;
        var colorHex = ['#006400', '#cb171b', '#FDF720', '#CBC717'];
        //['Sin decidir', 'Aceptar el texto', 'Rechazado', 'Aceptar con modificaciones']
        //if(statusArt == 'Aceptar el texto' || statusArt == 'Rechazado'){
            let data;
            switch (statusArt) {
                case 'Aceptar el texto':
                    defindColor = colorHex[0];
                    statusArt = 'Aceptado';
                    break;
                case 'Rechazado':
                    defindColor = colorHex[1];
                    break;
                case 'Sin decidir':
                    defindColor = colorHex[2];
                    break;
                case 'Aceptar con modificaciones':
                    defindColor = colorHex[3];
                    break;
            }

            switch (acceptedRefusedChartDraw) {
                case 'pie':
                    data = [statusArt + ' (' + $.number(totals) + ')', totals];
                    d.push(data);

                    let color = {color: defindColor};
                    colors.push(color);
                    break;
                case 'column':
                    data = [statusArt, totals, 'color:' + defindColor];
                    d.push(data);
                    break;
            }
        //}//end if
    });

    var data = google.visualization.arrayToDataTable(d);
    var view = new google.visualization.DataView(data);
    var title = 'Decisión editorial de los artículos';
    var options,
        chart;

    switch (acceptedRefusedChartDraw){
        case 'pie':
            options = {
                title: title,
                titleTextStyle: {
                    bold: true,
                    italic: true,
                    fontSize: 16,
                },
                is3D: true,
                chartArea:{left:10, top:20, width:"100%", height:"90%"},
                slices: colors
            };
            chart = new google.visualization.PieChart(document.getElementById('chartContentAcceptedRefused'));
            break;
        case 'column':
            options = {
                title: title,
                titleTextStyle: {
                    bold: true,
                    italic: true,
                    fontSize: 16,
                },
                bar: {groupWidth: '70%'},
                legend: { position: 'none' },
                height: '500',
                vAxis: {
                    title: globalTypeReport,
                    gridlines: {count: gridlinesCount},
                    format: 'short',
                },
                hAxis: {
                    title: 'Decisión editorial',
                },
                chartArea:{left:50, top:50, width: '100%', height: '80%'},
                animation: {
                    duration: 1500,
                    startup: true
                },
            };

            chart = new google.visualization.ColumnChart(document.getElementById('chartContentAcceptedRefused'));
            break;
    };

    google.visualization.events.addListener(chart, 'ready', function () {
        imageChartAcceptedRefused = chart.getImageURI();
    });
    chart.draw(view, options);
    hidePreloader();
}

/*==================================================================================================================
============================================== TIPO ITEM CHART =====================================================
==================================================================================================================*/
$('.switchTypeItemChart').click(function() {
    tipoItemChartDraw = $(this).data('chart');
    if(!$(this).hasClass('btn-primary')) {
        $('.switchTypeItemChart').removeClass('btn-primary').addClass('btn-default');
        $(this).addClass('btn-primary');
    }
    google.charts.setOnLoadCallback(drawChartTypeItem);
});

function processDataTipoItem(position){
    $.each(dataSet, function(index, v) {
        if(v[position]){
            let match = 0;
            if(tipoItemArrg.length > 0){
                for(var i in tipoItemArrg) {
                    if(tipoItemArrg[i].text == v[position]){
                        tipoItemArrg[i].totals = tipoItemArrg[i].totals + 1;
                        match = 1;
                    }
                }
            }

            if(!Boolean(match)) {
                let data = {'text': v[position], 'totals': 1};
                tipoItemArrg.push(data);
            }
        }
    });
    // end each
    google.charts.setOnLoadCallback(drawChartTypeItem);
}

function drawChartTypeItem(){
    let _tipoItemArrg = tipoItemArrg.sort(dynamicSort('totals'));

    var colors = [],
        d;

    switch (tipoItemChartDraw) {
        case 'pie':
            d = [
                ['Item', 'Totals']
            ];
            break;
        case 'column':
            d = [
                ['Item', 'Total', {role : 'style'}]
            ];
            break;
    }
    // end switch

    $.each(_tipoItemArrg, function(index, v) {
        let text = v.text;
        let totals = v.totals;
        let data;
        let colorHex = colorHexa();

        switch (tipoItemChartDraw) {
            case 'pie':
                data = [text, totals];
                let color = {'color': colorHex};
                colors.push(color);
                break;
            case 'column':
                data = [text, totals, 'color:' + colorHex];
                break;
        }
        d.push(data);
    });

    var data = google.visualization.arrayToDataTable(d);
    var view = new google.visualization.DataView(data);
    var title = '',
        el = document.getElementById('chartContentTypeItems'),
        options,
        chart;

    switch (tipoItemChartDraw) {
        case 'pie':
            options = {
                title: title,
                titleTextStyle: {
                    bold: true,
                    italic: true,
                    fontSize: 16,
                },
                is3D: true,
                chartArea: {left: 10, top: 50, width: '100%', height: '90%'},
                slices: colors
            };

            chart =  new google.visualization.PieChart(el);
            break;
        case 'column':
            options = {
                title: title,
                titleTextStyle: {
                    bold: true,
                    italic: true,
                    fontSize: 16,
                },
                bar: {groupWidth: '70%'},
                legend: {position: 'none'},
                height: '500',
                vAxis: {
                    title: globalTypeReport,
                    gridlines: {count: gridlinesCount},
                    format: 'short',
                },
                hAxis: {
                    title: 'Tipos'
                },
                chartArea: {left: 100, top: 50, width: '100%', height: '80%'},
                animation: {
                    duration: 1500,
                    startup: true
                },
            };

            chart = new google.visualization.ColumnChart(el);
            break;
    }

    google.visualization.events.addListener(chart, 'ready', function() {
        imageChartTypeItems = chart.getImageURI();
    });

    chart.draw(view, options);
    hidePreloader();
}

/*==================================================================================================================
============================================== CONFIG FUNCTIONS ====================================================
==================================================================================================================*/
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
        case 'roleDesglose':
            image = imageChartRolesNationality;
            name = globalTypeReport+'-por-nacionalidad';
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
        case 'affiliation':
            image = imageChartAffiliation;
            name =  globalTypeReport+'-por-afiliación';
            typeReport = 'Afiliación';
            icon = '<i class="fa fa-handshake-o"></i>';
            pass = true;
            break;
        case 'acceptedRefused':
            image = imageChartAcceptedRefused;
            name = globalTypeReport + '-por-decision-editorial';
            typeReport = 'Decisión editorial';
            icon = '<i class="fa fa-check-square-o"></i>';
            pass = true;
            break;
        case 'typeItems':
            image = imageChartTypeItems;
            name = globalTypeReport + '-por-items';
            typeReport = 'Tipo item';
            icon = '';
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

    var theresRoles = 0;

    headers.forEach(function (value, index) {
        //console.log(value);
        if(value != 'Tipo' && value != 'Revista' && value != 'Total') {
            var orderId = 0,
                passes = 0,
                icon;

            switch (value) {
              case 'Total':
                orderId = 1;
                icon = '<i class="fa fa-trophy" style="color: gold;"></i>';
                passes = 1;
                break;
              case 'País':
                orderId = 2;
                icon = '<i class="fa fa-globe" style="color: dodgerblue;"></i>';
                passes = 1;
                break;
              case 'Ciudad':
                orderId = 3;
                icon = '<i class="fa fa-building" style="color: cadetblue;"></i>';
                passes = 1;
                break
              case 'Mes':
                orderId = 4;
                icon = '<i class="fa fa-calendar" style="color: darkred"></i>';
                passes = 1;
                break;
              case 'Número':
                orderId = 5;
                icon = '<i class="fa fa-hashtag" style="color: darkgreen"></i>';
                passes = 1;
                break;
              case 'Texto':
                orderId = 6;
                icon = '<i class="fa fa-newspaper-o"></i>';
                passes = 1;
                value = 'Artículos';
                break;
              case 'Roles':
                orderId = 3;//3
                icon = '<i class="fa fa-users" style="color: #555e81;"></i>';
                passes = 1;
                break;
              case 'Géneros':
                orderId = 5;//5
                icon = '<i class="fa fa-transgender" style="color: #00adc1;"></i>';
                passes = 1;
                break;
             case 'Afiliación':
                orderId = 6;//6
                icon = '<i class="fa fa-handshake-o" style="color: purple;"></i>';
                passes = 1;
                break;
            case 'Decisión del director':
                orderId = 7;
                icon = '<i class="fa fa-check-square-o" style="color: #CBC717"></i>';
                value = 'Decisión editorial';
                passes = 1;
                break;
            }

            if(Boolean(passes)) {
                // if(globalTypeReport == 'Artículos') {
                //         input ='<li class="list-group-item" id="orderId'+orderId+'"><label style="width: 100%;">'+icon+' '+_value+' <input type="checkbox" name="checkChart" data-index="'+index+'"  data-typechart="'+value+'" value="'+value+'" class="pull-right"></label></li>';
                // }
                input ='<li class="list-group-item" id="orderId'+orderId+'"><label style="width: 100%;">'+icon+' '+value+' <input type="checkbox" name="checkChart" data-index="'+index+'"  data-typechart="'+value+'" value="'+value+'" class="pull-right"></label></li>';

                if(value == 'Roles') {
                    input+= '<li class="list-group-item" id="orderId4" style="display:none"><label>Lista de Roles</label><ul class="list-group">';
                    headersRolesArray.forEach(function(value, index){
                        input+= '<li class="list-group-item"><label style="width: 100%;"><i class="fa fa-user" style="color: #555e81;"></i> '+value+' <input type="checkbox" name="checkChartRole" data-index="'+index+'"  data-typerole="'+value+'" value="'+value+'" class="pull-right"></label></li>';
                    });
                    input+= '</ul></li>';
                }
                chartList.append(input);
            }

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
                            theresRoles = 1;
                            $('#orderId4').css('display', 'block');
                        }
                    }
                }
            });
        });
    });


    if(globalTypeReport == 'Usuarios'){
        if(theresRoles == 1){
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
                'fileId' : globalFileId,
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

/*==================================================================================================================
============================================== EXTRA FUNCTIONS =====================================================
==================================================================================================================*/
function copyToClipboard(element_id) {
    var aux = document.createElement("input");
    aux.setAttribute("value", $('#'+element_id).text());//document.getElementById(element_id).innerHTML);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    $('#shareChartsAlert').slideDown('slow');
}

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
    let newValue = value;
    const suffixes = ["", "K", "M", "B","T"];
    let suffixNum = 0;
    while (newValue >= 1000) {
        newValue /= 1000;
        suffixNum++;
    }

    newValue = newValue.toPrecision(3);

    newValue += suffixes[suffixNum];
    return newValue;
}

function dateFormat(date, lang, fileUserName){
	var date = new Date(date),
        months,
        dateFormat;

	switch (lang) {
		case 'es':
			months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septimbre", "Octube", "Nomviembre", "Diciembre"];
			dateFormat = 'Subido por ' + fileUserName + ' el ' + date.getDate() + ' de ' + months[date.getMonth()] + ' de ' + date.getFullYear();
		    dateFormat += ' ' + date.toLocaleString("en-EU", { hour: "numeric", minute: "numeric", hour12: true });
			return dateFormat;
			break;
		case 'en':
			months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			dateFormat = 'Uploaded by ' + fileUserName + ' on ' + months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
			dateFormat += ' ' + date.toLocaleString("en-EU", { hour: "numeric", minute: "numeric", hour12: true });
			return dateFormat;
			break;
	}
}

// function abbreviateNumber(value) {
//     var newValue = value;
//     if (value >= 1000) {
//         var suffixes = ["", "k", "m", "b","t"];
//         var suffixNum = Math.floor( (""+value).length/3 );
//         var shortValue = '';
//         for (var precision = 2; precision >= 1; precision--) {
//             shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
//             var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
//             if (dotLessShortValue.length <= 2) { break; }
//         }
//         if (shortValue % 1 != 0)  shortNum = shortValue.toFixed(1);
//         newValue = shortValue+suffixes[suffixNum];
//     }
//     return newValue;
// }
