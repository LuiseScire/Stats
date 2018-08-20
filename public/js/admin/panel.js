

$(document).ready(function(){
    fadeOutLoader();
    getJournalUsers();
});

var dataSet = [], //data for DataTable
    journalsTable; //datatable id

function userRegister(){
    var data = {'_token': CSRF_TOKEN};
    var form = $('#userRegisterForm');
    try {
        if($('input[name="userFirstName"]').val().trim().length < 1) throw 'Nombre(s) no puede estar vacío';
        if($('input[name="userLastName"]').val().trim().length < 1) throw 'Apellidos no puede estar vacío';
        if($('input[name="userEmail"]').val().trim().length < 1) throw 'Correo electrónico no puede estás vacío';
        if($('input[name="userPassword"]').val().trim().length < 1) throw 'Contraseña no puede estar vacía';
        if($('input[name="userPassword"]').val().trim().length < 8) throw 'La contraseña no puede ser menor a 8 caracteres';
        if($('input[name="userAscription"]').val().trim().length < 1) throw 'Debe escribir la Adscripción';
        if($('input[name="userJournalName"]').val().trim().length < 1) throw 'Debe ingresar el nombre de la revista';
        if(isNaN($('[name="userCountry"]').val())) throw 'Debe seleccionar un país';


        $.ajax({
            method  : 'POST',
            url     : 'userregister',
            data    : form.serialize() + '&' + $.param(data),
            dataType: 'JSON',
            success : function(response) {
                console.log(response);
                if(response.status == 'error-mail'){
                    $('#registerFormAlert').fadeOut('fast').fadeIn('slow');
                    $('#registerFormAlertMessage').text(response.message);
                    swal(
                        '!Error!',
                        response.message,
                        'error'
                    );
                }

                if(response.status == 'success'){
                    $('#userRegisterModal').modal('hide');
                    swal(
                        '¡Genial!',
                        response.message,
                        'success'
                    );
                    getJournalUsers();
                    form.get(0).reset();
                }

                if(response.status == 'error'){
                    userRegisterModelHide();
                    swal(
                        '!Error!',
                        response.message,
                        'error'
                    );
                }

            },
        });
    } catch (e) {
        swal(
            '¡Error!',
            e,
            'error'
        );
        $('#registerFormAlert').fadeOut('fast').fadeIn('slow');
        $('#registerFormAlertMessage').text(e);
    }
}

function getJournalUsers(){
    var data = {'_token': CSRF_TOKEN, 'switchCase': 'getJAdmin'};
    $.post('users', data, function(response) {

        $.each(response.journals, function(index, v){
            var id = v.jnal_id;
            var data = [];
            data[0] = v.jnal_name;
            data[1] = v.jnal_pack_plan;
            data[2] = v.jnal_total_users;
            data[3] = v.jnal_status;
            data[4] =
            '<div class="dropdown pull-right">'+
            '   <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
            '       <i class="fa fa-gears"></i>'+
            '       Opciones '+
            '       <span class="caret"></span>'+
            '   </button>'+
            '    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">'+
            '       <li><a href="#" onclick="showUsers('+id+', event)"><i class="fa fa-users"></i> Ver Usuarios</a></li>'+
            '       <li role="separator" class="divider"></li>'+
            '       <li><a href="#"><i class="fa fa-trash"></i> Eliminar Revista</a></li>'+
            '    </ul>'+
            '</div>';
            dataSet.push(data);
        });



        loadDataforUsers();
    });

}

function loadDataforUsers(){
    journalsTable = $('#journalsTable').DataTable({
        'columns': [
            {'title': 'Revista'},
            {'title': 'Paquete'},
            {'title': 'Usuarios registrados'},
            {'title': 'Estatus'},
            {'title': ''}
        ],
        data: dataSet,
        responsive: true,
        "ordering": false,
    });
}

function showUsers(journalId, event){
    $(event.target).parents("tr").attr('id', 'parentRow' + journalId);

    var newRowId = $(".newRow").attr('id');
    var columns = $('#journalsTable thead th').length;


    $(".newRow").slideUp();
    $(".newRow").remove();

    var data = {'_token': CSRF_TOKEN, 'switchCase': 'getJUsers', 'journalId': journalId};
    $.post('users', data, function(response) {
        console.log(response);

        var newRow = '<tr id="newRow' + journalId + '" class="newRow">'+
                        '<td id="newRowCell" colspan="' + columns + '"></td>'+
                     '</tr>';

        var usersList = '<table class="table table-striped" id="usersList" width="100%"><thead><tr>'+
                            '<th><i class="fa"></i> Nombre</th>'+
                            '<th><i class="fa"></i> email</th>'+
                            '<th><i class="fa"></i> Tipo usuario</th>'+
                            '<th><i class="fa"></i> Estatus</th>'+
                            // '<th><i class="fa"></i> Opciones</th>'+
                        '</tr></thead><tbody></tbody></table>';

        $('#parentRow' + journalId).after(newRow);
        $('#newRowCell').append(usersList);
        $('#usersList tbody').empty();

        $.each(response.users, function(index, v){
            var userId = v.id;
                fullname = v.name + ' ' + v.last_name;
                email = v.email;
                userType = v.jnals_user_type;
                status = v.status;
                options = '';

            $('#usersList').find('tbody')
              .append($('<tr></tr>').attr("id", "user" + userId)
                .append($('<td>' + fullname + '</td>'))
                .append($('<td>' + email + '</td>'))
                .append($('<td>' + userType + '</td>'))
                .append($('<td>' + status + '</td>'))
                // .append($('<td>' + options + '</td>'))
              );
        });
    });

}

function randomPassword(){
    var randPass = randomString(10, '#aA!');
    $('input[name="userPassword"]').val(randPass);
}

function randomString(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
    return result;
}



function showUsers_(journalId){
  $("#btnShowPays" + journalId).parentsUntil("tbody").attr('id', 'parentRow' + journalId);

  var idRow = $(".newRow").attr('id');
  var columns = $('#tabPagos thead th').length;

  if("newRow" + journalId == idRow){
    $(".newRow").slideUp();
    $(".newRow").remove();
  }else{
    $(".newRow").slideUp();
    $(".newRow").remove();
    $.ajax({
      type: "POST",
      url: "/pagos/obtenerpagosporlugaresadmin",
      data: {'journalId': journalId, 'tipoPagoVRI': tipoPagoVRI},
      dataType: "JSON",
      success: function(response){
        if(response.length > 0){
          var newRow = '<tr id="newRow' + journalId + '" class="newRow">';
          newRow += '<td id="newRowCell" colspan="' + columns + '" style="background-color:#546378"></td>';
          newRow += '</tr>';

          var paysListTable = '<table id="paysListTable" width="100%" style="text-align:center"><thead><tr>';
          paysListTable += '<th><i class="fa fa-usd"></i> Pago</th>';
          paysListTable += '<th><i class="fa fa-check-square-o"></i> Método de Pago</th>';
          paysListTable += '<th><i class="fa fa-clock-o"></i> Fecha</th>';
          paysListTable += '<th><i class="fa fa-calendar-check-o"></i> Estatus</th>';
          paysListTable += '<th><i class="fa fa-gears"></i> Opciones</th>';
          paysListTable += '</tr></thead></table>';

          $("#parentRow" + journalId).after(newRow);
          $("#newRowCell").append(paysListTable);
          $("#paysListTable tbody").empty();

          $.each(response, function(index, e){
            var idTabVRI, opciones, autorizar, title;
            var pago = "$" + $.number(e.pago, 2, '.', ',');
            var metodoPago = e.metodoPago;
            var fecha = e.fecha;
            var estatus = e.estatus;
            var idUsuario = 0;

            switch(tipoPagoVRI){
              case 'ventas':
                journalId = e.idPagosVentas;
                break;
              case 'rentas':
                journalId = e.idPagosRentas;
                break;
              case  'inversiones':
                journalId = e.idPagosInversiones;
                break;
            }
            var estatus_ = '<span id="estatus' + journalId + '">' + estatus + '</span>';
            /*Parametros en autorizarCancelarPago()
                       1 = 0 para autorizar, 1 para cancelar
                       2 = idtable
            */
            var display, displayC;
            opciones = '<div>';
            if(estatus != "Autorizado"){
              display = 'display:inline';
              displayC = 'display:none';
            }else if(estatus == "Cancelado"){
              displayC = 'display:none';
            }else{
              display = 'display:none';
              displayC = 'display:inline';
            }
            opciones += '<button id="btn' + journalId + '" style=" ' + display + '"  title="Autorizar" onclick="autorizarCancelarPago(' + 0 + ', ' + journalId + ', ' + idUsuario + ')"><i class="fa fa-check" style="color:green"></i></button>&nbsp;';
            opciones += '<button id="btnC' + journalId + '" style="' + displayC + '" title="Cancelar" onclick="autorizarCancelarPago(' + 1 + ', ' + journalId + ', ' + idUsuario + ')"><i class="fa fa-times" style="color:darkred"></i></button>';
            opciones += '</div>';

            switch(tipoPagoVRI){
              case 'ventas':
                idTabVRI = e.idPagosVentas;
                break;
            }

            $("#paysListTable")
              .append($('<tr></tr>').attr("id", "pay" + idTabVRI)
                .append($('<td>' + pago + '</td>'))
                .append($('<td>' + metodoPago + '</td>'))
                .append($('<td>' + fecha + '</td>'))
                .append($('<td>' + estatus_ + '</td>'))
                .append($('<td>' + opciones + '</td>'))
              );
          });	//end $.each();

          //setTimeout(function(){  }, 100);
          scrollBottom();
        }else{
          $("#btnShowPays" + journalId).notify(
            "Aún no se han realizado pagos",
            {
              className: "info",
              position: "left"
            }
          );
        }//end if response.length
      },//end ajax success
      error: function(jqXHR, exception){
        var message = getAjaxErrorMessage(jqXHR, exception);
        swal({
          title: 'Error!',
          text: message,
          type: 'error',
          confirmButtonText: 'Aceptar'
        });
      }//end ajax error
    });
    // end $.ajax()
  }
}
