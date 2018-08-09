$(document).ready(function() {
    var selector = '#translate';
    $(selector).on('click', function(e){
        e.preventDefault();
        showhideLangPreloader('show');
        startLang( $(this) );
    });

    var startLang = function(el){
        var el = $(el);
        var text = el.attr('data-text');
        var file = el.attr('data-file');
        var page = el.attr('data-page');
        file = file.split(',');
        text = text.split(',');
        var index = el.attr('data-index');
        if(index >= file.length){
            index = 0;
        }
        changeName(el, text[index]);
        changeIndex(el, index);
        loadLang(file[index], page);
        $('html').attr('lang', file[index]);
    };

    var changeName = function(el, name){
        $(el).html( name );
    };

    var changeIndex = function(el, index){
        $(el).attr('data-index', ++index);
    };

    function showhideLangPreloader(opc) {
        switch (opc) {
            case 'show':
                $('#langPreloader').fadeIn('slow');
                $('#wrapper').addClass('blur');
                break;
            case 'hide':
                $('#langPreloader').fadeOut('slow');
                $('#wrapper').removeClass('blur');
                break;
        }

    };

    var loadLang = function(lang, page){
        var path, src, errorMessage;
        switch (page) {
            case 'home':
                path = 'main/'+lang+'.txt';
                src = 'js/main/'+lang+'.js';
                break;
            case 'stats':
                path = 'stats/'+lang+'.txt';
                break;
        }

        switch (lang) {
            case 'en':
                for(var i in enObject) {
                    //this data are in respective file translate.js of the view
                    translate[i] = enObject[i];
                }
                $('.date-format-en').show();
                $('.date-format-es').hide();
                errorMessage = 'Error loading the translation';
                $('#preLoaderLangMSG').text('Loading the translation');
                break;
            case 'es':
                for(var i in esObject) {
                    translate[i] = esObject[i];
                }
                $('.date-format-en').hide();
                $('.date-format-es').show();
                errorMessage = 'Error al cargar traducción';
                $('#preLoaderLangMSG').text('Cargando traducción');
                break;

        }

        var data = {'_token': CSRF_TOKEN, 'lang': lang};
        $.post('updateLang', data, function(response) {
            if(response.status == 'success'){
                var url = public_path + 'translate/' + path;
                $.ajax({
                    url: url,
                    error:function(){
                       alert(errorMessage);
                    },
                    success: function(data){
                       processLang(data);
                       setTimeout(function(){
                           showhideLangPreloader('hide');
                       }, 2000);
                    }
                });
            }
            if(response.status == 'error'){
                alert(errorMessage);
            }
        });

        var processLang = function(data){
           var arr = data.split('\n');
           for(var i in arr){
             if( lineValid(arr[i]) ){
               var obj = arr[i].split('=>');
               assignText(obj[0], obj[1]);
             }
           }
        };
        var lineValid = function(line){
          return (line.trim().length > 0);
        };

        var assignText = function(key, value){
          $('[data-lang="'+key+'"]').each(function(){
            var attr = $(this).attr('data-destine');
            if(typeof attr !== 'undefined'){
              $(this).attr(attr, value);
            }else{
              $(this).html(value);
            }
          });
        };

    };
});
