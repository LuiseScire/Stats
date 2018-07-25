$(window).on('load', function(){
    fadeOutLoader();
});

$(document).ready(function(){
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
          count++;
      });

      if(count > 0){
          var lastElement = response.csvList[0];
          var typeReport = lastElement.csv_type_report_index;
          var getCsvFile = '/public'+lastElement.csv_path;
          var fileName = lastElement.csv_back_name;

          getCsv(getCsvFile, typeReport, fileName);
        //$("#csvListContent").css('display', 'block');
        //$("#noFiles").css('display', 'none');
      } else {
        //$("#noFiles").css('display', 'block');
      }
    }
  });
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
        $('#panelCountries').html('<i class="fa fa-plus"></i> de ' + countCountries);

        /* **************************************/
        var mainCountry = _countriesObj[0];
        console.log(mainCountry);
        var nameCountry = mainCountry.name;
        nameCountry = (mainCountry.name.length > 8) ? mainCountry.code : nameCountry;
        var totls = $.number(mainCountry.downloads);

        $('#panelMainCountry').text(nameCountry);

        $('#panelMainCountryText').text('País con '+totls+' '+typeReport);
        /* **************************************/
        $("#panelsHeading").css('display', 'block');

        $('#panelTotalsDetails, #panelCountriesDetails, #panelMainCountryDetails').attr('href', 'estadisticas/archivo/'+fileName);

    });//end d3.text()
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
/*---------------------------------*/


