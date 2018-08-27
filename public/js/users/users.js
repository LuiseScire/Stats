var profileUserCardStatus = 0;
var pucstatus = 0;
var usersDataSet = [];

$(function(){
    $('.selectpicker').selectpicker();
    getAllUsers();
    fadeOutLoader();
});

function getAllUsers(){
    var data = {'_token': CSRF_TOKEN, 'swithCase': 'getAll'};
    $.post('users', data, function(response) {

        usersDataSet = [];
        $('#userList').empty();

        var countUsers = 0;
        $.each(response.allUsers, function(index, v) {
            var id =  v.id;

            if(id != auth_id){
                usersDataSet[id] = {
                    'id': id,
                    'name': v.name,
                    'lastName': v.last_name,
                    'email': v.email,
                    'academicDegree' : v.jnals_academic_degree,
                    'userType' : v.user_type,
                    'city': v.city,
                    'journalType': v.jnals_user_type,
                    'country': v.jnals_country,
                    'state': v.jnals_state,
                    'city': v.jnals_city,
                    'avatar': v.avatar,
                    'status': v.status,
                    'phone': v.jnals_phone,
                    'degree_id': v.degree_id,
                    'degree': v.degree_name,
                    'country_es': v.country_es,
                    'country_en': v.country_en,
                    'logo': v.jnals_logo,
                    'journalName': v.jnals_journal_name
                };

                var user = usersDataSet[id];

                user['fullName'] = user.name + ' ' +user.lastName;

                user['location'] = user.city + ', ' + user.state + ', ' + user.country_es;

                var avatar = (user.avatar == null) ? 'default-user-avatar.png' : 'useravatar/' + user.avatar;
                user['urlAvatar'] = public_path + '/images/' + avatar;

                if(user.degree == null || user.degree == ''){
                    user['degree'] = 'No definido';
                }

                if(user.phone == null || user.phone == ''){
                    user['phone'] = 'No definido';
                }

                var profileCard = '<div class="col-md-4" id="profileCard'+id+'"><div class="profile-card-container">'+
                '                    <div class="profile-card-content">'+
                '                        <div class="profile-card-background" style="background-image: url('+user.urlAvatar+')"></div>'+
                '                        <div class="profile-card-image">'+
                '                            <img src="'+user.urlAvatar+'" width="50%" class="img-circle">'+
                '                            <h4>'+user.fullName+'</h4>'+
                '                        </div>'+
                '                    </div>'+
                '                    <div class="profile-card-caption">'+
                '                        <div class="profile-card-caption-item">'+
                '                            <span><i class="fa fa-user"></i> Tipo de usuario</span>'+
                '                            <h5>'+user.journalType+'</h5>'+
                '                        </div>'+
                '                        <div class="profile-card-caption-item">'+
                '                            <span><i class="fa fa-at"></i> Correo Electrónico</span>'+
                '                            <h5>'+user.email+'</h5>'+
                '                        </div>'+
                '                        <div class="profile-card-caption-item">'+
                '                            <span><i class="fa fa-graduation-cap"></i> Grado Académico</span>'+
                '                            <h5>'+user.degree+'</h5>'+
                '                        </div>'+
                '                        <div class="profile-card-caption-item">'+
                '                            <span><i class="fa fa-phone"></i> Teléfono</span>'+
                '                            <h5>'+user.phone+'</h5>'+
                '                        </div>'+
                '                        <div class="profile-card-caption-item">'+
                '                            <span><i class="fa fa-map-marker"></i> Ubicación</span>'+
                '                            <h5>'+user.location+'</h5>'+
                '                        </div>'+
                '                        <div class="profile-card-caption-item">'+
                '                            <span><i class="fa fa-check"></i> Estatus</span>'+
                '                            <h5>'+user.status+'</h5>'+
                '                        </div>'+
                '                        <div class="profile-card-caption-options text-center">'+
                '                            <button type="button" class="btn btn-default" name="button"><i class="fa fa-edit"></i> Actualizar datos</button>'+
                '                            <button type="button" class="btn btn-danger" name="button" onclick="deleteUser('+id+')"><i class="fa fa-trash"></i> Eliminar Usuario</button>'+
                '                        </div>'+
                '                    </div>'+
                '                </div></div>';

                $('#userList').append(profileCard);

                countUsers++;
            }
        });//end each()

        if(countUsers > 0){
            /*var user = usersDataSet[usersDataSet.length -1];

            if(user.logo != null && user.logo.trim() != ''){
                var url = public_path + 'images/journalslogo/' + user.logo;
                $('.cover-card-background').css('background-image', url);
                $('.cover-card-image').next('img').attr('src', url);
            }
            $('.cover-card-image h2').text(user.journalName);*/

            $('#btnGlobalOpenModalRegister, #userList').show();
        } else {
            $('#NoUserJumbotron').show();
        }
    });//end post
}

function userRegister(){
    var data = {'_token': CSRF_TOKEN};
    var form = $('#userRegisterForm');
    try {
        if($('input[name="userFirstName"]').val().trim().length < 1) throw 'Nombre(s) no puede estar vacío';
        if($('input[name="userLastName"]').val().trim().length < 1) throw 'Apellidos no puede estar vacío';
        if($('input[name="userEmail"]').val().trim().length < 1) throw 'Correo electrónico no puede estás vacío';
        if($('input[name="userPassword"]').val().trim().length < 1) throw 'Contraseña no puede estar vacía';
        if($('input[name="userPassword"]').val().trim().length < 8) throw 'La contraseña no puede ser menor a 8 caracteres';
        if(isNaN($('[name="userCountry"]').val())) throw 'Debe seleccionar un país';
        //alert('todo en orden');

        $.ajax({
            method  : 'POST',
            url     : '/userregister',
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
                    userRegisterModelHide();
                    swal(
                        '¡Genial!',
                        response.message,
                        'success'
                    );
                    getAllUsers();
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

function deleteUser(user_id ){
    var user = usersDataSet[user_id];
    swal({
        title: '¿Desea eliminar a '+user.name+'?',
        text: 'Los datos asociados a este usuario serán eliminados',
        imageUrl: user.urlAvatar,
        imageWidth: 150,
        imageHeight: 150,
        imageAlt: 'User Avatar',
        imageClass: 'img-circle',
        //type: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        confirmButtonColor: '#d9534f'
    }).then( function(result){
        if(result.value){
            var data = {'_token': CSRF_TOKEN, 'swithCase': 'delete', 'userId': user_id};
            $.post('/user', data, function(response){
                if(response.status == 'success'){
                    swal(
                      '¡Usuario eliminado satisfactoriamente!',
                      '',
                      'success'
                    );

                    $('#profileCard'+user_id).fadeOut('slow').remove();
                }

                if(response.status == 'error'){
                    swal(
                      '¡Error al eliminar usuario!',
                      '',
                      'error'
                    );
                }
            });

        }
    });
}

function userRegisterModalShow(){
    $('#userRegisterModal').modal('show');
}

function userRegisterModelHide(){
    $('#userRegisterModal').modal('hide');
}

function randomPassword(){
    var randPass = randomString(10, '#aA!');
    $('input[name="userPassword"]').val(randPass);
    //console.log(randomString(16, 'aA'));
    //console.log(randomString(32, '#aA'));
    //console.log(randomString(64, '#A!'));
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
