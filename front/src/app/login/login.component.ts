import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class LoginComponent implements OnInit {

  public userLogin = {
    username: '',
    password: ''
  };

  loginForm: FormGroup;
  isLoginError : boolean = false;

  constructor(
        private loginService: LoginService,
        private router: Router,
        private fb: FormBuilder
      ) { this.createForm(); }

  ngOnInit(): void {}

  login(data): void {
    let username = data.username.trim();
    let password = data.password.trim();
    if (! username || !password) { return; }

    this.userLogin.username = username;
    this.userLogin.password = password;

    this.loginService.loginUS(this.userLogin).then(
      (result: any) => {
        if (result.token) {
          localStorage.setItem('userData', JSON.stringify({'token' : result.token}));
          this.router.navigate(['home']);
          location.reload();
        }
      },
      (err) => {
        this.isLoginError = true;
      }
    );
  }

  createForm() {
      this.loginForm = this.fb.group({
        username: [null, Validators.required ],
        password: ['', Validators.required ]
      });
  }
}