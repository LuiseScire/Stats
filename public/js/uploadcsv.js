//var CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content');
var fileNameConfirmed;
var changeFile = 0;

//datos globales para validar si existe el documento
var deleteExist = 0,
		csvFile, fileName;

$("#csvFile").change(function() {
	var _this = $(this),
		file = this.files[0],
		match = ['text/csv'],
		fileSize, messageError;

		if(_this.val() != ''){
			if(file.type == match[0]){
				fileName = file.name;
				csvFile = file;
				subirCsv();
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

				setTimeout(function() {
					$.ajax({
							type: "GET",
							url: "/workspace/stats/public/csvfiles/tmp/" + fileName,
							dataType: "text",
							beforeSend: function(){
								if($("#loadPreviewText").hasClass('alert-info')){
									$("#loadPreviewText").removeClass('alert-info').addClass('alert-warning').html("Cargando vista previa del archivo");
									$('#preView').empty();
								}
								if(changeFile == 1) {
									$("#cambiarArchivo").attr('disabled', 'disabled');
									$("#uploadFileConfirmed").attr('disabled', 'disabled');
								}
								$("#loadPreviewText").show();

								//mostrar el loader
								fadeInLoader();
							},
							success: function(data) {
								successFunction(data);
							}
					 });
				}, 1000);
			}
			if(response.status == "error") alert(response.message);
		}
		/*success: function(response){
			if(response.status == "fileExist"){
				var _confirm = confirm(response.message);
				if(_confirm){
					deleteExist = 1;
					subirCsv();
				} else {
					if(changeFile == 0) {
						$("#inputFileContent").css("display", "block");
						$("#csvFile").val('');
						$("#status").html('');
					}
				}
			}

			if(response.status == 'success'){
				fileNameConfirmed = fileName;
				$.ajax({
						type: "GET",
						url: "/workspace/stats/public/csvfiles/tmp/" + fileName,
						dataType: "text",
						beforeSend: function(){
							if($("#loadPreviewText").hasClass('alert-info')){
								$("#loadPreviewText").removeClass('alert-info').addClass('alert-warning').html("Cargando vista previa del archivo");
								$('#preView').empty();
							}
							if(changeFile == 1) {
								$("#cambiarArchivo").attr('disabled', 'disabled');
								$("#uploadFileConfirmed").attr('disabled', 'disabled');
							}
							$("#loadPreviewText").show();
						},
						success: function(data) {
							successFunction(data);
						}
				 });
			}
			if(response.status == "error") alert(response.message);
		}*/
	});
}

function uploadProgressHandler(event) {
  var percent = (event.loaded / event.total) * 100;
  var progress = Math.round(percent);

	$("#inputFileContent").hide();

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
  //$("#status").html("Subida Fallida");
}

function abortHandler(event) {
	alert("Subida Abortada");
	location.reload();
  //$("#status").html("Subida Abortada");
}

function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function successFunction(data) {
  var allRows = data.split(/\r?\n|\r/);
  var table = '<table class="table">';
  for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
		if(singleRow < 5 ) {
			//se evitan las primeras 5 filas del documento.
		} else {
			if (singleRow === 5) {
	      table += '<thead>';
	      table += '<tr>';
	    } else {
	      table += '<tr>';
	    }
	    var rowCells = allRows[singleRow].split(',');
	    for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
	      if (singleRow === 0) {
	        table += '<th>';
	        table += rowCells[rowCell];
	        table += '</th>';
	      } else {
	        table += '<td>';
	        table += rowCells[rowCell];
	        table += '</td>';
	      }
	    }
	    if (singleRow === 0) {
	      table += '</tr>';
	      table += '</thead>';
	      table += '<tbody>';
	    } else {
	      table += '</tr>';
	    }
		}
  }

  table += '</tbody>';
  table += '</table>';
  $('#preView').append(table);

	//ocultamos el loader
	fadeOutLoader();

	$("#progressBarContent").css('display', 'none');
	$("#loadPreviewText").removeClass('alert-warning').addClass('alert-info').html("Vista Previa");
	$("#confirmFileContent").show();
	$("#strongFileName").text(fileNameConfirmed);

	if(changeFile == 1) {
		$("#cambiarArchivo").removeAttr('disabled');
		$("#uploadFileConfirmed").removeAttr('disabled');
	}
}

$("#uploadFileConfirmed").click(function(event){
	//console.log(event);
	var data = {'_token': CSRF_TOKEN, 'action': 'moveFromTemp', 'fileName': fileNameConfirmed}
	$.ajax({
		type: "POST",
		url: "uploadcsv",
		data: data,
		dataType: "JSON",
		success: function(response){
			if(response.status == 'success'){
				//alert('Documento subido correctamente');
				location.href = 'home';
			}
		}
	});
});

$("#cambiarArchivo").click(function(event) {
	//console.log(event);
	changeFile = 1;
	$("#csvFile").val('').click();
});
