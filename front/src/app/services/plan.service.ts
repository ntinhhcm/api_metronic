import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment as env } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(private http: HttpClient) { }

  search (params) {
    return new Promise(
    (resolve, reject) => {
      this.http.get(env.apiUrl + '/plan', {params})
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

  getPlan() {
    return new Promise(
    (resolve, reject) => {
      this.http.get(env.apiUrl + '/plan')
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

  getApiEdit() {
    return new Promise(
    (resolve, reject) => {
      this.http.get('http://dev.www.rpm-tools.com/plan/1')
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

