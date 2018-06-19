
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
        var li = '<li class="list-group-item csv-file-item" data-name="'+v+'">';
            li+=  '<i class="fa fa-file"></i> '+v;
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
  var fileName = $(this).data('name');

  location.href = 'estadisticas/' + fileName;
});
