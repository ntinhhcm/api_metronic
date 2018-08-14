var datatable;

//== Class definition
var planMember = function () {
	//== Private functions

	var __template = function(row, index) {
		var credit = row['credit' + index].split('_');
		var assign = row['assign' + index].split('_');
		color_c = credit[0];
		color_a = assign[0];

		credit_ = credit[1];
		assign_ = assign[1];

		project_c = credit[2];
		project_a = assign[2];

		plan_detail_id = credit[3];

		var __template_t_c = '<b>Project: </b>' +  project_c + ' <br/><b>' + credit_ + '</b>';
		var __template_t_a = '<b>Project: </b>' +  project_a + ' <br/><b>' + assign_ + '</b>';

		return '\
			<div class="credit" data-toggle="m-tooltip" title="" data-html="true" data-original-title="' + __template_t_c + '" data-placement="right" data="' + plan_detail_id + '" style="background: ' + color_c + '; width: 30px; height: 30px; border: 1px solid #ffffff;">\
				<input type="hidden" value="' + project_c + '"/>\
			</div>\
			<div class="assign" data-toggle="m-tooltip" title="" data-html="true" data-original-title="' + __template_t_a + '" data-placement="right" data="' + plan_detail_id + '" style="background: ' + color_a + '; width: 30px; height: 30px; border: 1px solid #ffffff;">\
				<input type="hidden" value="' + project_a + '"/>\
			</div>\
		';
	};

	var options = {
		layout: { 
			theme: 'default',
			class: 'm-datatable--brand',
			scroll: true,
			height: 550,
			footer: false
		},

		sortable: true,

		filterable: false,

		pagination: true,

		rows: {
			callback: function() {
				$('.m-datatable__row').children('td').not(":nth-child(1)").css('padding', 0);
				$('.m-datatable__row').children('th').not(":nth-child(1)").css('padding', 0);
				$('.m-datatable__row').children('th').not(":nth-child(1)").css('text-align', 'center');
			},
				// auto hide columns, if rows overflow. work on non locked columns
				//autoHide: false,
		},
		columns: [{
			field: "record_id",
			title: "#",
			locked: {left: 'xl'},
			sortable: false,
			width: 40,
			overflow: 'visible',
		}, {
			field: "badge_id",
			title: "BadgeID",
			locked: {left: 'xl'},
			sortable: true,
			width: 90,
			overflow: 'visible',
		}, {
			field: "member_name",
			width: 200,
			title: "Member name",
			sortable: true,
			locked: {left: 'xl'},
			overflow: 'visible',
		}, {
			field: "Actions",
			width: 80,
			title: "Actions",
			sortable: false,
			locked: {left: 'xl'},
			overflow: 'visible',
			template: function (row, index, datatable) {
				return '\
					<a href="javascript:void(0)" data="' + row.member_id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill edit" title="Edit plan">\
						<i class="la la-edit"></i>\
					</a>\
					<input type="hidden" name="name_member" value="'+ row.member_name + '"/>\
					<input type="hidden" name="badgeid_member" value="'+ row.badge_id + '"/>\
					<a href="javascript:void(0)" data="' + row.member_id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill delete" title="Delete plan">\
						<i class="la la-trash"></i>\
					</a>\
				';
			}
		}, {
			field: "Type",
			width: 50,
			title: "Type",
			sortable: false,
			locked: {left: 'xl'},
			overflow: 'visible',
			template: function(row) {
				return '<div>Credit</div>\
						<div>Assign</div>';
			}
		}, {
			field: "value_1",
			width: 30,
			title: "1",
			sortable: false,
			template: function(row) {
				return __template(row, 1);
			}
		}, {
			field: "value_2",
			width: 30,
			title: "2",
			sortable: false,
			template: function(row) {
				return __template(row, 2);
			}
		}, {
			field: "value_3",
			width: 30,
			title: "3",
			sortable: false,
			template: function(row) {
				return __template(row, 3);
			}
		}, {
			field: "value_4",
			width: 30,
			title: "4",
			sortable: false,
			template: function(row) {
				return __template(row, 4);
			}
		}, {
			field: "value_5",
			width: 30,
			title: "1",
			sortable: false,
			template: function(row) {
				return __template(row, 5);
			}
		}, {
			field: "value_6",
			width: 30,
			title: "2",
			sortable: false,
			template: function(row) {
				return __template(row, 6);
			}
		}, {
			field: "value_7",
			width: 30,
			title: "3",
			sortable: false,
			template: function(row) {
				return __template(row, 7);
			}
		}, {
			field: "value_8",
			width: 30,
			title: "4",
			sortable: false,
			template: function(row) {
				return __template(row, 8);
			}
		}, {
			field: "value_9",
			width: 30,
			title: "1",
			sortable: false,
			template: function(row) {
				return __template(row, 9);
			}
		}, {
			field: "value_10",
			width: 30,
			title: "2",
			sortable: false,
			template: function(row) {
				return __template(row, 10);
			}
		}, {
			field: "value_11",
			width: 30,
			title: "3",
			sortable: false,
			template: function(row) {
				return __template(row, 11);
			}
		}, {
			field: "value_12",
			width: 30,
			title: "4",
			sortable: false,
			template: function(row) {
				return __template(row, 12);
			}
		}, {
			field: "value_13",
			width: 30,
			title: "1",
			sortable: false,
			template: function(row) {
				return __template(row, 13);
			}
		}, {
			field: "value_14",
			width: 30,
			title: "2",
			sortable: false,
			template: function(row) {
				return __template(row, 14);
			}
		}, {
			field: "value_15",
			width: 30,
			title: "3",
			sortable: false,
			template: function(row) {
				return __template(row, 15);
			}
		}, {
			field: "value_16",
			width: 30,
			title: "4",
			sortable: false,
			template: function(row) {
				return __template(row, 16);
			}
		}, {
			field: "value_17",
			width: 30,
			title: "1",
			sortable: false,
			template: function(row) {
				return __template(row, 17);
			}
		}, {
			field: "value_18",
			width: 30,
			title: "2",
			sortable: false,
			template: function(row) {
				return __template(row, 18);
			}
		}, {
			field: "value_19",
			width: 30,
			title: "3",
			sortable: false,
			template: function(row) {
				return __template(row, 19);
			}
		}, {
			field: "value_20",
			width: 30,
			title: "4",
			sortable: false,
			template: function(row) {
				return __template(row, 20);
			}
		}, {
			field: "value_21",
			width: 30,
			title: "1",
			sortable: false,
			template: function(row) {
				return __template(row, 21);
			}
		}, {
			field: "value_22",
			width: 30,
			title: "2",
			sortable: false,
			template: function(row) {
				return __template(row, 22);
			}
		}, {
			field: "value_23",
			width: 30,
			title: "3",
			sortable: false,
			template: function(row) {
				return __template(row, 23);
			}
		}, {
			field: "value_24",
			width: 30,
			title: "4",
			sortable: false,
			template: function(row) {
				return __template(row, 24);
			}
		}, {
			field: "value_25",
			width: 30,
			title: "1",
			sortable: false,
			template: function(row) {
				return __template(row, 25);
			}
		}, {
			field: "value_26",
			width: 30,
			title: "2",
			sortable: false,
			template: function(row) {
				return __template(row, 26);
			}
		}, {
			field: "value_27",
			width: 30,
			title: "3",
			sortable: false,
			template: function(row) {
				return __template(row, 27);
			}
		}, {
			field: "value_28",
			width: 30,
			title: "4",
			sortable: false,
			template: function(row) {
				return __template(row, 28);
			}
		}, {
			field: "value_29",
			width: 30,
			title: "1",
			sortable: false,
			template: function(row) {
				return __template(row, 29);
			}
		}, {
			field: "value_30",
			width: 30,
			title: "2",
			sortable: false,
			template: function(row) {
				return __template(row, 30);
			}
		}, {
			field: "value_31",
			width: 30,
			title: "3",
			sortable: false,
			template: function(row) {
				return __template(row, 31);
			}
		}, {
			field: "value_32",
			width: 30,
			title: "4",
			sortable: false,
			template: function(row) {
				return __template(row, 32);
			}
		}, {
			field: "value_33",
			width: 30,
			title: "1",
			sortable: false,
			template: function(row) {
				return __template(row, 33);
			}
		}, {
			field: "value_34",
			width: 30,
			title: "2",
			sortable: false,
			template: function(row) {
				return __template(row, 34);
			}
		}, {
			field: "value_35",
			width: 30,
			title: "3",
			sortable: false,
			template: function(row) {
				return __template(row, 35);
			}
		}, {
			field: "value_36",
			width: 30,
			title: "4",
			sortable: false,
			template: function(row) {
				return __template(row, 36);
			}
		}, {
			field: "value_37",
			width: 30,
			title: "1",
			sortable: false,
			template: function(row) {
				return __template(row, 37);
			}
		}, {
			field: "value_38",
			width: 30,
			title: "2",
			sortable: false,
			template: function(row) {
				return __template(row, 38);
			}
		}, {
			field: "value_39",
			width: 30,
			title: "3",
			sortable: false,
			template: function(row) {
				return __template(row, 39);
			}
		}, {
			field: "value_40",
			width: 30,
			title: "4",
			sortable: false,
			template: function(row) {
				return __template(row, 40);
			}
		}, {
			field: "value_41",
			width: 30,
			title: "1",
			sortable: false,
			template: function(row) {
				return __template(row, 41);
			}
		}, {
			field: "value_42",
			width: 30,
			title: "2",
			sortable: false,
			template: function(row) {
				return __template(row, 42);
			}
		}, {
			field: "value_43",
			width: 30,
			title: "3",
			sortable: false,
			template: function(row) {
				return __template(row, 43);
			}
		}, {
			field: "value_44",
			width: 30,
			title: "4",
			sortable: false,
			template: function(row) {
				return __template(row, 44);
			}
		}, {
			field: "value_45",
			width: 30,
			title: "1",
			sortable: false,
			template: function(row) {
				return __template(row, 45);
			}
		}, {
			field: "value_46",
			width: 30,
			title: "2",
			sortable: false,
			template: function(row) {
				return __template(row, 46);
			}
		}, {
			field: "value_47",
			width: 30,
			title: "3",
			sortable: false,
			template: function(row) {
				return __template(row, 47);
			}
		}, {
			field: "value_48",
			width: 30,
			title: "4",
			sortable: false,
			template: function(row) {
				return __template(row, 48);
			}
		}
		]
	};

	var plan = function(url, token, search) {
			options.data = {
				type: 'remote',
				source: {
					read: {
						url: url,
						method: 'GET',
						headers: {
							'Authorization': token
						},
						async: false,
						map: function(raw) {
							// Set _year global
							if (typeof raw.meta.year != 'undefined') {
								$('input[name="_year"]').val(raw.meta.year);
							} else {
								$('input[name="_year"]').val((new Date).getFullYear());
							}
							var dataSet = raw;
							if (typeof raw.data !== 'undefined') {
								 dataSet = raw.data;
							}
							return dataSet;
						}
					}
				},

				pageSize: 10,
				serverPaging: true,
				serverFiltering: true,
				serverSorting: true
			};

			options.extraHeadTitle = {
				template: function() {
					tr = $('<tr></tr>');
					for (ci = 0; ci < 5; ci++) {
						left = $('<th></th>');
						left.data(options.columns[ci]);
						left.appendTo(tr);
					}
					for (i = 1; i <= 12; i++) {
						th = $('<th colspan="4">' + i + '</th>');
						th.data({width: 120});
						th.appendTo(tr);
					}
					return tr[0];
				}
			};

			options.ajax401CallBack = function(jqXHR) {
				//location.reload();
			}

			options.initFinish = {
				callback: function() {
					$('.m_datatable a.edit').on('click', function() {
						var member_id = $(this).attr('data');
						var v_member_name = $(this).next('input[name="name_member"]').val();
						var v_badge_id = $(this).next().next('input[name="badgeid_member"]').val();
						plan_edit.edit(member_id, v_member_name, v_badge_id );
					});
					$('.m_datatable a.delete').on('click', function() {
						var member_id = $(this).attr('data');
						plan_edit.delete(member_id);
					});

					// Init tooltip of cell on table
					mApp.initTooltips();
					// Fix fall scroll block right of table
					left_width = $('.m-datatable thead').find('.m-datatable__lock--scroll').width() - 20;
					$('.m-datatable').find('.m-datatable__lock--scroll').css('width', left_width);

					$('.m-datatable td[data-field^="value_"] div').on('click', function() {
						var type = ['credit', 'assign'];
						var id = $(this).attr('data');
						var projects = $(this).find('input').val();
						plan_edit.call_modal_add(id, type[$(this).index()], projects);
					});
				}
			}

			// Search plan
			if (search) {
				badge_id = $('input[name="badge_id"]').val();
				project = $('input[name="project"]').val();
				member_email = $('input[name="member_email"]').val();
				plan_year = $('#plan_year').val();

				datatable.setDataSourceParam('badge_id', badge_id);
				datatable.setDataSourceParam('project', project);
				datatable.setDataSourceParam('member_email', member_email);
				datatable.setDataSourceParam('plan_year', plan_year);
				
				datatable.reload();
			} else {
				datatable = $('.m_datatable').mDatatable(options);
			}

			$('#value, #value2').selectpicker();
			$('form').submit(false);
	};

	return {
		// public functions
		init: function (url, token, search) {
			plan(url, token, search);
		}
	}
}();

function loadPlan(url, token, search) {
	planMember.init(url, token, search);
}