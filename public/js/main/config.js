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
		csvFile,
        fileName,
        storageFileName;

var fileSizeExceeded = 0;

var globalTypeReport,
    globalTypeReportAllowed;

var preViewTable;

// guarda los indices del tipo de gráfica que se mostrará
var indexArray = [];
// guarda los indices extra del tipo de gráfica que se mostrará
//por ejemplo 'usuarios' del tipo de gráfica 'Roles'
var indexArrayRole = [];

/*end uploadcsv*/

var totalFiles = 0;

var words = [];
var folderArray = [];

var globalCurrentFolder = 0;
$(document).ready(function(){
    var data = {'_token': CSRF_TOKEN, 'switchCase': 'getLastFile'};
    start_(data);
});

function start_(data){
    $.post('../files', data, function(response){
        var file_folder_id,
            file_back_name,
            file_front_name,
            fileIndices,
            fileIndicesRoles,
            type_report,
            typeReportIndex;

        if(response[0] == null){
            $('#noFilesAlert').show();

            // var data = {'_token': CSRF_TOKEN, 'switchCase': 'getFolders'};
            // $.post('../files', data, function(response){
            //     if(response.length > 0){
            //
            //         $.each(response, function(index, v){
            //             $.each(v, function(ind, val){
            //                 var folderName = val.folder_name;
            //                 var folderId = val.folder_id;
            //
            //                 var folders = '<div class="col-xs-6 col-sm-6 col-md-3 folder-item">'+
            //                                 '<div class="thumbnail" id="folder'+folderId+'" title="'+folderName+'" data-folderid="'+folderId+'" data-foldername="'+folderName+'">'+
            //                                     '<img src="../public/images/folder.png" width="150">'+
            //                                     '<span class="st-menu"></span>'+
            //                                     '<div class="caption text-center">'+
            //                                         '<p>'+folderName+'</p>'+
            //                                         // '<h3 class="text-center">'+folderName+'</h3>'+
            //                                     '</div>'+
            //                                 '</div>'+
            //                             '</div>';
            //
            //                 $('#foldersList').append(folders);
            //
            //                 var li = '<li class="folder-list" id="liFolder'+folderId+'" data-folderid="'+folderId+'">'+
            //                            '<a href="#"><i class="fa fa-bar-chart fa-fw" style="color: darkred"></i> Gráficas de '+folderName+'<span class="fa arrow"></span></a>'+
            //                            '<ul class="nav nav-second-level" id="folder'+folderId+'" data-folderid="'+folderId+'">'+
            //
            //                            '</ul>'+
            //                        '</li>';
            //
            //                 $('#side-menu').append(li);
            //             });
            //         });
            //     } else {
            //         $('#uploadFilesContentParent').show();
            //     }
            //
            //     fadeOutLoader();
            // });

        } else {
            $.each(response, function(index, v){
                file_folder_id = v.file_folder_id;
                liFolderId = file_folder_id;
                //file_back_name = v.file_back_name;
                //file_front_name = v.file_front_name;
                //globalFileId = v.file_id;
                //fileIndices = v.file_indices;
                //fileIndicesRoles = v.file_role_indices;
                //indexArray = JSON.parse("[" + fileIndices + "]");
                //indexArrayRoles = JSON.parse("[" + fileIndicesRoles + "]");
                //globalFileType = v.file_type;
                //typeReportIndex = v.file_report_index;
                //type_report = v.file_report_name;
            });

        }

        $('#foldersList').empty();
        $('.folder-list').remove();
        var data = {'_token': CSRF_TOKEN, 'switchCase': 'getFolders'};
        $.post('../files', data, function(response){
            folderArray = [];
            $.each(response, function(index, v){
                $.each(v, function(ind, val){
                    var folderName = val.folder_name;
                    var folderId = val.folder_id;

                    folderArray.push(folderName);



                    var folders = '<div class="col-xs-6 col-sm-6 col-md-3 folder-item">'+
                                    '<div class="thumbnail" id="folder'+folderId+'" title="'+folderName+'" data-folderid="'+folderId+'" data-foldername="'+folderName+'">'+
                                        '<img src="../public/images/folder.png" width="150">'+
                                        '<div class="dropdown">'+
                                          '<span class="st-menu ropdown-toggle" title="Opciones" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"></span>'+
                                          '<ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">'+
                                            '<li><a href="javascript:void(0)" onClick="renameFolder(this, '+folderId+')" data-foldername="'+folderName+'"><i class="fa fa-retweet"></i> Renombrar</a></li>'+
                                            '<li role="separator" class="divider"></li>'+
                                            '<li><a href="javascript:void(0)" onClick="deleteFolder('+folderId+')"><i class="fa fa-trash"></i> Eleminar</a></li>'+
                                          '</ul>'+
                                        '</div>'+
                                        '<div class="caption text-center">'+
                                            '<p>'+folderName+'</p>'+
                                            // '<h3 class="text-center">'+folderName+'</h3>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>';

                    $('#foldersList').append(folders);

                    var li = '<li class="folder-list" id="liFolder'+folderId+'" data-folderid="'+folderId+'">'+
                               '<a href="#"><i class="fa fa-bar-chart fa-fw" style="color: darkred"></i> Gráficas de '+folderName+'<span class="fa arrow"></span></a>'+
                               '<ul class="nav nav-second-level" id="folder'+folderId+'" data-folderid="'+folderId+'">'+

                               '</ul>'+
                           '</li>';

                    $('#side-menu').append(li);
                });
            });

            //$('.folder-list').find('ul#folder'+file_folder_id).addClass('in').parent('.folder-list').addClass('active');

        });
        fadeOutLoader();

    });
}

$(document).on('click', '.folder-list', function(event){
    event.preventDefault();
    var thisFolderId = $(this).data('folderid');
    var data = {'_token': CSRF_TOKEN, 'switchCase': 'getLastFileRequest', 'folderId': thisFolderId};

    $.post('../files', data, function(response){
        if(response[0] != null){
            var file_back_name = response[0].file_back_name;
            location.href = '../stats/' + file_back_name;
        } else {

            $('.thumbnail#folder'+thisFolderId+'>img').click();
        }
    });
});

$(document).on('click', '.thumbnail>img, .thumbnail>.caption', function(){
//$(document).on('click', '.thumbnail', function(){
    fadeInLoader();
    folderId =  $(this).parent('.thumbnail').data('folderid');
    fodlerName = $(this).parent('.thumbnail').data('foldername');

    globalCurrentFolder = folderId;

    $('#foldersList, #newFolderBtn').hide();

    var data = {'_token': CSRF_TOKEN};
    $.ajax({
        type: "POST",
        url: "/listcsvfiles",
        data: data,
        dataType: "JSON",
        success: function(response){
            var count = 0;
            $.each(response.filesList, function(index, v) {
                var fileFolder = v.file_folder_id;

                if(fileFolder == folderId){
                    var csvId = v.file_id;
                    var csvName = v.file_front_name;
                    var csvDBName = v.file_back_name;
                    var csvPath = v.file_path;
                    var csvStatus = v.file_status;
                    var csvVersion = v.file_version;
                    var csvTimestamp = v.file_timestamp;
                    var csvTypeReport = v.file_report_name;
                    var fileType = v.file_type;

                    var fileUserName = v.name + ' ' + v.last_name;

                    var fileName;

                    if(csvVersion == null) {
                        fileName = csvName;
                    } else {
                        fileName = csvName + "(" + csvVersion + ")";
                    }

                   var iconFileSrc = (fileType == 'csv') ? '../public/images/csv-file-primary-color.svg' :
                                                          '../public/images/xml-file-primary-color.png';


                    var item = '<div id="itemFile'+csvId+'" class="media media-card">\n' +
                        '        <div class="media-left">\n' +
                        '          <a href="javascript:void(0)" class="csv-file-item" data-fileid="'+csvId+'" data-csvname="'+csvDBName+'">\n' +

                        '            <img class="media-object" src="'+iconFileSrc+'" alt="icon" width="64px" height="64px">\n' +
                        '          </a>\n' +
                        '        </div>\n' +
                        '        <div class="media-body" style="color: #E05740">\n' +
                        '          <h4 class="media-heading csv-file-item" data-fileid="'+csvId+'" data-csvname="'+csvDBName+'" style="color: #A41C1E; cursor: pointer">'+fileName+'</h4>\n' +
                        '          <span class="fa fa-trash fa-lg pull-right" style="cursor: pointer" onClick="deleteItem('+csvId+', '+"'"+fileName+"'"+')"></span>'+
                                      csvTypeReport +
          			  '				<br>'+
                        '             <small class="date-format-es" style="color: #72777a; '+displayDateES+'">'+dateFormat(csvTimestamp, 'es', fileUserName) +'</small>' +
          			  '             <small class="date-format-en" style="color: #72777a; '+displayDateEN+'">'+dateFormat(csvTimestamp, 'en', fileUserName) +'</small>' +
                        '        </div>\n' +
                        '      </div>';

                    $("#csvList").append(item);
                    count++;
                }

            });
            $("#csvList, #newFileBtn").show();

            var address = '<li class="address-item dinamic-address"><label><span>  '+fodlerName+'</span></label></li>';

            $('.first-address-item > i').removeClass('fa-folder').addClass('fa-folder-open');

            $('.breadcrumb').append(address);

            if(count == 0){
                $('.empty-folder').show();
            }
            fadeOutLoader();
        }
    });
});

$('.first-address-item').click(function(){
    globalCurrentFolder = 0;
    $('.dinamic-address').remove();
    $('#foldersList, #uploadFilesContent, #newFolderBtn').show();
    $('#newFileBtn, .empty-folder').hide();
    $('#csvList').hide().empty();
    $('.first-address-item > i').removeClass('fa-folder-open').addClass('fa-folder');
});

// function validateExistFiles(){
//   var data = {'_token': CSRF_TOKEN};
//   $.ajax({
//     type: "POST",
//     url: "/listcsvfiles",
//     data: data,
//     dataType: "JSON",
//     success: function(response){
//
//       var count = 0;
//       $.each(response.filesList, function(index, v) {
//           var csvId = v.file_id;
//           var csvName = v.file_front_name;
//           var csvDBName = v.file_back_name;
//           var csvPath = v.file_path;
//           var csvStatus = v.file_status;
//           var csvVersion = v.file_version;
//           var csvTimestamp = v.file_timestamp;
//           var csvTypeReport = v.file_report_name;
//           var fileType = v.file_type;
//
//           var fileUserName = v.name + ' ' + v.last_name;
//
//           var fileName;
//
//           if(csvVersion == null) {
//               fileName = csvName;
//           } else {
//               fileName = csvName + "(" + csvVersion + ")";
//           }
//
//          var iconFileSrc = (fileType == 'csv') ? '../public/images/csv-file-primary-color.svg' :
//                                                 '../public/images/xml-file-primary-color.png';
//
//
//           var item = '<div id="itemFile'+csvId+'" class="media">\n' +
//               '        <div class="media-left">\n' +
//               '          <a href="javascript:void(0)" class="csv-file-item" data-csvname="'+csvDBName+'">\n' +
//
//               '            <img class="media-object" src="'+iconFileSrc+'" alt="icon" width="64px" height="64px">\n' +
//               '          </a>\n' +
//               '        </div>\n' +
//               '        <div class="media-body" style="color: #E05740">\n' +
//               '          <h4 class="media-heading csv-file-item" data-csvname="'+csvDBName+'" style="color: #A41C1E; cursor: pointer">'+fileName+'</h4>\n' +
//               '          <span class="fa fa-trash fa-lg pull-right" style="cursor: pointer" onClick="deleteItem('+csvId+', '+"'"+fileName+"'"+')"></span>'+
//                             csvTypeReport +
// 			  '				<br>'+
//               '             <small class="date-format-es" style="color: #72777a; '+displayDateES+'">'+dateFormat(csvTimestamp, 'es', fileUserName) +'</small>' +
// 			  '             <small class="date-format-en" style="color: #72777a; '+displayDateEN+'">'+dateFormat(csvTimestamp, 'en', fileUserName) +'</small>' +
//               '        </div>\n' +
//               '      </div>';
//
//           //$("#csvList").append(item);
//           count++;
//       });
//
//       if(count > 0){
//           totalFiles = count;
//           var lastElement = response.filesList[0];
//           var typeReport = lastElement.file_report_index;
//           var getCsvFile = '/public'+lastElement.file_path;
//           var fileName = lastElement.file_back_name;
//           var _fileName = lastElement.file_front_name;
//           var csvTypeReport = lastElement.file_report_name;
//           var fileType = lastElement.file_type;
//
//           $('.fileNamePanels').text(_fileName);
//           $('.typeReportPanels').text(csvTypeReport);
//
//           $('.seeAgain').data('csvname', fileName);
//           var iconFileSrc = (fileType == 'csv') ? 'images/csv-file-primary-color.svg' :
//                                                  'images/xml-file-primary-color.png';
//
//           $('.seeAgain').find('img').attr('src', public_path + iconFileSrc);
//
//           //getCsv(getCsvFile, typeReport, fileName);
// 		  var typeReport = 0,
// 		  	  totals = 0,
// 			  countCountries = 0,
// 			  mainCountry = '';
//
// 		  var v = response.lastFileData;
//
//           //createHeaderBlocks(v, fileName);
//
//           $('#tabHistory, #graphicAgainPanel').show();
//           fadeOutLoader();
//       } else {
//           $("#noFiles, #uploadFilesContent").css('display', 'block');
//           $('#btnGlobalOpenFile').hide();
//           fadeOutLoader();
//       }
//     }
//   });
// }

/*========================================
Direcciona a la página
"http://stats.escire.net/estadisticas/archivo/<nombre del archivo del servidor>"
para generar gráficas
========================================*/
$(document).on('click', '.csv-file-item', function() {
    var fileName = $(this).data('csvname');
    location.href = '../stats/' + fileName;
    // var fileid = $(this).data('fileid');
    // location.href = '../stats/' + fileid;
});

/*========================================
Elimina un documento
(solamente cambia el status del registro a "deleted" en la bd)
========================================*/
function deleteItem(fileId, fileName) {
    var data = {'_token': CSRF_TOKEN, 'switchCase':'delete', 'fileId': fileId};

    var _confirm = confirm("¿Está seguro que desea eliminar '"+fileName+"'?");
    if(_confirm) {
        $.post('../files', data, function(response) {
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

function renameFolder(event, folderId){

    var currentName = $(event).data('foldername');
    var folderName = prompt('Nuevo nombre', currentName);

    if(folderName === null){
        return;
    } else {
        if(folderName == null || folderName == '') {
            if(confirm('Debe ingresar un nombre')){
                renameFolder(event, folderId);
            }
        } else {
            var data = {'_token': CSRF_TOKEN, 'switchCase': 'renameFolder', 'folderId':folderId, 'folderName': folderName};
            $.post('../files', data, function(response){
                if(response.status == 'success') {
                    swal(
                        '¡Hecho!',
                        'Carpeta renombrada satisfactoriamente',
                        'success'
                    );

                    var data = {'_token': CSRF_TOKEN, 'switchCase': 'getLastFile'};
                    start_(data);
                }

                if(response.status == 'error'){
                    swal(
                      '¡Error!',
                      'Error eliminar carpeta',
                      'error'
                    )
                }

            });
        }
    }


}


function deleteFolder(folderId){
    swal({
      title: '¿Seguro que desea eliminar esta carpeta?',
      text: 'Todo su contenido será eliminado también',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.value) {
          var data = {'_token': CSRF_TOKEN, 'switchCase':'deleteFolder', 'folderId': folderId};
          $.post('../files', data, function(response){
              if(response.status == 'success'){
                  swal(
                    '¡Eliminado!',
                    'Su archivo ha sido eliminado satisfactoriamente',
                    'success'
                  )

                  var data = {'_token': CSRF_TOKEN, 'switchCase': 'getLastFile'};
                  start_(data);
              }

              if(response.status == 'error'){
                  swal(
                    '¡Error!',
                    'Error eliminar carpeta',
                    'error'
                  )
              }
          });
      }
    })
}



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

	$('#history, #filesContent, #noFiles, #noFilesAlert, #panelsHeading, #segunInfo, #graphicAgainPanel').css('display', 'none');

    if(changeFile == 1){
        $("#uploadProgressBar").css("width","0%");
        $('#preView, #loadPreviewText, #confirmFileContent').css('display', 'none');
	}

	$.ajax({
		url: '../files',
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
    var headers = ['País','Géneros','Roles', 'Afiliación'];
    var rolesArray = [];

    $.post('../readxml', data, function(response){
        $.each(response, function(index, v){
            var data = [];
            data[0] = v.username;
            data[1] = v.email;
            data[2] = v.country;
            data[3] = v.gender;
            data[5] = v.affiliation;

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
                {'title': 'Tipo de usuarios'},
                {'title': 'Afiliación'}
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

            var folder_default = $('#selectReportType').find(':selected').data('default-folder');

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
                'folderId': globalCurrentFolder,
                'folderDefault' : folder_default,
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
    			url: "../files",
    			data: data,
    			dataType: "JSON",
    			success: function(response){
    				if(response.status == 'success'){
                        //location.href = '../estadisticas/archivo/' + storageFileName;
                        location.href = '../stats'
    				}
    			}
    		});
        }// end pases



	} else {
		alert(translate.checkboxUnchecked);
	}
});


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

});

/*end uploadcsv*/
function newFolder(element){
    var origin = $(element).data('origin');

    var folderName = prompt('Nombre de la carpeta', '');

    if (folderName === null) {
        return;
    } else {
        if (folderName == null || folderName == '') {
            var _confirm = confirm('Debe ingresar un nombre');
            if(_confirm){
                newFolder();
            }
        } else {
            var data = {'_token': CSRF_TOKEN, 'switchCase': 'newFolder', 'folderName': folderName};
            $.post('../files', data, function(response){
                if(response.status == 'success'){
                    var data = {'_token': CSRF_TOKEN, 'switchCase': 'getLastFile'};
                    start_(data);

                    if(origin == 'modal'){
                        let stateCreation = setInterval(() => {
                            $('.thumbnail').each(function(index, v){
                                var fn = $(this).data('foldername');
                                if(fn == folderName.trim()){
                                    clearInterval(stateCreation);
                                    $(this).find('img').click();
                                    $('#folderListModal').modal('hide');
                                    starInputFile();
                                }
                            });

                        }, 100);
                    }
                } else {
                    swal(
                        'Error',
                        'Algo salió mal, inténtelo más tarde',
                        'error'
                    );
                }
            });
        }
    }
}


function mainNewFile(){
    $('#modalFolderList').empty();
    if(folderArray.length > 0) {
        var itemList;
        for(var i in folderArray) {
            itemList = '<button type="button" class="list-group-item"><i class="fa fa-folder"></i> '+folderArray[i]+'</button>';
            $('#modalFolderList').append(itemList);
        }

        $('#folderListModal').modal({
            backdrop: 'static',
            keyboard: true,
            show: true
        });
    } else {
        starInputFile();
    }
}


function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function dateFormat(date, lang, fileUserName){
	var months, dateFormat, date = new Date(date);
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
