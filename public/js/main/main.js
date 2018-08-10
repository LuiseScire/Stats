/*$(window).on('load', function(){
    fadeOutLoader();
});*/
var displayDateES, displayDateEN, translate = [];
switch (currentLang) {
	case 'es':
		for(var i in esObject) {
			translate[i] = esObject[i];
		}
		displayDateES = 'display: block';
		displayDateEN = 'display: none';
		$('#currentDateES').show();
		break;
	case 'en':
		for(var i in enObject) {
			translate[i] = enObject[i];
		}
		displayDateES = 'display: none';
		displayDateEN = 'display: block';
		$('#currentDateEN').show();
		break;
}

/*uploadcsv*/
var fileNameConfirmed;
var changeFile = 0;

//datos globales para validar si existe el documento
var deleteExist = 0,
		csvFile, fileName, storageFileName;

var fileSizeExceeded = 0;

var globalTypeReport, globalTypeReportAllowed;

var preViewTable;

var indexArray = [];
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

function validateExistFiles(){
  var data = {'_token': CSRF_TOKEN};
  $.ajax({
    type: "POST",
    url: "listcsvfiles",
    data: data,
    dataType: "JSON",
    success: function(response){
      //console.log(response.csvDBList);
      var count = 0;

      $.each(response.csvList, function(index, v) {
          var csvId = v.csv_id;
          var csvName = v.csv_front_name;
          var csvDBName = v.csv_back_name;
          var csvPath = v.csv_path;
          var csvStatus = v.csv_status;
          var csvVersion = v.csv_version;
          var csvTimestamp = v.csv_timestamp;
          var csvTypeReport = v.csv_type_report;

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
          var lastElement = response.csvList[0];
          var typeReport = lastElement.csv_type_report_index;
          var getCsvFile = '/public'+lastElement.csv_path;
          var fileName = lastElement.csv_back_name;
          var _fileName = lastElement.csv_front_name;
          var csvTypeReport = lastElement.csv_type_report;

          $('.fileNamePanels').text(_fileName);
          $('.typeReportPanels').text(csvTypeReport);
          $('.seeAgain').data('csvname', fileName);

          //getCsv(getCsvFile, typeReport, fileName);
		  var typeReport = 0,
		  	  totals = 0,
			  countCountries = 0,
			  mainCountry = '';
		  var v = response.lastCsvFileData;

		  typeReport = v.last_type;
		  totals = v.last_block_one;
		  countCountries = v.last_block_two;
		  mainCountry = v.last_block_three

		  switch (typeReport){
              case 'Descargas':
                  totalsIcon = '<i class="fa fa-download fa-5x"></i>';
                  break;
              case 'Visitas':
                  totalsIcon = '<i class="fa fa-eye fa-5x"></i>';
                  break;
          }

          $('#panelTotalIcon').html(totalsIcon);
          $('#panelTotals').text(abbreviateNumber(totals));
          $('#panelTotalsText').text(typeReport);

		  $('#panelCountries').html(' En ' + countCountries);

		  var mcountry = mainCountry.split(',');
		  nameCountry = mcountry[0];
		  totalsCountry = mcountry[1];
          //nameCountry = (mainCountry.name.length > 8) ? mainCountry.code : nameCountry;
          var totls = $.number(totalsCountry);

          $('#panelMainCountry').text(nameCountry);
          $('#panelMainCountryText').text('Con '+totls+' '+typeReport);
		  $("#panelsHeading").css('display', 'block');
          $('#panelTotalsDetails, #panelCountriesDetails, #panelMainCountryDetails').attr('href', 'estadisticas/archivo/'+fileName);

          $("#csvListContent").css('display', 'none');
          $('#tabHistory').show();
          $('#segunInfo').css('display', 'block');
        //$("#noFiles").css('display', 'block');
		//fadeOutLoader();
      } else {
        $("#noFiles, #uploadFilesContent").css('display', 'block');
        fadeOutLoader();
      }
    }
  });
}

$(document).on('click', '.csv-file-item', function() {
    var fileName = $(this).data('csvname');
    location.href = 'estadisticas/archivo/' + fileName;
});

function deleteItem(csvId, fileName) {
    var data = {'_token': CSRF_TOKEN, 'case':'delete', 'csv_id': csvId};

    var _confirm = confirm("¿Está seguro que desea eliminar '"+fileName+"'?");
    if(_confirm) {
        $.post('listcsvfiles', data, function(response) {
            var status = response.status;
            var message = response.message;

            if(status == "success") {
                $("#itemFile"+csvId).slideUp("slow");
                totalFiles = totalFiles - 1;
                if(totalFiles == 0) {
                    $("#noFiles").css('display', 'block');
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
                break;
        }

        $('#panelTotalIcon').html(totalsIcon);
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

/*uploadcsv*/
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
    	$('#csvFile').click();
    } else {
    	alert(translate.continueSelectFile);
	}
});

$("#csvFile").change(function() {
	$('#typeReportModal').find('button.close').click();
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
					var _confirm = confirm(translate.fileExceedsLegend);
					if(_confirm) {
                        subirCsv();
					}
				} else {
                    subirCsv();
				}

			} else {
			  alert(translate.fileNotAllowed);
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

	$('#history, #noFiles, #panelsHeading, #segunInfo').css('display', 'none');

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

var globalTotals = 0;
var globalNameCountry = '';
var globalTotalsMainCountry = 0;
var globalCountCountries = 0;
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
                checkboxTitles += '<label class="checkbox-inline"><input type="checkbox" name="indices[]" data-index="'+indices+'" value="'+title+'">'+title+'</label>';
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

        alertContent += '<p><button id="uploadFileConfirmed" class="btn btn-primary btn-xs" data-lang="modal-continue-btn">Continuar <i class="fa fa-arrow-right"></i> </button></p>';
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

					var report = '';
					switch (parseInt(globalTypeReportAllowed)){
			            case 0:
			            case 2:
			                report = "Descargas";
			                break;
			            case 1:
			            case 3:
			            case 4:
			                report = "Visitas";
			                break;
			        }

					var data = {
						'_token'	: CSRF_TOKEN,
						'type'		: report,
						'block_one'	: globalTotals,
						'block_two' : globalCountCountries,
						'block_three': globalNameCountry + ','+globalTotalsMainCountry
					};
					$.post('lastcsv', data, function(response) {
						location.href = 'estadisticas/archivo/' + storageFileName;
					});
				}
			}
		});

	} else {
		alert(translate.checkboxUnchecked);
	}
});

/*function lastcsv(){

}*/

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
