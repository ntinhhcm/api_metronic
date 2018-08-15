var setting = function() {
    var options = {
        apiUrl: '',
        token: ''
    }
    var on_click_make_plan = function() {
        $('.make-plan').click(function() {
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

    var message = function(type, message) {
        swal({
            type: type,
            title: message,
            showConfirmButton: false,
        });
    }

    var on_click_calculate = function() {
        $('a[class*=cal-]').click(function(event) {
            var type = 'year';
            if ($(this).attr('class').search('cal-week') != -1) {
                type = 'week';
            } else if($(this).attr('class').search('cal-month') != -1) {
                type = 'month'
            }
            $.ajax({
                url: options.apiUrl + '/plan/calculate',
                headers: { 'Authorization': options.token },
                method: 'POST',
                data: {type: type},
                async: true
            }).done(function(results) {
                if (results.success) {
                    message('success', 'Calculate done!');
                } else {
                    message('error', 'Calculate fail!');
                }
            }).fail(function(error) {
                message('error', 'Sorry! Please try again or contact to administrator!');
            });
        });
    }
    

    return {
        init: function(apiUrl, token) {
            options.apiUrl = apiUrl;
            options.token = token;
            on_click_make_plan();
            on_click_calculate();
        }
    }
}();

function setting_init(apiUrl, token) {
    setting.init(apiUrl, token);
}