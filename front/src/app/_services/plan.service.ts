import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import { environment as env } from '../../environments/environment'

@Injectable()
export class PlanService {
    constructor(private http: Http) {
    }

    getPlan() {
        let token = JSON.parse(localStorage.getItem('currentUser')).token;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers});
        return new Promise((resolve, reject) => {
            this.http.get(env.apiUrl + '/api/v1/plan', options)
                .subscribe(
                    (res) => {
                      resolve(res);
                    },
                    (err) => {
                      reject(err);
                    }
                );
            }
        );
    }
}