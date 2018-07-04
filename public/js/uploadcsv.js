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

				fadeInLoader();
				if($("#loadPreviewText").hasClass('alert-info')){
					$("#loadPreviewText").removeClass('alert-info').addClass('alert-warning').html("Cargando vista previa del archivo");
					$('#preView').empty();
				}
				if(changeFile == 1) {
					$("#cambiarArchivo").attr('disabled', 'disabled');
					$("#uploadFileConfirmed").attr('disabled', 'disabled');
				}
				$("#loadPreviewText").show();
				setTimeout(function() {
					processPreview();

					/*$.ajax({
							type: "GET",
							url: "/workspace/stats/public/csvfiles/tmp/" + fileName,
							dataType: "text",
							beforeSend: function(){
								//mostrar el loader
								fadeInLoader();

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
								setTimeout(function(){successFunction(data);}, 2000);
							}
					 });*/
				}, 2000);
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

function processPreview(){
	var url = "/workspace/stats/public/csvfiles/tmp/" + fileName;
	var cabeceras = [];

	d3.text(url, function(data) {
			var parsedCSV = d3.csv.parseRows(data);
			cabeceras.push(parsedCSV[5]);
			parsedCSV.splice(0,5);
			var container = d3.select(".js-pscroll")
					.append("table")

					.selectAll("tr")
							.data(parsedCSV).enter()
							.append("tr")

					.selectAll("td")
							.data(function(d) { return d; }).enter()
							.append("td")
							.text(function(d) { return d; });



			//$("#preView > table > tr:first").addClass("thead");


			$.each(cabeceras, function(index, arrgs) {
				$.each(arrgs, function(index, v) {

					var th = '<th class="cell100">'+v+'</th>';
					$("tr.head").append(th);
				});
			});

			$("#preView").show();

			fadeOutLoader();

			$("#progressBarContent").css('display', 'none');
			$("#loadPreviewText").removeClass('alert-warning').addClass('alert-info').html("Vista Previa");
			$("#confirmFileContent").show();
			$("#strongFileName").text(fileNameConfirmed);

			if(changeFile == 1) {
				$("#cambiarArchivo").removeAttr('disabled');
				$("#uploadFileConfirmed").removeAttr('disabled');
			}
	});

}


function successFunction(data) {
	var url = "/workspace/stats/public/csvfiles/tmp/" + fileName;

	d3.text(url, function(data) {
		//console.log(data);
      var parsedCSV = d3.csv.parseRows(data);
			parsedCSV.splice(0,5);
			//console.log(parsedCSV);
      var container = d3.select("#preView")
          .append("table").addClass("table table-striped")

          .selectAll("tr")
              .data(parsedCSV).enter()
              .append("tr")

          .selectAll("td")
              .data(function(d) { return d; }).enter()
              .append("td")
              .text(function(d) { return d; });
  });




  var allRows = data.split(/\r?\n|\r/);
	var dataSet = [];
  //var table = '<table class="table table-striped">';
  for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
		if(singleRow < 5 ) {
			//se evitan las primeras 5 filas del documento.
		} else {
			parsedCSV = d3.csv.parseRows(allRows[singleRow]);
			//dataSet.push(parsedCSV);
			//console.log(allRows[singleRow]);
			//console.log(parsedCSV);
			/*var container = d3.select("#preView")
          .append("table")

          .selectAll("tr")
              .data(parsedCSV).enter()
              .append("tr")

          .selectAll("td")
              .data(function(d) { return d; }).enter()
              .append("td")
              .text(function(d) { return d; });*/

			/*if (singleRow === 5) {
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

	    if (singleRow === 5) {
	      table += '</tr>';
	      table += '</thead>';
	      table += '<tbody>';
	    } else {
	      table += '</tr>';
	    }*/

		}
  }

	/*var container = d3.select("#preView")
			.append("table")

			.selectAll("tr")
					.data(dataSet).enter()
					.append("tr")

			.selectAll("td")
					.data(function(d) { return d; }).enter()
					.append("td")
					.text(function(d) { return d; });*/

  //table += '</tbody>';
  //table += '</table>';
  //$('#preView').append(table);

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

function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}
