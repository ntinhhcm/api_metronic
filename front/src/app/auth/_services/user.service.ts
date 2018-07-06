import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";

import { environment as env } from '../../../environments/environment';

@Injectable()
export class UserService {
    constructor(private http: Http) {
    }

    verify(token) {
        var headers = new Headers({'Authorization': token});
        var options = new RequestOptions({headers: headers});
        return this.http.get(env.apiUrl + '/api/verify', options).map(
        	(results: Response) => {
        		 return results.json().success;
        	});
    }
}