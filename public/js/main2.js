
$(document).ready(function(){
  getList();
});

function getList(){
  var data = {'_token': CSRF_TOKEN}
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

        var stringName;

        if(csvVersion == null) {
          stringName = csvName + " - " + csvTimestamp;
        } else {
          stringName = csvName + " - " + csvVersion + " - " + csvTimestamp;
        }



        //console.log(v);
        var li = '<li class="list-group-item">';
            li+=  '<a class="csv-file-item" data-csvname="'+csvDBName+'">';
            li+=    '<label style="cursor:pointer"><i class="fa fa-file"></i> '+stringName+'</label>';
            li+=  '</a>';//fa-ellipsis-v

            li+=  '<div class="dropdown pull-right">';
            li+=      '<a class="dropdown-toggle" data-toggle="dropdown" href="#">';
            li+=          '<i class="fa fa-ellipsis-v"></i>';
            li+=      '</a>';
            li+=      '<ul class="dropdown-menu dropdown-user">';
            li+=        '<li>';
            li+=          '<a href="#"><i class="fa fa-trash fa-fw"></i> Eliminar</a>';
            li+=        '</li>';
            /*li+=        '<li>';
            li+=          '<a href="#"><i class="fa fa-gear fa-fw"></i> Settings</a>';
            li+=        '</li>';
            li+=        '<li class="divider"></li>';
            li+=        '<li>';
            li+=          '<a>';
            li+=            '<i class="fa fa-sign-out fa-fw"></i>';
            li+=          '</a>';
            li+=        '</li>';*/
            li+=      '</ul>';
            li+=   '</div>';

            li+= '</li>';

        $("#csvList").append(li);
        count++;
      });

      /*$.each(response.fileList, function(index, v){
        count++;
        var li = '<li class="list-group-item">';
            li+=  '<a class="csv-file-item" data-csvname="'+v+'">';
            li+=    '<label style="cursor:pointer"><i class="fa fa-file"></i> '+v+'</label>';
            li+=  '</a>'//fa-ellipsis-v
            li+=  '<i class="fa fa-ellipsis-v pull-right delete-csv-file-menu" data-csvname="'+v+'"></i>';
            li+= '</li>';
        $("#csvList").append(li);
      });*/

      if(count > 0){
        $("#csvListContent").css('display', 'block');
        $("#noFiles").css('display', 'none');
      } else {
        $("#noFiles").css('display', 'block');
      }
    }
  });
}

$(document).on('click', '.csv-file-item', function() {
  var fileName = $(this).data('csvname');
  location.href = 'estadisticas/archivo/' + fileName;
});

$(document).on('click', '.delete-csv-file-menu', function() {

});
