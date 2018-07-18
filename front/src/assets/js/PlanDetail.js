var createTable = {
    init: function(data) {
        $("#plan_list").mDatatable({
             data: {
                type: "local", source: data, pageSize: 10
            },
            layout: {
                theme: 'default',
                class: '',
                scroll: false,
                footer: false // display/hide footer
            },
            pagination: true,

        });
    },
    header: function() {
        html_tr = '<thead>';
        html_tr += '<tr>';
        html_tr += '<th colspan="2"></th>';
        html_tr += '<th colspan="2"></th>';
        for (var i = 1; i <=12 ; i++) {
           html_tr += '<th colspan="4">' + i + '</th>';
        }
        html_tr += '</tr>';
        html_tr += '<tr>';
        html_tr += '<th>BadgeID</th>';
        html_tr += '<th >Name</th>';
        for( var i = 1; i <= 48; i++) {
            html_tr += '<th>' + i + '</th>';   
        }    
        html_tr += '</tr>';
        html_tr += '</thead>';
        $(html_tr).appendTo('#plan_list');
    },
    body: function(data) {
        data= JSON.parse(data);
        html_tr = '<tbody>';
        for (var i = 0; i < data.length; i++) {
            html_tr += '<tr>';
            html_tr += '<td >' + data[i].badge_id + '</td>';
            html_tr += '<td >' + data[i].member_name + '</td>';
            for(var j = 0; j <48; j++) {
                html_tr += '<td >' +'i'+'</td>';
            }
            html_tr += '</tr>';
            html_tr += '<tr>';
            html_tr += '<td colspan="2"></td>';
            for(var j = 0; j <48; j++) {
                html_tr += '<td >' +'i'+'</td>';
                
            }
            html_tr += '</tr>';
        }
        html_tr += '</tbody>';
        $(html_tr).appendTo('#plan_list');
    }
}

function PlanDetail(data) {
    createTable.header();
    createTable.body(data);
    createTable.init(data);
};
