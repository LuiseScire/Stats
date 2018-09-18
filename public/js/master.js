$(document).ready(function(){
    var data = {'_token': CSRF_TOKEN, 'switchCase': 'getLastFile'};
    start(data);
});

function start(data){
    $('#chartsModuleContent').show();
    $.post('files', data, function(response){
        var file_folder_id,
            file_back_name,
            file_front_name,
            fileIndices,
            fileIndicesRoles,
            type_report,
            typeReportIndex;

        $.each(response, function(index, v){
            file_folder_id = v.file_folder_id;
            liFolderId = file_folder_id;

            file_back_name = v.file_back_name;
            file_front_name = v.file_front_name;
            globalFileId = v.file_id;
            fileIndices = v.file_indices;
            fileIndicesRoles = v.file_role_indices;
            indexArray = JSON.parse("[" + fileIndices + "]");
            indexArrayRoles = JSON.parse("[" + fileIndicesRoles + "]");
            globalFileType = v.file_type;
            typeReportIndex = v.file_report_index;
            type_report = v.file_report_name;
        });

        var text = 'Información obtenida del reporte <strong style="color: #ad0004;"><i>'+type_report+'</i></strong>.<br> <small>Archivo: ' + file_front_name + '</small>';
        $('#topTitle').html(text);
        filePath = public_path + 'files/'+file_back_name

        switch (typeReportIndex){
            case 0:
            case 2:
                globalTypeReport = "Descargas";
                break;
            case 1:
            case 3:
            case 4:
                globalTypeReport = "Visitas";
                break;
            case 5:
                globalTypeReport = 'Usuarios';
                break;
        }

        folderIdActive = liFolderId;

        var data = {'_token': CSRF_TOKEN, 'switchCase': 'getFolders'};
        var countFolders = 2;
        $.post('files', data, function(response){
            $.each(response, function(index, v){
                $.each(v, function(ind, val){
                    var folder_name = val.folder_name;
                    var folder_id = val.folder_id;
                    var sortOrder = countFolders;
                    //console.log(file_folder_id);
                    if(file_folder_id == folder_id){
                        sortOrder = 1;
                    }

                    var li = '<li class="folder-list" id="liFolder'+folder_id+'" data-folderid="'+folder_id+'" data-folderorder="'+sortOrder+'">'+
                                '<a href="#"><i class="fa fa-bar-chart fa-fw" style="color: darkred"></i> Gráfica de '+folder_name+'<span class="fa arrow"></span></a>'+
                                '<ul class="nav nav-second-level" id="folder'+folder_id+'" data-folderid="'+folder_id+'">'+

                                '</ul>'+
                            '</li>';

                    $('#side-menu').append(li);
                    countFolders++;
                });
            });

            // var sortList = $('#side-menu');
            //
            // var elements = sortList.children('li.folder-list').get();
            // elements.sort(function(a,b) {
            //   var A = $(a).data('folderorder');
            //   var B = $(b).data('folderorder');
            //   return (A < B) ? -1 : (A > B) ? 1 : 0;
            // });
            //
            // elements.forEach(function(element) {
            //   sortList.append(element);
            // });

            //getFileData(file_back_name);

            //var folderId = $('.folder-list:first').find('ul').data('folderid');
            // var data = {'_token': CSRF_TOKEN, 'switchCase': 'getFiles', 'folderId': folderId};
            // $.post('files', data, function(response) {
            //     $.each(response, function(index, v){
            //         $.each(v, function(ind, val) {
            //             var folder_id = val.file_folder_id;
            //             var file_name = val.file_front_name;
            //
            //             var li = '<li class="file-list">'+
            //                         '<a href="#"><i class="fa fa-file fa-fw"></i> '+file_name+'<span class="fa arrow"></span></a>'+
            //                         '<ul class="nav nav-third-level">'+
            //                             '<li>'+
            //                                 '<a href="panels-wells.html">Panels and Wells</a>'+
            //                             '</li>'+
            //                         '</ul>'+
            //                     '</li>';
            //
            //             $('#folder'+folder_id).append(li);
            //         });
            //     });
            //
            //
            // });

            $('.folder-list').find('ul#folder'+file_folder_id).addClass('in').parent('.folder-list').addClass('active');
            //$('.folder-list:first').addClass('active').find('ul').addClass('in');

            google.charts.load("current", {packages:['corechart']});
            switch (globalFileType) {
                case 'csv':
                    generateArraysCSV();
                    break;
                case 'xml':
                    generateArraysXML(file_back_name);
                    break;
            }
        });
    });
}
