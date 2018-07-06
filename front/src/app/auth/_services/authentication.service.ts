import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { environment as env } from '../../../environments/environment';
import "rxjs/add/operator/map";

@Injectable()
export class AuthenticationService {
    constructor(private http: Http) {}

    login(username: string, password: string) {
        return this.http.post(env.apiUrl + '/api/login', {username: username, password: password})
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user.user));
                }
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}