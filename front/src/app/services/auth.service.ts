import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthService implements CanActivate{

  constructor(public router: Router) { }

  canActivate() {
  	if (localStorage.getItem('userData')) {
  		let userData = JSON.parse(localStorage.getItem('userData'));
  		if (userData.token) {
  			return true;
  		}
  	}
  	this.router.navigate(['login']);
  	return false;
  }
}
