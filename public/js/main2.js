
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
        var li = '<a class="csv-file-item" data-csvname="'+v+'"><li class="list-group-item">';
            li+=  '<label style="cursor:pointer"><i class="fa fa-file"></i> '+v+'</label>';
            li+= '</li></a>';
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
