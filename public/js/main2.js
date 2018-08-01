/*$(window).on('load', function(){
    fadeOutLoader();
});*/

var totalFiles = 0;

var words = [];

$(document).ready(function(){
    $('.global-item-menu').css('display', 'none');
    $('.home-item-menu').css('display', 'block');
    setTimeout(function () {
        var urlHASH = window.location.hash;
        $('a.link-menu[href="'+urlHASH+'"]').click();
    }, 500);
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
              '             <br><small style="color: #72777a">'+dateFormat(csvTimestamp) +'</small>' +
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

          getCsv(getCsvFile, typeReport, fileName);
          $("#csvListContent").css('display', 'none');
          $('#tabHistory').show();
        //$("#noFiles").css('display', 'block');
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

        /* **************************************/
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

        /* **************************************/
        var countCountries = 0;
        var _countriesObj = countriesObj.sort(dynamicSort("downloads"));
        $.each(_countriesObj, function(index, v) {
            var downloads = v.downloads;
            if(downloads > 0){
                countCountries++;
            }
        });
        $('#panelCountries').html(' En ' + countCountries);

        /* **************************************/
        var mainCountry = _countriesObj[0];

        var nameCountry = mainCountry.name;
        nameCountry = (mainCountry.name.length > 8) ? mainCountry.code : nameCountry;
        var totls = $.number(mainCountry.downloads);

        $('#panelMainCountry').text(nameCountry);

        $('#panelMainCountryText').text('Con '+totls+' '+typeReport);
        /* **************************************/
        $("#panelsHeading").css('display', 'block');

        $('#panelTotalsDetails, #panelCountriesDetails, #panelMainCountryDetails').attr('href', 'estadisticas/archivo/'+fileName);

        $('#cloudWords').jQCloud(words);

        fadeOutLoader();
    });//end d3.text()
}


/*---------------EXTRA FUNCTIONS------------------*/
function dateFormat(date){
    var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septimbre", "octube", "Nomviembre", "Diciembre"];

    var date = new Date(date);

    var dateFormat = "Subido el " + date.getDate() + " de " + months[date.getMonth()] + " de " + date.getFullYear();
    dateFormat += " " + date.toLocaleString('en-EU', { hour: 'numeric', minute: 'numeric', hour12: true });

    return dateFormat;
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



