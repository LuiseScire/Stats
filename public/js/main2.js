
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
      var count = 0;
      $.each(response.fileList, function(index, v){
        count++;
        var li = '<li class="list-group-item">';
            li+=  '<a class="csv-file-item" data-csvname="'+v+'">';
            li+=    '<label style="cursor:pointer"><i class="fa fa-file"></i> '+v+'</label>';
            li+=  '</a>'//fa-ellipsis-v
            li+=  '<i class="fa fa-ellipsis-v pull-right delete-csv-file-menu" data-csvname="'+v+'"></i>';
            li+= '</li>';
        $("#csvList").append(li);
      });

      if(count > 0){
        $("#csvListContent").css('display', 'block');
        $("#noFiles").css('display', 'none');
      } else {
        $("#noFiles").css('display', 'none');
      }
    }
  });
}

$(document).on('click', '.csv-file-item', function() {
  var fileName = $(this).data('csvname');
  location.href = 'estadisticas/archivo/' + fileName;
});

$(document).on('click', '.delete-csv-file-menu', function() {
  var fileName = $(this).data('csvname');
  console.log(fileName);
});
