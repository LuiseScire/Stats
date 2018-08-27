

//config required for each views
var displayDateES, displayDateEN, translate = [];
switch (currentLang) {
	case 'es':
		for(var i in esObject) {
			translate[i] = esObject[i];
		}
        //show date in historical
		displayDateES = 'display: block';
		displayDateEN = 'display: none';
		break;
	case 'en':
		for(var i in enObject) {
			translate[i] = enObject[i];
		}
        //show date in historical
		displayDateES = 'display: none';
		displayDateEN = 'display: block';
		break;
}
// end config required for each views

/*uploadcsv*/
var fileNameConfirmed;
var changeFile = 0;

//datos globales para validar si existe el documento
var deleteExist = 0,
		csvFile, fileName, storageFileName;

var fileSizeExceeded = 0;

var globalTypeReport, globalTypeReportAllowed;

var preViewTable;

// guarda los indices del tipo de gráfica que se mostrará
var indexArray = [];
// guarda los indices extra del tipo de gráfica que se mostrará
//por ejemplo 'usuarios' del tipo de gráfica 'Roles'
var indexArrayRole = [];

/*end uploadcsv*/

var totalFiles = 0;

var words = [];

$(document).ready(function(){
    $('.global-item-menu').css('display', 'none');
    $('.home-item-menu').css('display', 'block');
    /*setTimeout(function () {
        var urlHASH = window.location.hash;
        $('a.link-menu[href="'+urlHASH+'"]').click();
    }, 500);*/
    validateExistFiles();
});
/*=============================================================
==================== [ H I S T O R I A L ] ====================
=============================================================*/

/*========================================
Validar si el usuario ha subido documentos
========================================*/
function validateExistFiles(){
  var data = {'_token': CSRF_TOKEN};
  $.ajax({
    type: "POST",
    url: "listcsvfiles",
    data: data,
    dataType: "JSON",
    success: function(response){
      var count = 0;

      $.each(response.filesList, function(index, v) {
          var csvId = v.file_id;
          var csvName = v.file_front_name;
          var csvDBName = v.file_back_name;
          var csvPath = v.file_path;
          var csvStatus = v.file_status;
          var csvVersion = v.file_version;
          var csvTimestamp = v.file_timestamp;
          var csvTypeReport = v.file_report_name;

          var fileName;

          if(csvVersion == null) {
              fileName = csvName;
          } else {
              fileName = csvName + "(" + csvVersion + ")";
          }

          var item = '<div id="itemFile'+csvId+'" class="media">\n' +
              '        <div class="media-left">\n' +
              '          <a href="javascript:void(0)" class="csv-file-item" data-csvname="'+csvDBName+'">\n' +
              '            <img class="media-object" src="../public/images/csv-file-primary-color.svg" alt="icon" width="64px" height="64px">\n' +
              '          </a>\n' +
              '        </div>\n' +
              '        <div class="media-body" style="color: #E05740">\n' +
              '          <h4 class="media-heading csv-file-item" data-csvname="'+csvDBName+'" style="color: #A41C1E; cursor: pointer">'+fileName+'</h4>\n' +
              '          <span class="fa fa-trash fa-lg pull-right" style="cursor: pointer" onClick="deleteItem('+csvId+', '+"'"+fileName+"'"+')"></span>'+
                            csvTypeReport +
			  '				<br>'+
              '             <small class="date-format-es" style="color: #72777a; '+displayDateES+'">'+dateFormat(csvTimestamp, 'es') +'</small>' +
			  '             <small class="date-format-en" style="color: #72777a; '+displayDateEN+'">'+dateFormat(csvTimestamp, 'en') +'</small>' +
              '        </div>\n' +
              '      </div>';

          $("#csvList").append(item);

          count++;
      });

      if(count > 0){
          totalFiles = count;
          var lastElement = response.filesList[0];
          var typeReport = lastElement.file_report_index;
          var getCsvFile = '/public'+lastElement.file_path;
          var fileName = lastElement.file_back_name;
          var _fileName = lastElement.file_front_name;
          var csvTypeReport = lastElement.file_report_name;

          $('.fileNamePanels').text(_fileName);
          $('.typeReportPanels').text(csvTypeReport);
          $('.seeAgain').data('csvname', fileName);


          //getCsv(getCsvFile, typeReport, fileName);
		  var typeReport = 0,
		  	  totals = 0,
			  countCountries = 0,
			  mainCountry = '';

		  var v = response.lastFileData;

          createHeaderBlocks(v, fileName);

          $('#tabHistory, #graphicAgainPanel').show();
          fadeOutLoader();
      } else {
          $("#noFiles, #uploadFilesContent").css('display', 'block');
          $('#btnGlobalOpenFile').hide();
          fadeOutLoader();
      }
    }
  });
}

function isThereFiles(){

}

/*========================================
En el caso de que existan documentos verifica
qué tipo de reporte es para general la información
de los bloques de colores
========================================*/
function createHeaderBlocks(v, fileName) {
    var showBlockOne = 0,
        showBlockTwo = 0,
        showBlockThree = 0;

    var blocks = '';

    var typeReport = v.last_type,
        block_one = v.last_block_one,
        block_two = v.last_block_two,
        block_three = v.last_block_three;


    var totalsIcon = '',
        blockTwoIcon = '',
        dataBlockTwo,
        dataTextBlockTwo,
        dataBlockThree,
        dataTextBlockThree;

    switch (typeReport){
        case 'Descargas':
            totalsIcon = '<i class="fa fa-download fa-5x"></i>';
            showBlockOne = 1;

            blockTwoIcon = '<i class="fa fa-globe fa-5x"></i>';
            dataBlockTwo = 'En ' + block_two;
            dataTextBlockTwo = 'Países';
            showBlockTwo = 1;


            var mcountry = block_three.split(',');
            nameCountry = mcountry[0];
            totalsCountry = mcountry[1];

            var totls = $.number(totalsCountry);

            dataBlockThree = nameCountry;
            dataTextBlockThree = 'Con '+totls+' '+typeReport;
            showBlockThree = 1;

            break;
        case 'Visitas':
            totalsIcon = '<i class="fa fa-eye fa-5x"></i>';
            showBlockOne = 1;

            blockTwoIcon = '<i class="fa fa-globe fa-5x"></i>';
            dataBlockTwo = 'En ' + block_two;
            dataTextBlockTwo = 'Países';
            showBlockTwo = 1;

            var mcountry = block_three.split(',');
            nameCountry = mcountry[0];
            totalsCountry = mcountry[1];

            var totls = $.number(totalsCountry);

            dataBlockThree = nameCountry;
            dataTextBlockThree = 'Con '+totls+' '+typeReport;
            showBlockThree = 1;

            break;
        case 'Usuarios':
            showBlockOne = 1;
            totalsIcon = '<i class="fa fa-users fa-5x"></i>';

            blockTwoIcon = '<i class="fa fa-user fa-5x"></i>';
            dataBlockTwo = block_two;
            dataTextBlockTwo = 'Tipos de usuarios';
            showBlockTwo = 1;
            break;
    }


    if(showBlockOne){
        blocks = '<div class="col-lg-4 col-md-4">'+
                    '<div class="panel panel-primary">'+
                        '<div class="panel-heading">'+
                            '<div class="row">'+
                                '<div id="panelTotalIcon" class="col-xs-4">'+
                                     totalsIcon +
                                '</div>'+
                                '<div class="col-xs-8 text-right">'+
                                    '<div id="panelTotals" class="huge">'+abbreviateNumber(block_one)+'</div>'+
                                    '<div id="panelTotalsText">'+typeReport+'</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                        '<a id="panelTotalsDetails" href="estadisticas/archivo/'+fileName+'">'+
                            '<div class="panel-footer">'+
                                '<span class="pull-left" data-lang="panel-view-details">Ver Detalles</span>'+
                                '<span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>'+
                                '<div class="clearfix"></div>'+
                            '</div>'+
                        '</a>'+
                    '</div>'+
                '</div>';
    }

    if(showBlockTwo) {
        blocks += '<div class="col-lg-4 col-md-4">'+
                    '<div class="panel panel-green">'+
                        '<div class="panel-heading">'+
                            '<div class="row">'+
                                '<div class="col-xs-4">'+
                                    blockTwoIcon +
                                '</div>'+
                                '<div class="col-xs-8 text-right">'+
                                    '<div id="panelCountries" class="huge">'+dataBlockTwo+'</div>'+
                                    '<div>'+dataTextBlockTwo+'</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                        '<a id="panelCountriesDetails" href="estadisticas/archivo/'+fileName+'">'+
                            '<div class="panel-footer">'+
                                '<span class="pull-left" data-lang="panel-view-details">Ver Detalles</span>'+
                                '<span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>'+
                                '<div class="clearfix"></div>'+
                            '</div>'+
                        '</a>'+
                    '</div>'+
                '</div>';
    }

    if(showBlockThree){
        blocks += '<div class="col-lg-4 col-md-4">'+
                    '<div class="panel panel-yellow">'+
                        '<div class="panel-heading">'+
                            '<div class="row">'+
                                '<div class="col-xs-4">'+
                                    '<i class="fa fa-line-chart fa-5x"></i>'+
                                '</div>'+
                                '<div class="col-xs-8 text-right">'+
                                    '<div id="panelMainCountry" class="huge">'+dataBlockThree+'</div>'+
                                    '<div id="panelMainCountryText">'+dataTextBlockThree+'</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                        '<a id="panelMainCountryDetails" href="estadisticas/archivo/'+fileName+'">'+
                            '<div class="panel-footer">'+
                                '<span class="pull-left" data-lang="panel-view-details">Ver Detalles</span>'+
                                '<span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>'+
                                '<div class="clearfix"></div>'+
                            '</div>'+
                        '</a>'+
                    '</div>'+
                '</div>';
    }

    $('#segunInfo').css('display', 'block');
    $('#panelsHeading').append(blocks);
    $('#tabHistory, #graphicAgainPanel').show();
}

/*========================================
Direcciona a la página
"http://stats.escire.net/estadisticas/archivo/<nombre del archivo del servidor>"
para generar gráficas
========================================*/
$(document).on('click', '.csv-file-item', function() {
    var fileName = $(this).data('csvname');
    location.href = 'estadisticas/archivo/' + fileName;
});


/*========================================
Elimina un documento
(solamente cambia el status del registro a "deleted" en la bd)
========================================*/
function deleteItem(fileId, fileName) {
    var data = {'_token': CSRF_TOKEN, 'switchCase':'delete', 'fileId': fileId};

    var _confirm = confirm("¿Está seguro que desea eliminar '"+fileName+"'?");
    if(_confirm) {
        $.post('files', data, function(response) {
            var status = response.status;
            var message = response.message;

            if(status == "success") {
                $("#itemFile"+fileId).slideUp("slow");
                totalFiles = totalFiles - 1;
                if(totalFiles == 0) {
                    $("#noFiles").css('display', 'block');
                    $("#noFiles, #uploadFilesContent").css('display', 'block');
                    $('#tabHome').click();
                    $('#segunInfo, #panelsHeading, #tabHistory, #graphicAgainPanel, #btnGlobalOpenFile').css('display', 'none');
                    fadeOutLoader();
                }
            }

            if(status == "error") {
                alert(message);
            }
        });
    }
}




function getCsv(getCsvFile, typeReport, fileName) {
    var headers = [];
    var dataSet = [];

    var maxPreviewItems = 5;
    var countItems = 0;

    var typeReport;
    var totalsIcon;
    var totals = 0;


    d3.text(getCsvFile, function(data) {
        var parsedCSV = d3.csv.parseRows(data);
        headers.push(parsedCSV[5]);
        parsedCSV.splice(0,6);

        $.each(parsedCSV, function(index, v){
            var temp = v;
            temp.shift();
            temp.reverse();
            //datos.push(rowCells);
            dataSet.push(temp);
        });//end each(parsedCSV)
        //validateData();
        $.each(dataSet, function (index, v) {
            //var total = v[v.length -1];
            var total = v[0];
            var country = v[2];
            //var totals = parseInt(v[v.length -1]);
            //console.log(total);
            totals = parseInt(totals) + parseInt(total);

            $.each(countriesObj, function(index, v) {
                if(country == ''){
                    if(v.code == 'UNK'){
                        v.downloads = v.downloads + parseInt(total);
                    }
                } else {
                    if(country == v.code) {
                        v.downloads = v.downloads + parseInt(total);
                    }
                }
            });
        });

        // **************************************/
        totalsIcon = '';
        switch (typeReport){
            case 0:
            case 2:
                typeReport = "Descargas";
                totalsIcon = '<i class="fa fa-download fa-5x"></i>';
                break;
            case 1:
            case 3:
            case 4:
                typeReport = "Visitas";
                totalsIcon = '<i class="fa fa-eye fa-5x"></i>';
            case 5:
                typeReport = '';
                totalsIcon = '';
                break;
        }

        $('#panelTotalIcon').html();
        $('#panelTotals').text(abbreviateNumber(totals));
        $('#panelTotalsText').text(typeReport);

        // **************************************/
        var countCountries = 0;
        var _countriesObj = countriesObj.sort(dynamicSort("downloads"));
        $.each(_countriesObj, function(index, v) {
            var downloads = v.downloads;
            if(downloads > 0){
                countCountries++;
            }
        });
        $('#panelCountries').html(' En ' + countCountries);

        // **************************************/
        var mainCountry = _countriesObj[0];

        var nameCountry = mainCountry.name;
        nameCountry = (mainCountry.name.length > 8) ? mainCountry.code : nameCountry;
        var totls = $.number(mainCountry.downloads);

        $('#panelMainCountry').text(nameCountry);

        $('#panelMainCountryText').text('Con '+totls+' '+typeReport);
        // **************************************/
        $("#panelsHeading").css('display', 'block');

        $('#panelTotalsDetails, #panelCountriesDetails, #panelMainCountryDetails').attr('href', 'estadisticas/archivo/'+fileName);

        $('#cloudWords').jQCloud(words);

        fadeOutLoader();
    });//end d3.text()
}

/*=============================================================
============== [ S U B I R    A R C H I V O S ] ===============
=============================================================*/
$('#btnGlobalOpenFile').click(function () {
    $('#tabHome').click();
	starInputFile();
});

/*========================================
solicita seleccione el tipo de reporte
========================================*/
function starInputFile(){
	if(changeFile == 0){
        $('#typeReportModal').modal({
            backdrop: 'static',
            keyboard: true,
            show: true
        });
	} else {
        $("#csvFile").click();
    }

}

/*========================================
valida el tipo de reporte seleccionado
========================================*/
$('#continueSelectFile').click(function () {
    globalTypeReportAllowed = parseInt($("#selectReportType").val());
    globalTypeReport = $("#selectReportType :selected").text();

    if(!isNaN(globalTypeReportAllowed)){
        switch (globalTypeReportAllowed) {
            case 5:
                $('#csvFile').attr("accept", "").attr("accept", "text/xml");
                break;
            default:
                $('#csvFile').attr("accept", "").attr("accept", "text/csv");
                break;
        }
    	$('#csvFile').click();
    } else {
    	alert(translate.continueSelectFile);
	}
});

/*========================================
valida el tipo de archivo seleccionado
========================================*/
$("#csvFile").change(function() {
	$('#typeReportModal').find('button.close').click();
	var _this = $(this),
		file = this.files[0],
		match = ['text/csv', 'text/xml'],
		fileSize,
        fileType,
        messageError;

	var size = (1024 * 1024) * 3;

	if(_this.val() != ''){
		if(file.type == match[0] || file.type == match[1]){
            fileName = file.name;
            csvFile = file;

            switch (file.type) {
                case match[0]:
                    fileType = 'csv';
                    break;
                case match[1]:
                    fileType = 'xml';
                    break;
                default:
            }

			if(file.size > size){
                fileSizeExceeded = 1;
				var _confirm = confirm(translate.fileExceedsLegend);
				if(_confirm) {
                    subirCsv(fileType);
				}
			} else {
                subirCsv(fileType);
			}

		} else {
		  alert(translate.fileNotAllowed);
		  _this.val('');
		}
	}
});


/*========================================
Procesa la subida del archivo a una carpeta temporal
========================================*/
function subirCsv(fileType) {
	var formData = new FormData();

	formData.append('_token', CSRF_TOKEN);
	formData.append('file', csvFile);
	formData.append('switchCase', 'upload');
	formData.append('message', 'hello');
	formData.append('deleteExist', deleteExist);
    formData.append('fileType', fileType);

	$('#history, #noFiles, #panelsHeading, #segunInfo, #graphicAgainPanel').css('display', 'none');

    if(changeFile == 1){
        $("#uploadProgressBar").css("width","0%");
        $('#preView, #loadPreviewText, #confirmFileContent').css('display', 'none');
	}

	$.ajax({
		url: 'files',
		method: 'POST',
		enctype: 'multipart/form-data',
		data: formData,
		cache: false,
		contentType: false,
		processData: false,
		xhr: function() {
			var xhr = new window.XMLHttpRequest();
			xhr.upload.addEventListener('progress',
				uploadProgressHandler,
				false
			);

			xhr.addEventListener('load', loadHandler, false);
			xhr.addEventListener('error', errorHandler, false);
			xhr.addEventListener('abort', abortHandler, false);

			return xhr;
		},
		success: function(response){
			if(response.status == 'success'){
				fileNameConfirmed = fileName;
				storageFileName = response.storageFileName;

				fadeInLoader();

				if($("#loadPreviewText").hasClass('alert-info')){
					$("#loadPreviewText").removeClass('alert-info').addClass('alert-warning').html("Cargando vista previa del archivo");
				}

				if(changeFile == 1) {
					$("#cambiarArchivo").attr('disabled', 'disabled');
					$("#uploadFileConfirmed").attr('disabled', 'disabled');
					preViewTable.destroy();
					$('#preViewTable').empty();
				}

				$("#loadPreviewText").show();

				setTimeout(function() {
                    $("#progressBarContent").css('display', 'none');
                    switch (fileType) {
                        case 'csv':
                            processPreview();
                            break;
                        case 'xml':
                            processPreviewXML();
                            break;
                        default:

                    }

				}, 2000);

			}
			if(response.status == "error") alert(response.message);
		}

	});
}

// function subirCsv(fileType) {
// 	var formData = new FormData();
//
// 	formData.append('_token', CSRF_TOKEN);
// 	formData.append('csvile', csvFile);
// 	formData.append('action', 'uploadPreview');
// 	formData.append('message', 'hello');
// 	formData.append('deleteExist', deleteExist);
//     formData.append('fileType', fileType);
//
// 	$('#history, #noFiles, #panelsHeading, #segunInfo').css('display', 'none');
//
//     if(changeFile == 1){
//         $("#uploadProgressBar").css("width","0%");
//         $('#preView, #loadPreviewText, #confirmFileContent').css('display', 'none');
// 	}
//
// 	$.ajax({
// 		url: 'uploadcsv',
// 		method: 'POST',
// 		enctype: 'multipart/form-data',
// 		data: formData,
// 		cache: false,
// 		contentType: false,
// 		processData: false,
// 		xhr: function() {
// 			var xhr = new window.XMLHttpRequest();
// 			xhr.upload.addEventListener('progress',
// 				uploadProgressHandler,
// 				false
// 			);
//
// 			xhr.addEventListener('load', loadHandler, false);
// 			xhr.addEventListener('error', errorHandler, false);
// 			xhr.addEventListener('abort', abortHandler, false);
//
// 			return xhr;
// 		},
// 		success: function(response){
// 			if(response.status == 'success'){
// 				fileNameConfirmed = fileName;
// 				storageFileName = response.storageFileName;
//
// 				fadeInLoader();
//
// 				if($("#loadPreviewText").hasClass('alert-info')){
// 					$("#loadPreviewText").removeClass('alert-info').addClass('alert-warning').html("Cargando vista previa del archivo");
// 				}
//
// 				if(changeFile == 1) {
// 					$("#cambiarArchivo").attr('disabled', 'disabled');
// 					$("#uploadFileConfirmed").attr('disabled', 'disabled');
// 					preViewTable.destroy();
// 					$('#preViewTable').empty();
// 				}
//
// 				$("#loadPreviewText").show();
//
// 				setTimeout(function() {
//                     $("#progressBarContent").css('display', 'none');
//                     switch (fileType) {
//                         case 'csv':
//                             processPreview();
//                             break;
//                         case 'xml':
//                             processPreviewXML();
//                             break;
//                         default:
//
//                     }
//
// 				}, 2000);
//
// 			}
// 			if(response.status == "error") alert(response.message);
// 		}
//
// 	});
// }

function uploadProgressHandler(event) {
  var percent = (event.loaded / event.total) * 100;
  var progress = Math.round(percent);

  $("#uploadFilesContent").hide();

  $("#progressBarContent").css('display', 'block');
  $("#uploadProgressBar").css("width", progress + "%").html("Progreso: " + progress + "%");
}

function loadHandler(event) {
	//sustituir esta función por el success de ajax jQuery
  /*var response = event.target.response;
	var status = event.target.status;

	if(status == 200) {

	}*/
}

function errorHandler(event) {
	alert("Subida Fallido");
	location.reload();
}

function abortHandler(event) {
	alert("Subida Abortada");
	location.reload();
}

/*========================================
una vez subido el archivo lo recupera del
servidor para leer la información
========================================*/

var globalTotals = 0;
var globalNameCountry = '';
var globalTotalsMainCountry = 0;
var globalCountCountries = 0;
var globalBlockTwo = 0;

function processPreviewXML(){
    var url = "/public/files/tmp/" + storageFileName;
	var dataSet = [];
	var indices = 0;
    var extraIndices = 0;

    var data = {'_token': CSRF_TOKEN, 'fileName': storageFileName};
    var headers = ['País','Géneros','Roles'];
    var rolesArray = [];

    $.post('readxml', data, function(response){
        $.each(response, function(index, v){
            var data = [];
            data[0] = v.username;
            data[1] = v.email;
            data[2] = v.country;
            data[3] = v.gender;

            var roles = '';

            $.each(v.roles, function(index, v){
                var existValue = 0;
                for (i in rolesArray){
                    if(rolesArray[i] == v){
                        existValue = 1;
                    }
                }
                if(existValue == 0){
                    rolesArray.push(v);
                }
                roles += v + ', ';
                globalTotals = globalTotals + 1;
            });

            roles = roles.slice(0,-2);
            data[4] = roles;

            dataSet.push(data);
        });

        var checkboxTitles = "";
        for(var i in headers){
            var title = headers[i];
            checkboxTitles += '<label class="checkbox-inline"><input type="checkbox" name="indices[]" data-index="'+indices+'" data-typegraph="'+title+'" value="'+title+'">'+title+'</label>';
            indices++;
		}
        globalBlockTwo = indices;

        var alertContent = '<p><strong data-lang="show-graph-legend">'+translate.showGraphLegend+'</strong></p>';
        alertContent += checkboxTitles;

        alertContent += '<div style="display:none" id="showRoles"><p><strong>Tipos de usuarios</strong></p>';

        var checkboxRoles = "";
        for(var i in rolesArray){
            var title = rolesArray[i];
            checkboxRoles += '<label class="checkbox-inline"><input type="checkbox" name="extraIndices[]" data-index="'+extraIndices+'" value="'+title+'">'+title+'</label>';
            extraIndices++;
		}
        alertContent += checkboxRoles;
        alertContent += '</div>';

        if(fileSizeExceeded){
            alertContent += '<p style="color: darkred" data-lang="file-exceeds-legend">'+translate.fileExceedsLegend+'</p>';
		}

        alertContent += '<p><button id="uploadFileConfirmed" class="btn btn-primary btn-xs" data-lang="modal-continue-btn" data-filetype="xml">Continuar <i class="fa fa-arrow-right"></i> </button></p>';

        $("#loadPreviewText").removeClass('alert-warning').addClass('alert-info').html(alertContent);

		dataTableLangeURL = (currentLang == 'es')
		? "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
		: '//cdn.datatables.net/plug-ins/1.10.19/i18n/English.json';

        preViewTable = $('#preViewTable').DataTable({
            columns: [
                {'title': 'Nombre de usuario'},
                {'title': 'Correo electrónico'},
                {'title': 'País'},
                {'title': 'Género'},
                {'title': 'Rol(es)'}
            ],
            data : dataSet,
            responsive: true,
            "ordering": false,
            "language": {
                "url": dataTableLangeURL
            },
            "lengthMenu": [[50, 25], [50, 25]]
        });

        $("#confirmFileContent").show();
        $("#strongFileName").text(fileNameConfirmed);

        if(changeFile == 1) {
            $("#cambiarArchivo").removeAttr('disabled');
            $("#uploadFileConfirmed").removeAttr('disabled');
        }

        $("#preView").show();
        fadeOutLoader();
    });
}

function processPreview(){
	var url = "/public/files/tmp/" + storageFileName;
	var dataSet = [];
	var indices = 0;

	d3.text(url, function (error, data) {
        if (error) throw error;
        var parsedCSV = d3.csv.parseRows(data);

        var maxPreviewItems = 100;
        var countItems = 0;
        var unusableData = 1;

        if (parsedCSV[0].length > 1) {
            unusableData = 0;
		}
		//datos para BD
        $.each(parsedCSV, function(index, v){
            //if(countItems < maxPreviewItems) {
        		if(v.length > 1) {
                    if(unusableData){
                        v.shift();
                    }
					if(countItems < maxPreviewItems) {
                    	dataSet.push(v);
					}
					var last = v[v.length -1];
					var totals = 0;
					if(!isNaN(last)){
						totals = parseInt(last);
					}
					var country = v[v.length -3];

                    globalTotals = globalTotals + totals;


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
                }
                countItems++;
			//}

        });

		//datos para BD

		var _countriesObj = countriesObj.sort(dynamicSort("downloads"));
		$.each(_countriesObj, function(index, v) {
			var downloads = v.downloads;
			if(downloads > 0){
				globalCountCountries++;
			}
		});

		//datos para BD
		var mainCountry = _countriesObj[0];
        globalNameCountry = mainCountry.name;
        globalTotalsMainCountry = mainCountry.downloads;
		//end for bd

        var headers = dataSet[0];
        var columns = [];
        var checkboxTitles = "";
        for(var i in headers){
            var title = headers[i];
            if(title != 'Tipo' && title != 'Revista') {
                checkboxTitles += '<label class="checkbox-inline"><input type="checkbox" name="indices[]" data-index="'+indices+'"  data-typegraph="'+title+'" value="'+title+'">'+title+'</label>';
			}
            indices++;
            var column = {"title": title};
            columns.push(column);
		}

        var alertContent = '<p><strong data-lang="show-graph-legend">'+translate.showGraphLegend+'</strong></p>';
        alertContent += checkboxTitles;

        if(fileSizeExceeded){
            alertContent += '<p style="color: darkred" data-lang="file-exceeds-legend">'+translate.fileExceedsLegend+'</p>';
		}

        alertContent += '<p><button id="uploadFileConfirmed" class="btn btn-primary btn-xs" data-lang="modal-continue-btn" data-filetype="csv">Continuar <i class="fa fa-arrow-right"></i> </button></p>';
        $("#loadPreviewText").removeClass('alert-warning').addClass('alert-info').html(alertContent);

        dataSet.shift();
		dataTableLangeURL = (currentLang == 'es')
		? "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
		: '//cdn.datatables.net/plug-ins/1.10.19/i18n/English.json';
        preViewTable = $('#preViewTable').DataTable({
            columns: columns,
            data : dataSet,
            responsive: true,
            "ordering": false,
            "language": {
                "url": dataTableLangeURL
            },
            "lengthMenu": [[50, 25], [50, 25]]
        });


        $("#confirmFileContent").show();
        $("#strongFileName").text(fileNameConfirmed);

        if(changeFile == 1) {
            $("#cambiarArchivo").removeAttr('disabled');
            $("#uploadFileConfirmed").removeAttr('disabled');
        }

        $("#preView").show();
        fadeOutLoader();

    });
}



/*========================================
Mueve el archivo de la carpet temporal
y redirecciona a la vista para general las gráficas
========================================*/
$(document).on('click', '#uploadFileConfirmed', function (event) {
    var foundValue = 0;
	if(indexArray.length > 0){
        for(i in indexArray){
            if(indexArray[i].v == 'Roles'){
                foundValue = 1;
            }
        }

        var passes = 0;
        if(foundValue){
            if(indexArrayRole.length > 0){
                passes = 1
            } else {
                swal(
                    '¡Error!',
                    'Debe seleccionar al menos un tipo de usuario',
                    'error'
                );
            }
        } else {
            passes = 1;
        }

        if(passes){
            var fileType = $(this).data('filetype');

            var data = {
    			'_token': CSRF_TOKEN,
    			'switchCase': 'moveFromTemp',
    			'fileName': fileNameConfirmed,
    			'storageFileName': storageFileName,
    			'typeReport': globalTypeReport,
    			'typeReportIndex': globalTypeReportAllowed,
    			'indexArray': indexArray,
                'indexArrayRole': indexArrayRole,
                'fileType': fileType,
                'simpleTypeReport': '',
                'block_one':'',
                'block_two':'',
                'block_three':'',
    		};

            var simpleTypeReport = '';
            switch (globalTypeReportAllowed){
                case 0:
                case 2:
                    data.simpleTypeReport = 'Descargas';
                    data.block_one = globalTotals;
                    data.block_two = globalCountCountries;
                    data.block_three = globalNameCountry + ','+globalTotalsMainCountry;
                    break;
                case 1:
                case 3:
                case 4:
                    data.simpleTypeReport = 'Visitas';
                    data.block_one = globalTotals;
                    data.block_two = globalCountCountries;
                    data.block_three = globalNameCountry + ','+globalTotalsMainCountry;
                    break;
                case 5:
                    data.simpleTypeReport = 'Usuarios';
                    data.block_one = globalTotals;
                    data.block_two = globalBlockTwo;
                    data.block_three = null;
                    break;
            }

    		$.ajax({
    			type: "POST",
    			url: "files",
    			data: data,
    			dataType: "JSON",
    			success: function(response){
    				if(response.status == 'success'){

                        location.href = 'estadisticas/archivo/' + storageFileName;

    				}
    			}
    		});
        }// end pases



	} else {
		alert(translate.checkboxUnchecked);
	}
});


// $(document).on('click', '#uploadFileConfirmed', function (event) {
// 	if(indexArray.length > 0){
//
//         var fileType = $(this).data('filetype');
//
// 		var data = {
// 			'_token': CSRF_TOKEN,
// 			'action': 'moveFromTemp',
// 			'fileName': fileNameConfirmed,
// 			'storageFileName': storageFileName,
// 			'typeReport': globalTypeReport,
// 			'typeReportIndex': globalTypeReportAllowed,
// 			'indexArray': indexArray,
//             'fileType': fileType
// 		};
//
// 		$.ajax({
// 			type: "POST",
// 			url: "files",
// 			data: data,
// 			dataType: "JSON",
// 			success: function(response){
// 				if(response.status == 'success'){
//
// 					var report = '';
// 					switch (parseInt(globalTypeReportAllowed)){
// 			            case 0:
// 			            case 2:
// 			                report = 'Descargas';
// 			                break;
// 			            case 1:
// 			            case 3:
// 			            case 4:
// 			                report = 'Visitas';
// 			                break;
//                         case 5:
//                             report = 'Usuarios';
//                             break;
// 			        }
//
// 					var data = {
// 						'_token'	: CSRF_TOKEN,
// 						'type'		: report,
// 						'block_one'	: globalTotals,
// 						'block_two' : globalCountCountries,
// 						'block_three': globalNameCountry + ','+globalTotalsMainCountry
// 					};
// 					$.post('lastcsv', data, function(response) {
// 						location.href = 'estadisticas/archivo/' + storageFileName;
// 					});
// 				}
// 			}
// 		});
//
// 	} else {
// 		alert(translate.checkboxUnchecked);
// 	}
// });

/*function lastcsv(){

}*/

$("#cambiarArchivo").click(function(event) {
	changeFile = 1;
	$("#csvFile").val('').click();
});

$(document).on("click", "input[name='indices[]']", function() {
	var index = $(this).data('index');
	var value = $(this).attr('value');
    var typeGraph = $(this).data('typegraph');

	if($(this).is(':checked')){
		var dataArrg = {'i': index, 'v': value};
		indexArray.push(dataArrg);

        if(typeGraph == 'Roles'){
            $('#showRoles').slideDown('slow');
        }
	} else {
		for(var i in indexArray){
	      if(indexArray[i].i == index){
            if(indexArray[i].v == 'Roles'){
                $('#showRoles').slideUp('slow');
                indexArrayRole = [];
            }
            indexArray.splice(i, 1);
	        break;
	      }
	    }
	}

	indexArray.sort();
	//console.log(indexArray);
});

$(document).on('click', 'input[name="extraIndices[]"]', function(){
    var index = $(this).data('index');
	var value = $(this).attr('value');

    if($(this).is(':checked')){
		var dataArrg = {'i': index, 'v': value};
		indexArrayRole.push(dataArrg);
	} else {
		for(var i in indexArrayRole){
	      if(indexArrayRole[i].i == index){
	        indexArrayRole.splice(i, 1);
	        break;
	      }
	    }
	}

    indexArrayRole.sort();
    console.log(indexArrayRole);
});

/*end uploadcsv*/

/*---------------EXTRA FUNCTIONS------------------*/
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function dateFormat(date, lang){
	var months, dateFormat, date = new Date(date);
	switch (lang) {
		case 'es':
			months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septimbre", "Octube", "Nomviembre", "Diciembre"];
			dateFormat = 'Subido el ' + date.getDate() + ' de ' + months[date.getMonth()] + ' de ' + date.getFullYear();
		    dateFormat += ' ' + date.toLocaleString("en-EU", { hour: "numeric", minute: "numeric", hour12: true });
			return dateFormat;
			break;
		case 'en':
			months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			dateFormat = 'Uploaded on ' + months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
			dateFormat += ' ' + date.toLocaleString("en-EU", { hour: "numeric", minute: "numeric", hour12: true });
			return dateFormat;
			break;
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
