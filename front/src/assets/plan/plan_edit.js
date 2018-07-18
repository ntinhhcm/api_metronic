var plan_options = {
    apiURL: '',
    token: ''
};

var plan_edit = function() {
    var e_modal_id = 'edit_modal';
    var e_template = '\
        <div id="' + e_modal_id + '" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">\
          <div class="modal-dialog modal-lg" role="document">\
            <div class="modal-content">\
              <div class="modal-header">\
                <h4 class="m-portlet__head-text"><i class="flaticon-edit"></i> Plan edit </h4>\
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
                  <span aria-hidden="true">\
                    &times;\
                  </span>\
                </button>\
              </div>\
              <div class="modal-body" style="padding-top:15px;">\
                    <div class="container">\
                         <div class="form-group m-form__group row">\
                            <label for="example-search-input" class="col-2 col-form-label ">\
                               Full name\
                            </label>\
                            <div class="plan col-8 m-input-icon m-input-icon--left">\
                                <input size="10" class="form-control" type="text" name="member_name" disabled="" value="" >\
                                <span class="m-input-icon__icon m-input-icon__icon--left">\
                                    <span>\
                                        <i class="flaticon-avatar"></i>\
                                    </span>\
                                </span>\
                            </div>\
                        </div>\
                        <div class="form-group m-form__group row">\
                            <label for="example-search-input" class="col-2 col-form-label">\
                                BadgeID\
                            </label>\
                            <div class="plan col-8 m-input-icon m-input-icon--left">\
                                <input size="10" class="form-control" type="text" name="badge_id" disabled="" value="" >\
                                <span class="m-input-icon__icon m-input-icon__icon--left">\
                                    <span>\
                                        <i class="la la-barcode"></i>\
                                    </span>\
                                </span>\
                            </div>\
                        </div>\
                        <div class="form-group m-form__group row">\
                            <label for="example-search-input" class="col-2 col-form-label">\
                                Year\
                            </label>\
                            <div class="plan col-8 m-input-icon m-input-icon--left">\
                                <input size="10" class="form-control" type="text" name="year" disabled="" value="" >\
                                <span class="m-input-icon__icon m-input-icon__icon--left">\
                                    <span>\
                                        <i class="flaticon-calendar"></i>\
                                    </span>\
                                </span>\
                            </div>\
                        </div>\
                    </div>\
            <form autocomplete="off">\
                <table style="text-align:center;" class="table table-striped table-hover table-responsive-xl">\
                  <thead class="thead-light m-table--head-bg-success">\
                    <tr>\
                      <th scope="col" colspan="2">MW</th>\
                      <th scope="col"> 1<br />\
                        C-<button type="button" class="btn btn-outline-success cc-fast-input" data="cc-1">0</button>\
                        A-<button type="button" class="btn btn-outline-success ac-fast-input" data="ac-1">0</button>\
                      </th>\
                      <th scope="col"> 2<br />\
                        C-<button type="button" class="btn btn-outline-success cc-fast-input" data="cc-2">0</button>\
                        A-<button type="button" class="btn btn-outline-success ac-fast-input" data="ac-2">0</button>\
                      </th>\
                      <th scope="col"> 3<br />\
                        C-<button type="button" class="btn btn-outline-success cc-fast-input" data="cc-3">0</button>\
                        A-<button type="button" class="btn btn-outline-success ac-fast-input" data="ac-3">0</button>\
                      </th>\
                      <th scope="col"> 4<br />\
                        C-<button type="button" class="btn btn-outline-success cc-fast-input" data="cc-4">0</button>\
                        A-<button type="button" class="btn btn-outline-success ac-fast-input" data="ac-4">0</button>\
                      </th>\
                    </tr>\
                  </thead>\
                  <tbody class="month">\
                  </tbody>\
                </table>\
            </div>\
            <div class="modal-footer">\
              <button type="button" class="btn btn-secondary" data-dismiss="modal"  >\
                Close\
              </button>\
              <button type="button" class="btn btn-primary submit" >\
                Save\
              </button>\
            </div>\
          </form>\
          <input type="hidden" id="memberID" value="" />\
          </div>\
        </div>\
    ';

    var d_modal_id = 'delete_confirm';
    var d_template = '\
        <div class="modal fade" id="' + d_modal_id + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">\
            <div class="modal-dialog" role="document">\
                <div class="modal-content">\
                    <div class="modal-header">\
                        <h5 class="modal-title" id="exampleModalLabel">\
                            Delete confirm\
                        </h5>\
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
                            <span aria-hidden="true">\
                                &times;\
                            </span>\
                        </button>\
                    </div>\
                    <div class="modal-body">\
                        <p>\
                            Do you realy want to delete this plan?\
                        </p>\
                    </div>\
                    <div class="modal-footer">\
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">\
                            No\
                        </button>\
                        <button type="button" class="btn btn-primary">\
                            Yes\
                        </button>\
                    </div>\
                    <input type="hidden" id="d_member_id" value="" />\
                </div>\
            </div>\
        </div>\
    ';

    var e_group_radio = function(type, name) {
        // Define value for radio
        var options = {
            credit: [0, 1, 2, 3, 4, 5],
            assign: [-1, 0, 0.5, 1, 1.5, 2]
        }

        define_v = options[type];

        var group_radio = $('<div/>');
        group_radio.attr('class', 'btn-group btn-group-toggle').attr('data-toggle', 'buttons');

        var label = $('<label/>');
        label.attr('class', 'btn btn-secondary');
        label.append(type[0].toLocaleUpperCase());
        label.appendTo(group_radio);

        $.each(define_v, function(index, value) {
            // Define label
            var label = $('<label/>');
            label.attr('class', 'btn btn-outline-info');
            label.append(value);
            // Define radio
            var input = $('<input/>');
            input.attr('type', 'radio').attr('name', name).val(value);
            // Append radio to group
            input.appendTo(label);
            label.appendTo(group_radio);
        });
        return group_radio;
    }

    var e_form_reset = function() {
        var radio_group = $('form div.btn-group');
        $.each(radio_group, function(index, item) {
            // Remove active class
            $(this).find('label').removeClass('active');
            var radio = $(this).find('input[type="radio"][value="0"]');
            // Checked radio
            radio.prop('checked', true);
            // Set active for label of radio
            var label = radio.parent();
            label.addClass('active');
            // Set hidden value for group
            var hidden = $(this).find('input[type="hidden"][name^="credit-"], input[type="hidden"][name^="assign-"]');
            hidden.val(radio.val());
        });
    }

    var e_form_radio_update = function(input_name, value) {
        var hidden = $('#' + e_modal_id + ' form input[name="' + input_name + '"]');
        // Set value to hidden
        hidden.val(value);

        var parent = hidden.parent();
        // Remove active class from  label
        parent.find('label').removeClass('active');
        var radio = parent.find('input[type="radio"][value="' + value + '"]');
        if (radio.length > 0) {
            // Active item found
            radio.parent().addClass('active');
            radio.prop('checked', true);
        }
    }

    var e_form_hidden_update = function(input_name, value) {
        var hidden = $('#' + e_modal_id + ' form input[name="' + input_name + '"]');
        hidden.val(value);
    }

    var node_modal_id = 'add_plan_detail';
    var node_template = '\
            <div class="modal fade" id="' + node_modal_id + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="false">\
            <span data-toggle="modal" data-target="#exampleModal">+__template(row, 1)+</span>\
                <div class="modal-dialog" role="document"><div class="modal-content">\
                    <div class="modal-header">\
                            <h5 class="modal-title text-center" id="test2">Project</h5>\
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
                                <span aria-hidden="true" class="la la-remove"></span>\
                            </button>\
                        </div>\
                    <div class="modal-body">\
                        <form class="m-form m-form--fit">\
                            <div class="form-group row">\
                                <div class="col-lg-12">\
                                    <select id="select_project" name="select_project" class="form-control js-example-basic-multiple" multiple="multiple" >\
                                        <option value=""></option>\
                                    </select>\
                                </div>\
                            </div>\
                            <input type="hidden" id="p_member_id" name="p_member_id" value="" />\
                            <input type="hidden" id="p_year" name="p_year" value="" />\
                            <input type="hidden" id="p_month" name="p_month" value="" />\
                            <input type="hidden" id="p_week" name="p_week" value="" />\
                            <input type="hidden" id="p_type" name="p_type" value="" />\
                        </form>\
                    </div>\
                    <div class="modal-footer">\
                        <button class="btn btn-secondary" data-dismiss="modal">Close</button>\
                        <button id="btn_add_confirm" type="button" class="btn btn-primary">Save</button>\
                    </div>\
                </div>\
            </div>\
        </div>\
        ';
    var addBody = function() {
        // Remove modal before create new
        $('#' + e_modal_id).remove();
        $('#' + d_modal_id).remove();
        $('#' + node_modal_id).remove();
        $('body').append(e_template);

        // Append body to edit form
        for (var m = 1; m <= 12; m++) {
            var tr = $('<tr></tr>');
            $('<th style="vertical-align: middle;" scope="row">' + m + '</th>').appendTo(tr);
            var td = $('<td/>');
            $('<button type="button" class="btn btn-outline-success cr-fast-input" data="cr-' + m + '">0</button>').appendTo(td);
            $('<button type="button" class="btn btn-outline-success ar-fast-input" data="ar-' + m + '">0</button>').appendTo(td);
            td.appendTo(tr);
            for (var w = 1; w <= 4; w++) {
                // Group radio for credit
                var td = $('<td/>');
                var group = e_group_radio('credit', 'credit_radio-' + m + '-' + w);
                $('<input/>').attr('type', 'hidden').attr('name', 'credit-' + m + '-' + w).appendTo(group);
                $('<input/>').attr('type', 'hidden').attr('name', 'pcredit-' + m + '-' + w).appendTo(group);
                group.appendTo(td);
                // Group radio for assign
                group = e_group_radio('assign', 'assign_radio-' + m + '-' + w);
                $('<input/>').attr('type', 'hidden').attr('name', 'assign-' + m + '-' + w).appendTo(group);
                $('<input/>').attr('type', 'hidden').attr('name', 'passign-' + m + '-' + w).appendTo(group);
                group.appendTo(td);
                td.appendTo(tr);
            }
            tr.appendTo('#' + e_modal_id + ' table tbody');
        }
        $('body').append(d_template);
        $('body').append(node_template);
    }

    var error_handle = function(jqXHR, object_name = '') {
        if (typeof jqXHR.responseJSON != 'undefined') {
            _error_code = jqXHR.responseJSON.error_code;
            _error_message = jqXHR.responseJSON.message;
            if (_error_code == 4) {
                switch (object_name) {
                    case e_modal_id:
                        form = $('#' + e_modal_id + ' form');
                        member_name = $('#' + e_modal_id  + ' input[name="member_name"]').val();
                        badge_id = $('#' + e_modal_id  + ' input[name="badge_id"]').val();
                        year = $('#' + e_modal_id  + ' input[name="year"]').val();
                        values = form.find('input[name^="assign-"], input[name^="credit-"]').serializeArray();
                        pvalues = form.find('input[name^="passign-"], input[name^="pcredit-"]').serializeArray();

                        localStorage.removeItem(e_modal_id);
                        localStorage.setItem(e_modal_id, JSON.stringify({member_name: member_name, badge_id: badge_id, year: year, values: values, pvalues: pvalues}));
                        break;
                    default:
                }
                location.reload();
            }
        }
    }

    var Plugin = {
        init: function(apiURL, token) {
            plan_options.apiURL = apiURL;
            plan_options.token = token;
            addBody();
            Plugin.getproject();
        },
        edit: function(memberID, v_member_name, v_badge_id) {
            e_form_reset();
            $('#' + e_modal_id + ' input[name="member_name"]').val(v_member_name);
            $('#' + e_modal_id + ' input[name="badge_id"]').val(v_badge_id);
            _year = $('input[name="_year"]').val();
            if(_year) {
                $('#' + e_modal_id + ' input[name="year"]').val(_year);
            }

            $.ajax({
                url: plan_options.apiURL + '/' + memberID + '/edit',
                headers: { 'Authorization': plan_options.token },
                method: 'GET',
                data: {year: _year}
            }).done(function(results) {
              if (results.total_items > 0) {
                var form = $('#' + e_modal_id + ' form');
                var plans = results.items;

                // Add data to form
                $.each(plans, function(index, plan) {
                    if (plan.value != '') {
                        e_form_radio_update('credit-' + plan.month + '-' + plan.week , plan.value);
                    }
                    if (plan.value2 != '') {
                        e_form_radio_update('assign-' + plan.month + '-' + plan.week, plan.value2);
                    }
                    e_form_hidden_update('pcredit-' + plan.month + '-' + plan.week , plan.credit_project);
                    e_form_hidden_update('passign-' + plan.month + '-' + plan.week , plan.assign_project);
                });
              }
              $('#' + e_modal_id + ' #memberID').val(memberID);
               // Open modal
              $('#' + e_modal_id).modal();
            }).fail(function(jqXHR, textStatus) {
                error_handle(jqXHR);
            });
        },
        edit_submit: function() {
            var form = $('#' + e_modal_id + ' form');
            var items = form.find('input[type="hidden"][name^="credit"], input[type="hidden"][name^="assign"]');
            var pitems = form.find('input[type="hidden"][name^="pcredit"], input[type="hidden"][name^="passign"]');
            memberID = $('#' + e_modal_id + ' #memberID').val();
            year = $('#' + e_modal_id + ' input[name="year"]').val();

            var weeks = {
                count: 0,
                week: 0,
                assign: 0,
                credit: 0,
                assign_project: '',
                credit_project: ''
            };

            var months = {
                count: 0,
                month: 0,
                weeks: []
            };

            var plans = [];
            var item = 0;
            $.each(items, function(index, input) {
                var name = input.name.split('-');
                type = name[0];
                month_num = name[1];
                week_num = name[2];
                value = input.value;

                // Add week
                if (item % 2 == 0) {
                    if (weeks.count > 0) {
                        months.weeks.push(weeks);
                        months.count++;
                    }
                    weeks = {
                        count: 0,
                        week: 0,
                        assign: 0,
                        credit: 0
                    };
                    weeks.week = week_num;
                }

                // Add month
                if (item % 8 == 0) {
                    if (months.count > 0) {
                        plans.push(months);
                    }
                    months = {
                        count: 0,
                        month: 0,
                        weeks: []
                    };
                    months.month = month_num;
                }

                // Add item to week
                if (value.length > 0) {
                    if (type == 'assign') {
                        weeks.assign = value;
                        weeks.assign_project = pitems[index].value;
                    }
                    if (type == 'credit') {
                        weeks.credit = value;
                        weeks.credit_project = pitems[index].value;
                    }
                    weeks.count++;
                }

                if (item == 95) {
                    if (weeks.count > 0) {
                        months.weeks.push(weeks);
                        plans.push(months);
                    }
                }

                item++;
            });

            $.ajax({
                url: plan_options.apiURL + '/' + memberID + '/edit',
                headers: { 'Authorization': plan_options.token },
                method: 'POST',
                data: {plan: plans, member_id: memberID, year: year}
            }).done(function(results) {
                // Close modal
                datatable.reload();
                $('#' + e_modal_id).modal('toggle');
            }).fail(function(jqXHR, textStatus) {
                error_handle(jqXHR, e_modal_id);
            });
        },
        edit_expired: function() {
            form_items = JSON.parse(localStorage.getItem(e_modal_id));
            form_items_values = form_items.values;
            form_items_pvalues = form_items.pvalues;

            // Set item value  to form
            $('#' + e_modal_id  + ' input[name="member_name"]').val(form_items.member_name);
            $('#' + e_modal_id  + ' input[name="badge_id"]').val(form_items.badge_id);
            $('#' + e_modal_id  + ' input[name="year"]').val(form_items.year);

            $.each(form_items_values, function(index, item) {
                e_form_radio_update(item.name, item.value);
                e_form_hidden_update(form_items_pvalues[index].name, form_items_pvalues[index].value);
            });
            localStorage.removeItem(e_modal_id);
            $('#' + e_modal_id).modal();
        },
        delete: function(memberID) {
            $('#d_member_id').val(memberID);
            $('#' + d_modal_id).modal();
        },
        delete_submit: function() {
            var memberID = $('#d_member_id').val();
            var year = $('input[name="_year"]').val();
            $.ajax({
                url: plan_options.apiURL + '/' + memberID + '/delete',
                headers: { 'Authorization': plan_options.token },
                method: 'POST',
                data: {member_id: memberID, year: year}
            }).done(function(results) {
                // Close modal
                datatable.reload();
                $('#' + d_modal_id).modal('toggle');
            }).fail(function(jqXHR, textStatus) {
                error_handle(jqXHR);
            });
        },

        init_event: function() {
            // Edit modal
            // Submit form for edit modal
            $('#' + e_modal_id + ' button.submit').on('click', function() {
                Plugin.edit_submit();
            });
            // On click radio button
/*            $('#' + e_modal_id + ' input[type="radio"]').on('click', function() {
                var parent = $(this).parent().parent();
                var hidden = parent.find('input[type="hidden"][name^="assign-"], input[type="hidden"][name^="credit-"]');
                hidden.val($(this).val());
            });*/
            $('#' + e_modal_id + ' form label').on('click', function() {
                var parent = $(this).parent();
                var radio = $(this).find('[type="radio"]');
                if (radio.length > 0) {
                    radio.prop('checked', true);
                    var hidden = parent.find('input[type="hidden"][name^="assign-"], input[type="hidden"][name^="credit-"]');
                    hidden.val(radio.val());
                }
            });
            $('#' + e_modal_id + ' button[class$="-fast-input"]').click(function() {

                var value = $(this).text();
                var data = $(this).attr('data').split('-');

                var access_name = 'credit-';
                var radio_group;
                var formular = 1;
                if (data[0] == 'ar' || data[0] == 'cr') {
                    parent_index = $(this).parent().parent().index() + 1;
                    if (data[0] == 'ar') {
                        access_name = 'assign-';
                        formular = -1;
                    }
                    radio_group = $('#' + e_modal_id + ' table tbody tr:nth-child(' + parent_index + ') td div.btn-group input[type="hidden"][name^="' + access_name + '"]');
                } else {
                    parent_index = $(this).parent().index() + 2;
                    if (data[0] == 'ac') {
                        access_name = 'assign-';
                        formular = -1;
                    }
                    radio_group = $('#' + e_modal_id + ' table tbody tr td:nth-child(' + parent_index + ') div.btn-group input[type="hidden"][name^="' + access_name + '"]');
                }
                $.each(radio_group, function(index, item) {
                    radio_name = $(this).attr('name');
                    e_form_radio_update(radio_name , value);
                });

                value = parseInt(value) * -1 + formular;
                $(this).text(value);

            });
            // Delete modal
            // Submit form for delete modal
            $('div#' + d_modal_id + ' button.btn-primary').on('click', function() {
                Plugin.delete_submit();
            });

            $('#' + node_modal_id + ' #btn_add_confirm').on('click', function() {
                 Plugin.plan_detail_submit();
            });
            $('#' + node_modal_id).on('hidden.bs.modal', function() {
                $(this).find('select#select_project').val('');
            });

        },

        getproject: function(){
            var projects = '';
            $.ajax({
                url: plan_options.apiURL +'/project',
                headers: { 'Authorization': plan_options.token },
                method: 'GET',
            }).done(function(results) {
                if(results.total_items > 0) {
                    projects = results.items;
                    $('#select_project').empty()
                    $.each(projects, function(index, project) {
                        if(project != '') {
                            $('#select_project').append($('<option>', {
                                value: project.project_name,
                                text: project.project_name
                            }));
                        }
                    });
                }
                //open form add
            }).fail(function(jqXHR, textStatus) {
                error_handle(jqXHR);
            });
        },

        call_modal_add: function(member_id, valcolumn, type) {
            var colum = valcolumn.split('value_');
            var value = colum[1];
            year = $('input[name="_year"]').val();
            // Determime week and month from week of year
            month = parseInt(value / 4) == 0 ? 1 : Math.ceil(value /4);
            week = value % 4 != 0 ? value % 4 : 4;
            // Set init value to hidden field
            $('#' + node_modal_id + ' input[name="p_year"]').val(year);
            $('#' + node_modal_id + ' input[name="p_month"]').val(month);
            $('#' + node_modal_id + ' input[name="p_week"]').val(week);
            $('#' + node_modal_id + ' input[name="p_member_id"]').val(member_id);
            $('#' + node_modal_id + ' input[name="p_type"]').val(type);
            $('.js-example-basic-multiple').css("width", "400px");
            $(".js-example-basic-multiple").select2();
            // Show modal
            $('#' + node_modal_id).modal();
        },

        plan_detail_submit: function() {
            var data = $('#' + node_modal_id + ' form').serializeArray();
            var params = {};
            var select_value = [];
            $.each(data, function(index, item) {
                name = item.name;
                value = item.value;
                if (name == 'select_project') {
                    select_value.push(value);
                } else {
                    params[name] = value;
                }
            });
            params['select_project'] = select_value;

            $.ajax({
                url: plan_options.apiURL + '/' + memberID + '/update',
                headers: {'Authorization': plan_options.token },
                method: 'POST',
                data: params
            }).done(function(results) {
                $('#' + node_modal_id + ' select#select_project').val();
                $('#' + node_modal_id).modal('toggle');
                datatable.reload();
            }).fail(function(jqXHR, textStatus) {
                error_handle(jqXHR);
            });
        }
    }

    return {
        init: function(apiURL, token) {
            Plugin.init(apiURL, token);
            Plugin.init_event();
        },
        edit: function(id, year, v_member_name, v_badge_id) {
            Plugin.edit(id, year, v_member_name, v_badge_id);
        },
        delete: function(id) {
            Plugin.delete(id);
        },
        call_modal_add: function(member_id, valcolumn, type) {
            Plugin.call_modal_add(member_id, valcolumn, type) ;
        },
        edit_after_expired: function() {
            Plugin.edit_expired();
        },
        get_edit_modal_name: function() {
            return e_modal_id;
        }
    };
}();

function initEditPlan(apiURL, token) {
    plan_edit.init(apiURL + '/plan', token);
}

//== Initialization
jQuery(document).ready(function() {
    if (localStorage.getItem(plan_edit.get_edit_modal_name())) {
        plan_edit.edit_after_expired();
    }
});