var dashboard = function() {
	var backup_mem = function(data, meta) {
        var chart = AmCharts.makeChart("m_amcharts_1", {
            "type": "serial",
            "theme": "light",
            "precision": 2,
            "valueAxes": [{
                "id": "v1",
                "title": "Quantity (person)",
                "position": "left",
                "autoGridCount": false,
                'gridCount': 10,
                'maximum': meta.max_quantity,
                'minimum': 0
            }, {
                "id": "v2",
                "title": "Backup (%)",
                "gridAlpha": 0,
                "position": "right",
                "autoGridCount": false,
                "autoGridCount": false,
                'gridCount': 10,
                'maximum': meta.max_backup,
                'minimum': 0
            }],
            "graphs": [{
                "id": "g3",
                "valueAxis": "v1",
                "lineColor": "#ff9e0166",
                "fillColors": "#ff9e0166",
                "fillAlphas": 1,
                "type": "column",
                "title": "Quantity " + meta.c_year,
                "valueField": "quantity2",
                "clustered": false,
                "columnWidth": 0.5,
                "legendValueText": "[[value]] persons",
                "balloonText": "[[title]]<br /><b style='font-size: 130%'>[[value]] persons</b>"
            }, {
                "id": "g4",
                "valueAxis": "v1",
                "lineColor": "#b0de09",
                "fillColors": "#b0de09",
                "fillAlphas": 1,
                "type": "column",
                "title": "Quantity " + meta.year,
                "valueField": "quantity1",
                "clustered": false,
                "columnWidth": 0.3,
                "legendValueText": "[[value]] persons",
                "balloonText": "[[title]]<br /><b style='font-size: 130%'>[[value]] persons</b>"
            }, {
                "id": "g1",
                "valueAxis": "v2",
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "bulletSize": 5,
                "hideBulletsCount": 50,
                "lineThickness": 2,
                "lineColor": "#20acd4",
                "type": "smoothedLine",
                "title": "Backup assign " + meta.year,
                "useLineColorForBulletBorder": true,
                "valueField": "backup1",
                "balloonText": "[[title]]<br /><b style='font-size: 130%'>[[value]] %</b>"
            }, {
                "id": "g2",
                "valueAxis": "v2",
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "bulletSize": 5,
                "hideBulletsCount": 50,
                "lineThickness": 2,
                "lineColor": "#ff0f0078",
                "type": "smoothedLine",
                "dashLength": 5,
                "title": "Backup assign " + meta.c_year,
                "useLineColorForBulletBorder": true,
                "valueField": "backup2",
                "balloonText": "[[title]]<br /><b style='font-size: 130%'>[[value]] %</b>"
            }],
            "chartScrollbar": {
                "graph": "g1",
                "oppositeAxis": false,
                "offset": 30,
                "scrollbarHeight": 50,
                "backgroundAlpha": 0,
                "selectedBackgroundAlpha": 0.1,
                "selectedBackgroundColor": "#888888",
                "graphFillAlpha": 0,
                "graphLineAlpha": 0.5,
                "selectedGraphFillAlpha": 0,
                "selectedGraphLineAlpha": 1,
                "autoGridCount": true,
                "color": "#AAAAAA"
            },
            "chartCursor": {
                "pan": true,
                "valueLineEnabled": true,
                "valueLineBalloonEnabled": true,
                "cursorAlpha": 0,
                "valueLineAlpha": 0.2
            },
                "categoryField": meta.type,
                "categoryAxis": {
                "dashLength": 1,
                "minorGridEnabled": true
            },
            "legend": {
                "useGraphSettings": true,
                "position": "top"
            },
            "balloon": {
                "borderThickness": 1,
                "shadowAlpha": 0
            },
            "export": {
                "enabled": true,
                "menu": [{
                    "label": "Export",
                    "class": "export-main",
                    "menu": [{
                        "label": "Download as image",
                        "menu": ["PNG","JPG", "SVG"]
                    }, {
                        "label": "Download as data",
                        "menu": ["CSV", "XLSX"]
                    }]
                }]
            },
            "dataProvider": data
        });
    }

    var touchspin = function() {
        var month = $("input[name='month'], input[name='c_month']").TouchSpin({
                min: 1,
                max: 12,
                stepinterval: 1,
                maxboostedstep: 12,
                prefix: ''
            });
        var year = $("input[name='year'], input[name='c_year']").TouchSpin({
                min: 2010,
                max: 2050,
                stepinterval: 1,
                maxboostedstep: 50,
                prefix: ''
            });
    }

    return {
        init: function(data, meta) {
            backup_mem(data, meta);
            touchspin();
        }
    }
}();

function initchart(data, meta) {
    dashboard.init(data, meta);
}