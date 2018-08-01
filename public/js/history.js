$(window).on('load', function(){
    fadeOutLoader();
});

$(document).ready(function(){
    getList();
});

function getList(){
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



                var stringName, stringNameConfirm;

                if(csvVersion == null) {
                    //stringName = csvName + " - " + dateFormat(csvTimestamp);
                    stringName ='<label style="cursor:pointer;"><i class="fa fa-file"></i> '+csvName + '</label> - <span style="color:gray">' + dateFormat(csvTimestamp)+'</label>';
                    stringNameConfirm = csvName;
                } else {
                    //stringName = csvName + "(" + csvVersion + ") - " + dateFormat(csvTimestamp);
                    stringName = '<label style="cursor:pointer;"><i class="fa fa-file"></i> '+csvName+'('+csvVersion+')</label> - <span style="color:gray"> '+dateFormat(csvTimestamp)+'</span>'
                    stringNameConfirm = csvName + "(" + csvVersion + ")";
                }

                //console.log(v);
                var li = '<li id="itemFile'+csvId+'" class="list-group-item">';
                li+=  '<a class="csv-file-item" data-csvname="'+csvDBName+'" style="text-decoration: none">';
                li+=    stringName;
                li+=  '</a>';//fa-ellipsis-v

                li+=  '<div class="dropdown pull-right" style="float:left">';
                li+=      '<a class="dropdown-toggle" data-toggle="dropdown" href="#">';
                li+=          '<i class="fa fa-ellipsis-v"></i>';
                li+=      '</a>';
                li+=      '<ul class="dropdown-menu dropdown-user">';
                li+=        '<li>';
                li+=          '<a href="javascript:void(0)" class="csv-file-item" data-csvname="'+csvDBName+'"><i class="fa fa-bar-chart"></i> Ver Gráficas</a>';
                li+=        '</li>';
                li+=        '<li>';
                li+=          '<a href="#" onClick="deleteItem('+csvId+', '+"'"+stringNameConfirm+"'"+')"><i class="fa fa-trash fa-fw"></i> Eliminar</a>';
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

            if(count > 0){
                $("#csvListContent").css('display', 'block');
                $("#titleAlert").addClass('alert-success');
                $("#totalFiles").text(count);
            } else {
                $("#noFiles").css('display', 'block');
                $("#titleAlert").addClass('alert-danger');
                $('#totalFiles').text(0);
            }
        }
    });
}

function deleteItem(csvId, fileName) {
    var data = {'_token': CSRF_TOKEN, 'case':'delete', 'csv_id': csvId}

    var _confirm = confirm("¿Está seguro que desea eliminar '"+fileName+"'?");
    if(_confirm) {
        $.post('listcsvfiles', data, function(response) {
            var status = response.status;
            var message = response.message;

            if(status == "success") {
                $("#itemFile"+csvId).slideUp("slow");
                setTimeout(function() {
                    //alert(message);
                }, 1000);
            }

            if(status == "error") {
                alert(message);
            }
        });
    }
}

function dateFormat(date){
    var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septimbre", "octube", "Nomviembre", "Diciembre"];

    var date = new Date(date);

    var dateFormat = "subido el " + date.getDate() + " de " + months[date.getMonth()] + " de " + date.getFullYear();
    dateFormat += " " + date.toLocaleString('en-EU', { hour: 'numeric', minute: 'numeric', hour12: true });

    return dateFormat;
}

$(document).on('click', '.csv-file-item', function() {
    var fileName = $(this).data('csvname');
    location.href = 'estadisticas/archivo/' + fileName;
});