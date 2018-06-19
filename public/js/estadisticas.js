$(document).ready(function() {
  if(fileName != 'noData'){
    $("#chartsContent").css('display', 'block');
    $("#noDataText").css('display', 'none');
    //obtenerdatos();
  } else {
    $("#noDataText").html('Error al recibir los datos. Inténtelo de nuevo, por favor.')
  }
});

function obtenerdatos(){
  var data = {'_token': CSRF_TOKEN, 'filename': fileName};

  $.ajax({
    type: "POST",
    url: "readcsv",
    data: data,
    dataType: "JSON",
    success: function(response) {
      console.log(response);
    }
  });
}
