import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { environment as env} from '../../../../../environments/environment'

declare function setting_init(apiUrl: String, token: String);
@Component({
  selector: "app-setting",
  templateUrl: "./setting.component.html",
  encapsulation: ViewEncapsulation.None
})
export class SettingComponent implements OnInit, AfterViewInit {
  private url = '';
  private token = '';

  constructor(
    private _script: ScriptLoaderService
  ) { }

  ngOnInit() {
    this.url = env.apiUrl + env.apiPrefix;
    let user = JSON.parse(localStorage.getItem('currentUser'));
    this.token = user.token;
  }

  ngAfterViewInit() {
    this._script.loadScripts('app-setting', ['assets/plan/setting.js']);
    setting_init(this.url, this.token);
  }

}
