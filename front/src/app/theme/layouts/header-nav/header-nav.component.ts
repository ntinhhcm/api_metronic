import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../helpers';

declare let mLayout: any;
@Component({
    selector: "app-header-nav",
    templateUrl: "./header-nav.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class HeaderNavComponent implements OnInit, AfterViewInit {

    public user = {
        'username': '',
        'email': ''
    }

    constructor() {

    }
    ngOnInit() {
        let data = JSON.parse(localStorage.getItem('currentUser'));
        this.user.username = data.username;
        this.user.email = data.email;
    }
    ngAfterViewInit() {

        mLayout.initHeader();

    }

}