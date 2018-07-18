var dashboard = function() {
	var backup_mem = function(type, data) {
        var chart = AmCharts.makeChart("m_amcharts_1", {
            "type": "serial",
            "hideCredits": true,
            "theme": "light",
            "dataProvider": data,
            "valueAxes": [{
                "gridColor": "#FFFFFF",
                "gridAlpha": 0.2,
                "dashLength": 0
            }],
            "gridAboveGraphs": true,
            "startDuration": 1,
            "graphs": [{
                "balloonText": type + " [[category]]: <b>[[value]]%</b>",
                "fillAlphas": 0.8,
                "lineAlpha": 0.2,
                "type": "column",
                "valueField": "assign"
            }],
            "valueAxes": [{
                'id': "ValueAxis-1",
                'autoGridCount': false,
                'gridCount': 20,
                'maximum': 200,
                'minimum': 0,
                "title": "%"
            }],
            "chartCursor": {
                "categoryBalloonEnabled": false,
                "cursorAlpha": 0,
                "zoomable": false
            },
            "categoryField": type,
            "categoryAxis": {
                "gridPosition": "start",
                "gridAlpha": 0,
                "tickPosition": "start",
                "tickLength": 20
            },
            "export": {
                "enabled": false
            }
        });
    }

    var touchspin = function() {
        var month = $("input[name='month']").TouchSpin({
                min: 1,
                max: 12,
                stepinterval: 1,
                maxboostedstep: 12,
                prefix: ''
            });
        var year = $("input[name='year']").TouchSpin({
                min: 2018,
                max: 2050,
                stepinterval: 1,
                maxboostedstep: 50,
                prefix: ''
            });
    }

    return {
    	init: function(type, data) {
    		backup_mem(type, data);
            touchspin();
    	}
    }
}();

function initchart(type, data) {
	dashboard.init(type, data);
}