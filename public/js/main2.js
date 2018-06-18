var CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content');
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
      console.log(response.fileList)
      var count = 0;
      $.each(response.fileList, function(index, v){
        count++;
        var li = '<li class="list-group-item"> <i class="fa fa-file"></i> '+v+'</li>';
        $("#csvList").append(li);
      });
      console.log(count);

      if(count > 0){
        $("#csvListContent").css('display', 'block');
        $("#noFiles").css('display', 'none');
      } else {
        $("#noFiles").css('display', 'none');
      }
    }
  });
}
