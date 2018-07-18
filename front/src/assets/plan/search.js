var search_form = function() {
    var options = {
        apiURL: '',
        token: ''
    }

    var badge_id = function() {
        $('#search_form input[name="badge_id"]').tagsinput();
    }

    var project_name = function() {
        $.ajax({
            url: options.apiURL +'/project',
            headers: { 'Authorization': options.token },
            method: 'GET',
        }).done(function(results) {
            if (results.total_items > 0) {
                var projects = new Bloodhound({
                    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    local: $.map(results.items, function(item) {
                        return {
                            value: item.project_name
                        };
                    })
                });
                projects.initialize();
                $('#search_form input[name="project"]').tagsinput({
                    typeaheadjs: [{
                        minLength: 1,
                        highlight: true
                    },{
                        name: 'projects',
                        displayKey: 'value',
                        valueKey: 'value',
                        source: projects.ttAdapter()
                    }],
                    freeInput: true
                });
            } else {
                $('#search_form input[name="project"]').tagsinput();
            }
            //open form add
        }).fail(function(jqXHR, textStatus) {
            location.reload();
        });
    }

    var member_email = function() {
        $('#search_form input[name="member_email"]').tagsinput();
    }

    var plan_year = function() {
        var year = $("#search_form input[name='plan_year']").TouchSpin({
                min: 2018,
                max: 2050,
                stepinterval: 1,
                maxboostedstep: 50,
                prefix: ''
            });
        $('#plan_year').val((new Date).getFullYear());
    };

    return {
        init: function(url, token) {
            badge_id();
            project_name();
            member_email();
            plan_year();
        },
        reset: function() {
            $('#search_form input[data-role="tagsinput"]').tagsinput('removeAll');
            $('#search_form input[name="plan_year"]').val((new Date).getFullYear());
        },
        setOptions: function(url, token) {
            options.apiURL = url;
            options.token = token;
        }
    }
}();


function initSearch(url, token) {
    search_form.setOptions(url, token);
    search_form.init();
    $('#search_form button#m_reset').on('click', function() {
        search_form.reset();
    });
}

//== Initialization
jQuery(document).ready(function() {
});