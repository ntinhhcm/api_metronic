import { Component, OnInit, ViewEncapsulation, AfterViewInit,ViewChildren,ViewChild } from '@angular/core';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { PlanService} from '../../../../_services/plan.service';
import { environment as env} from '../../../../../environments/environment'

declare function loadPlan(url: string, token: string, search: boolean): any;
declare function initEditPlan(apiURL: string, token: string);
@Component({
  selector: "app-plan",
  templateUrl: "./plan.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class PlanComponent implements OnInit, AfterViewInit {

  public plans: any;

  private url = '';
  private token = '';

  @ViewChildren('allInput') allInput;

  constructor(
    private _script: ScriptLoaderService,
    private planService: PlanService,

  ) {}
  ngOnInit()  {
    this.url = env.apiUrl + env.apiPrefix;
    let user = JSON.parse(localStorage.getItem('currentUser'));
    this.token = user.token;
  }

  ngAfterViewInit()  {
    this._script.loadScripts('app-plan', ['assets/plan/plan_edit.js', 'assets/plan/left.js']);
    this.loadData();
    initEditPlan(this.url, this.token);
  }

  loadData() {
    loadPlan(this.url + '/plan', this.token, false);
  }

  search() {
    loadPlan(this.url + '/plan', this.url, true);
  }
}