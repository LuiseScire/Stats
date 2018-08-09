var fileNameConfirmed;
var changeFile = 0;

//datos globales para validar si existe el documento
var deleteExist = 0,
		csvFile, fileName, storageFileName;

var fileSizeExceeded = 0;

var globalTypeReport, globalTypeReportAllowed;

var preViewTable;

var indexArray = [];

$('#btnGlobalOpenFile').click(function () {
    $('#tabHome').click();
	starInputFile();

});

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

$('#continueSelectFile').click(function () {
    globalTypeReportAllowed = $("#selectReportType").val();
    globalTypeReport = $("#selectReportType :selected").text();

    if(!isNaN(globalTypeReportAllowed)){
        $('#typeReportModal').find('button.close').click();
    	$('#csvFile').click();
    } else {
    	alert('Debe seleccionar una opción para continuar');
	}

});

$("#csvFile").change(function() {
	var _this = $(this),
		file = this.files[0],
		match = ['text/csv'],
		fileSize, messageError;

		var size = (1024 * 1024) * 3;

		if(_this.val() != ''){
			if(file.type == match[0]){
                fileName = file.name;
                csvFile = file;
				if(file.size > size){
                    fileSizeExceeded = 1;
					var _confirm = confirm('Su archivo pesa más de 3MB ¿Desea continuar? Esto podría demorar un poco.');
					if(_confirm) {
                        subirCsv();
					}
				} else {
                    subirCsv();
				}

			} else {
			  alert("El archivo que intenta subir no está permitido. Inténtelo de nuevo.");
			  _this.val('');
			}
		}
});

function subirCsv() {
	var formData = new FormData();

	formData.append('_token', CSRF_TOKEN);
	formData.append('csvFile', csvFile);
	formData.append('action', 'uploadPreview');
	formData.append('message', 'hello');
	formData.append('deleteExist', deleteExist);

	$('#history, #noFiles, #panelsHeading').css('display', 'none');

    if(changeFile == 1){
        $("#uploadProgressBar").css("width","0%");
        $('#preView, #loadPreviewText, #confirmFileContent').css('display', 'none');
	}

	$.ajax({
		url: 'uploadcsv',
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
					processPreview();
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

function processPreview(){
	var url = "/public/csvfiles/tmp/" + storageFileName;
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

        $.each(parsedCSV, function(index, v){
            if(countItems < maxPreviewItems) {
        		if(v.length > 1) {
                    if(unusableData){
                        v.shift();
                    }
                    dataSet.push(v);
                }
                countItems++;
			}
        });

        var headers = dataSet[0];
        var columns = [];
        var checkboxTitles = "";
        for(var i in headers){
            var title = headers[i];
            if(title != 'Tipo' && title != 'Revista') {
                checkboxTitles += '<label class="checkbox-inline"><input type="checkbox" name="indices[]" data-index="'+indices+'" value="'+title+'">'+title+'</label>';
			}
            indices++;
            var column = {"title": title};
            columns.push(column);

		}

        var alertContent = '<p><strong>Generar gráficas por:</strong></p>';
        alertContent += checkboxTitles;

        if(fileSizeExceeded){
            alertContent += '<p style="color: darkred">Su archivo excede los 3MB el proceso de las gráficas podría demorar un poco</p>';
		}

        alertContent += '<p><button id="uploadFileConfirmed" class="btn btn-primary btn-xs">Continuar <i class="fa fa-arrow-right"></i> </button></p>';
        $("#loadPreviewText").removeClass('alert-warning').addClass('alert-info').html(alertContent);

        dataSet.shift();
        preViewTable = $('#preViewTable').DataTable({
            columns: columns,
            data : dataSet,
            responsive: true,
            "ordering": false,
            "language": {
                "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
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

	/*d3.text(url, function(data) {
		var parsedCSV = d3.csv.parseRows(data);

		headers.push(parsedCSV[5]);
        parsedCSV.splice(0,6);

		$.each(parsedCSV, function(index, v){
			//white-space: nowrap
			if(countItems < maxPreviewItems) {
				var temp = v;
				temp.shift();
				dataSet.push(temp);
			}
			countItems++;
		});

		var checkboxTitles = "";
		$.each(headers, function(index, arrgs) {
			$.each(arrgs, function(index, v) {
				if(v.trim().length > 0){
					if(v != 'Tipo' && v != 'Revista') {
						checkboxTitles += '<label class="checkbox-inline"><input type="checkbox" name="indices[]" data-index="'+indices+'" value="'+v+'">'+v+'</label>';
						var title = v;
						var column = {"title": title};
						columns.push(column);
						indices++
					}
				}
			});
		});

		$("#preView").show();
		preViewTable = $('#preViewTable').DataTable({
			columns: columns,
			data : dataSet,
			responsive: true,
			"ordering": false,
			"language": {
					"url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
			}
		});

		fadeOutLoader();

		$("#progressBarContent").css('display', 'none');

		var alertContent = '<p><strong>Generar gráficas por:</strong></p>';
			alertContent += checkboxTitles;
			alertContent += '<p><select id="selectReportType">';
			alertContent += '<option>-- Tipo de informe --</option>';
			alertContent += '<option value="0">Descargas del archivo del artículo</option>';
			alertContent += '<option value="1">Visitas a la página del resumen del artículo</option>';
			alertContent += '<option value="2">Descargas de Archivo del número</option>';
			alertContent += '<option value="3">Visitas a la página de la tabla de contenidos del número</option>';
			alertContent += '<option value="4">Visitas a la página principal de la revista</option>';
			alertContent +=	'</select></p>';
			alertContent += '<p><button id="uploadFileConfirmed" class="btn btn-primary btn-xs">Continuar <i class="fa fa-arrow-right"></i> </button></p>';
			alertContent += '<hr>';
			alertContent += '<p><strong>Vista Previa</strong></p>';

		$("#loadPreviewText").removeClass('alert-warning').addClass('alert-info').html(alertContent);
		$("#confirmFileContent").show();
		$("#strongFileName").text(fileNameConfirmed);

		if(changeFile == 1) {
			$("#cambiarArchivo").removeAttr('disabled');
			$("#uploadFileConfirmed").removeAttr('disabled');
		}
	});*/
}

$(document).on('click', '#uploadFileConfirmed', function (event) {

	if(indexArray.length > 0){
		var data = {
			'_token': CSRF_TOKEN,
			'action': 'moveFromTemp',
			'fileName': fileNameConfirmed,
			'storageFileName': storageFileName,
			'typeReport': globalTypeReport,
			'typeReportIndex': globalTypeReportAllowed,
			'indexArray': indexArray
		};

		$.ajax({
			type: "POST",
			url: "uploadcsv",
			data: data,
			dataType: "JSON",
			success: function(response){
				if(response.status == 'success'){
					//location.href = 'home';
					location.href = 'estadisticas/archivo/' + storageFileName;
				}
			}
		});

	} else {
		alert("Debe seleccionar al menos una casilla de selección para generar gráficas");
	}

});

$("#cambiarArchivo").click(function(event) {
	changeFile = 1;
	$("#csvFile").val('').click();
});

$(document).on("click", "input[name='indices[]']", function() {
	var index = $(this).data("index");
	var value = $(this).attr("value");

	if($(this).is(":checked")){
		var dataArrg = {"i": index, "v": value};
		indexArray.push(dataArrg);
	} else {
		for(var i in indexArray){
      if(indexArray[i].i == index){
        indexArray.splice(i, 1);
        break;
      }
    }
	}

	indexArray.sort();
	//console.log(indexArray);
});



function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}
