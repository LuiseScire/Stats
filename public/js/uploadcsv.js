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
		}, success: function(response){
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
				$("#seconds").css('display', 'none');
				$("#status").html('Archivo cargado completamente');
				fileNameConfirmed = fileName;
				//console.log(response);
				/*$.ajax({
					 url: '/workspace/stats/public/csvfiles/tmp/' + fileName,
						//url: response.path,
						dataType: 'text',
				}).done(successFunction);*/

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
				//$("#addVideo").css('display', 'none');
				/*$("#uploadVideo").css('display', 'block')
					.data('url', response.url)
					.data('idmultimedia', response.idMultimedia)
					.data('filename', response.fileName);*/
			}
			if(response.status == "error") alert(response.message);
		}
	});
}

function uploadProgressHandler(event) {
  var percent = (event.loaded / event.total) * 100;
  var progress = Math.round(percent);

  //$('#addVideo').hide();
	$("#inputFileContent").css("display", "none");
  $("#seconds").css('display', 'block');
  $("#uploadProgressBar").css("width", progress + "%");
  $("#status").html(progress +"% cargando... por favor espere");
}

function loadHandler(event) {
  var response = event.target.responseText;


  /*if(response.status == 'success'){
    $("#addVideo").css('display', 'none');
    $("#uploadVideo").css('display', 'block').data('url', response.url).data('idmultimedia', response.idMultimedia);
    //$("#uploadProgressBar").css("width", "0%");
  }else{
    $("#uploadProgressBar").css("width", "0%");
  }*/
}

function errorHandler(event) {
  $("#status").html("Subida Fallida");
  //$('#addVideo').show();
}

function abortHandler(event) {
  $("#status").html("Subida Abortada");
  //$('#addVideo').show();
}

function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}


/*$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "data.txt",
        dataType: "text",
        success: function(data) {processData(data);}
     });
});*/

/*function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(headers[j]+":"+data[j]);
            }
            lines.push(tarr);
        }
    }
		//console.log(lines);

}*/

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

	$("#loadPreviewText").removeClass('alert-warning').addClass('alert-info').html("Vista Previa");
	$("#confirmFileContent").show();

	if(changeFile == 1) {
		$("#cambiarArchivo").removeAttr('disabled');
		$("#uploadFileConfirmed").removeAttr('disabled');
	}
}

$("#uploadFileConfirmed").click(function(event){
	console.log(event);
	var data = {'_token': CSRF_TOKEN, 'action': 'moveFromTemp', 'fileName': fileNameConfirmed}
	$.ajax({
		type: "POST",
		url: "uploadcsv",
		data: data,
		dataType: "JSON",
		success: function(response){
			if(response.status == 'success'){
				alert('Documento subido correctamente');
				location.href = 'home';
			}
		}
	});
});

$("#cambiarArchivo").click(function(event) {
	console.log(event);
	changeFile = 1;
	$("#csvFile").val('').click();
});
