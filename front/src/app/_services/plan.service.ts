import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import { environment as env } from '../../environments/environment'

@Injectable()
export class PlanService {

    constructor(private http: Http) {
    }

    getRequestHeader(params: any = {}): RequestOptions {
        let token = JSON.parse(localStorage.getItem('currentUser')).token;
        let headers = new Headers({'Authorization': token});
        let options = new RequestOptions({headers: headers, params: params});
        return options;
    }

    getPlan() {
        return new Promise((resolve, reject) => {
            this.http.get(env.apiUrl + '/api/v1/plan', this.getRequestHeader())
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

    getCount(data: any) {

        var params = {
            'month': 0,
            'year' : 0,
            'c_month' : 0,
            'c_year': 0
        };

        if (typeof data.month != 'undefined' && data.month != '') {
            params.month = data.month;
        }
        if (typeof data.year != 'undefined'  && data.year != '') {
            params.year = data.year;
        }
        if (typeof data.c_month != 'undefined' && data.c_month != '') {
            params.c_month = data.c_month;
        }
        if (typeof data.c_year != 'undefined'  && data.c_year != '') {
            params.c_year = data.c_year;
        }
        return new Promise((resolve, reject) => {
            this.http.get(env.apiUrl + '/api/v1/plan/count', this.getRequestHeader(params))
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