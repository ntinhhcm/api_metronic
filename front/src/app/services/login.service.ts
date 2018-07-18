import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env } from '../../environments/environment';

@Injectable({ providedIn: 'root' })

export class LoginService {
  constructor(private http: HttpClient){}

  loginUS (credentials) {
    return new Promise(
    (resolve, reject) => {
      this.http.post(env.apiUrl + '/api/login', credentials)
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
  };
}