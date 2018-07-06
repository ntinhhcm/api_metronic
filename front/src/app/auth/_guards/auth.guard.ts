import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "../_services/user.service";
import { Observable } from "rxjs/Rx";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private _router: Router, private _userService: UserService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            return this._userService.verify(currentUser.token)
                .map(
                    res => {
                        if (res) {
                            // logged in so return true
                            return true;
                        }
                        // error when verify so redirect to login page with the return url
                        this._router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
                        return false;
                }).catch(
                    error => {
                        this._router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
                        return Observable.of(false);
                    }
                );
        }
        this._router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
        return false;
    }
}