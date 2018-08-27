var dataSet = [], //data for DataTable
    journalsTable, //datatable id
    journalData = [];

$(document).ready(function(){
    fadeOutLoader();
    getJournalUsers();
    createTable();
});

function createTable(){
    journalsTable = $('#journalsTable').DataTable({
        'columns': [
            {'title': 'Revísta'},
            {'title': 'Tipo de Licencia'},
            {'title': 'Usuarios registrados'},
            {'title': 'Estatus'},
            {'title': ''}
        ],
    });
}

function userJournalRegister(event){
    var eSelector = event.target;
    var _this = $(eSelector);
    var registerType = _this.data('register');
    var journalId = _this.data('journalid');

    try {
        if(registerType == 'journal'){
            if($('input[name="userJournalName"]').val().trim().length < 1) throw 'Debe ingresar el nombre de la revista';
        }

        if($('input[name="userFirstName"]').val().trim().length < 1) throw 'Nombre(s) no puede estar vacío';
        if($('input[name="userLastName"]').val().trim().length < 1) throw 'Apellidos no puede estar vacío';
        if($('input[name="userEmail"]').val().trim().length < 1) throw 'Correo electrónico no puede estás vacío';
        if($('input[name="userPassword"]').val().trim().length < 1) throw 'Contraseña no puede estar vacía';
        if($('input[name="userPassword"]').val().trim().length < 8) throw 'La contraseña no puede ser menor a 8 caracteres';
        if($('input[name="userAscription"]').val().trim().length < 1) throw 'Debe escribir la Adscripción';
        if(isNaN($('[name="userCountry"]').val())) throw 'Debe seleccionar un país';
        $('#registerFormAlert').fadeOut('slow');

        var data = {'_token': CSRF_TOKEN, 'registerType': registerType, 'journalId': journalId};
        var form = $('#userRegisterForm');

        $.ajax({
            method  : 'POST',
            url     : 'userregister',
            data    : form.serialize() + '&' + $.param(data),
            dataType: 'JSON',
            success : function(response) {
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
                    $('#journalRegisterModal').modal('hide');
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
        dataSet = [];
        $.each(response.journals, function(index, v){
            var id = v.jnal_id;

            journalData[id] = {
                'journalId': id,
                'journalName': v.jnal_name,
                'journalPhone': v.jnal_phone,
                //'journalAdscripcion': v.journals_adscripcion
            };

            var data = [];
            data[0] = v.jnal_name;
            data[1] = v.jnal_pack_plan;
            data[2] = v.jnal_total_users;
            data[3] = v.jnal_status;
            data[4] =
            '<div class="dropdown pull-right">'+
            '   <button class="btn btn-danger btn-sm dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
            '       <i class="fa fa-gears"></i>'+
            '       Opciones '+
            '       <span class="caret"></span>'+
            '   </button>'+
            '    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">'+
            '       <li><a href="javascript:void(0)" onclick="showModalJournalRegister('+id+')"><i class="fa fa-user-plus"></i> Registrar Usuario</li>'+
            '       <li><a href="javascript:void(0)" onclick="showUsers('+id+', event)" data-journalname="'+data[0]+'"><i class="fa fa-users"></i> Ver Usuarios</a></li>'+
            '       <li role="separator" class="divider"></li>'+
            '       <li><a href="javascript:void(0)" onclick="deleteUserJournal('+id+', event)" data-userjournal="journal"><i class="fa fa-trash"></i> Eliminar Revista</a></li>'+
            '    </ul>'+
            '</div>';

            dataSet.push(data);
        });

        loadDataforJournals();
    });
}

function loadDataforJournals(){
    journalsTable.destroy();

    journalsTable = $('#journalsTable').DataTable({
        data: dataSet,
        responsive: true,
        "ordering": false,
    });
}

function showUsers(journalId, event){
    $('#journalsTable tbody tr').removeClass('row-selected');

    var eSelector = event.target;
    $(eSelector).parents("tr").attr('id', 'parentRow' + journalId).addClass('row-selected');

    var newRowId = $(".newRow").attr('id'),
        columns = $('#journalsTable thead th').length,
        journalName = $(eSelector).data('journalname');

    $(".newRow").slideUp();
    $(".newRow").remove();

    var data = {'_token': CSRF_TOKEN, 'switchCase': 'getJUsers', 'journalId': journalId};
    $.post('users', data, function(response) {
        var newRow = '<tr id="newRow' + journalId + '" class="newRow">'+
                        '<td id="newRowCell" colspan="' + columns + '" style="background-color:#d9534f"></td>'+
                     '</tr>';
        $('#parentRow' + journalId).after(newRow);

        var legend = '<p style="color: #fff;">Usuarios de <strong><i>'+journalName+'</i></strong></p>';
        $('#newRowCell').append(legend);

        var usersList = '<table class="table" id="usersList" width="100%"><thead><tr>'+
                            '<th><i class="fa"></i> Nombre</th>'+
                            '<th><i class="fa"></i> email</th>'+
                            '<th><i class="fa"></i> Tipo usuario</th>'+
                            '<th><i class="fa"></i> Estatus</th>'+
                            '<th><i class="fa"></i> </th>'+
                        '</tr></thead><tbody></tbody></table>';
        $('#newRowCell').append(usersList);

        var footer = '<div class="col-md-12"><button class="btn btn-default btn-sm pull-right close-panel-users"> <i class="fa fa-times"></i> Cerrar</button></div>';
        $('#newRowCell').append(footer);

        $('#usersList tbody').empty();

        $.each(response.users, function(index, v){
            var userId = v.id;
                fullname = v.name + ' ' + v.last_name;
                email = v.email;
                userType = v.jnals_user_type;
                status = v.status;
                options = '<div class="dropdown pull-right">'+
                '   <button class="btn btn-danger btn-sm dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
                '       <i class="fa fa-gears"></i>'+
                '       Opciones '+
                '       <span class="caret"></span>'+
                '   </button>'+
                '    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">'+
                '       <li><a href="javascript:void(0)"><i class="fa fa-edit"></i> Editar Usuario</a></li>'+
                '       <li role="separator" class="divider"></li>'+
                '       <li><a href="javascript:void(0)" onclick="deleteUserJournal('+userId+', event)" data-userjournal="user"><i class="fa fa-trash"></i> Eliminar Usuario</a></li>'+
                '    </ul>'+
                '</div>';

            $('#usersList').find('tbody')
              .append($('<tr></tr>').attr("id", "user" + userId)
                .append($('<td>' + fullname + '</td>'))
                .append($('<td>' + email + '</td>'))
                .append($('<td>' + userType + '</td>'))
                .append($('<td>' + status + '</td>'))
                .append($('<td>' + options + '</td>'))
              );
        });
    });
}

$(document).on('click', '.close-panel-users', function(){
    $('.newRow').remove();
    $('#journalsTable tbody tr').removeClass('row-selected');
});

function showModalJournalRegister(journalId){
    var journalName = journalData[journalId].journalName,
        journalPhone = journalData[journalId].journalPhone;
        //journalAdscripcion = journalData[journalId].journalAdscripcion;

    $('#modalRegisterTitle').text('Nuevo Usuario');

    $('input[name="userJournalName"]').val(journalName).attr('disabled', 'disabled');
    $('input[name="userJournalPhone"]').val(journalPhone).attr('disabled', 'disabled');
    //$('input[name="userAscription"]').val(journalAdscripcion).attr('disabled', 'disabled');

    $('#btnRegisterUserJournal').data('register', 'user').data('journalid', journalId);
    $('#btnGlobalOpenModalRegister').click();
}

function deleteUserJournal(id, event){
    var eSelector = event.target;
    var userJournal = $(eSelector).data('userjournal');

    var data = {'_token': CSRF_TOKEN, 'userJournal': userJournal, 'id': id, 'switchCase': 'delete'};

    $.post('users', data, function(response){

        if(response.status == 'success') {
            swal(
                '¡Genial!',
                'Eliminado correctamente',
                'success'
            );
        }

        if(response.status == 'error') {
            swal(
                'Error!',
                'Error al eliminar, inténtelo más tarde por favor.',
                'error'
            );
        }

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
