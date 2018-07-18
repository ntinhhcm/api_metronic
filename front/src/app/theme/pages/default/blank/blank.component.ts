import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NgForm} from '@angular/forms';
import {isNumeric} from "rxjs/util/isNumeric"
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { PlanService} from '../../../../_services/plan.service';
import { environment as env} from '../../../../../environments/environment'

declare function initchart(type: string, data: any);
@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class BlankComponent implements OnInit {

  public assignBackup = {
    'type': 'week',
    'data' : [
      {'week': 1, 'assign': 0},
      {'week': 2, 'assign': 0},
      {'week': 3, 'assign': 0},
      {'week': 4, 'assign': 0}
    ]
  };

  public year: number;
  public month: number;

  constructor(
    private _script: ScriptLoaderService,
    private _plan: PlanService
  ) {}

  ngOnInit() {
    var date = new Date();
    this.month = date.getUTCMonth() + 1;
    this.year = date.getUTCFullYear();
  }

  ngAfterViewInit() {
      this._script.loadScripts('app-blank',
          ['//www.amcharts.com/lib/3/plugins/tools/polarScatter/polarScatter.min.js',
              '//www.amcharts.com/lib/3/plugins/export/export.min.js',
              'assets/plan/chart.js']);
      Helpers.loadStyles('app-amcharts-charts', [
          '//www.amcharts.com/lib/3/plugins/export/export.css']);
      this.buildChartAssignBack();
  }

  buildChartAssignBack(data: any = {}) {
    this._plan.getCount(data).then((res: any) => {
      let data = res.json();
      if (data.success == true) {
        initchart(data.type, data.items);
      }
    }).catch((err) => {
        if (err.status == 401) {
          location.reload();
        }

        initchart(this.assignBackup.type, this.assignBackup.data);
    });
  }

  filter(filter) {
    var month = filter.month.value;
    var year = filter.year.value;
    this.buildChartAssignBack({month: month, year: year});
  }
}