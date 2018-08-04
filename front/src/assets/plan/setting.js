var setting = function() {
    var options = {
        apiUrl: '',
        token: ''
    }
    var on_click_make_plan = function() {
        $('.make-plan').click(function() {
            console.log(`make plan`);
            $.ajax({
                url: options.apiUrl + '/plan/generate',
                headers: { 'Authorization': options.token },
                method: 'POST',
                async: true,
                xhr: function () {
                    var xhr = new window.XMLHttpRequest();
                    //Upload Progress
                    xhr.addEventListener('progress', function (evt) {
                        if (evt.lengthComputable) {
                            var percentComplete = (evt.loaded / evt.total) *100;
                            $('div.progress > div.progress-bar').html(percentComplete + '%');
                            $('div.progress > div.progress-bar').css({ 'width': percentComplete + '%' }); 
                        } 
                    }, false);
                    return xhr;
                }
            }).done(function(results) {
            }).fail(function(error) {
                $('div.progress > div.progress-bar').html('<span class="text-danger">Error</span>');
            });
        });
    }
    

    return {
        init: function(apiUrl, token) {
            options.apiUrl = apiUrl;
            options.token = token;
            on_click_make_plan();
        }
    }
}();

function setting_init(apiUrl, token) {
    setting.init(apiUrl, token);
}