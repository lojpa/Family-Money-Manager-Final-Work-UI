import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { UserLogin } from '../models/login';
import { Router, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  logged = true;
  // tslint:disable-next-line:no-output-rename
  @Output('dejo') evEmitter = new EventEmitter();
  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router) {

  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      userName: [undefined, []],
      password: [undefined, []]
    });
  }

  register() {
    this.router.navigate(['registration']);
  }

  login() {
    const user = new UserLogin();
    user.userName = this.loginForm.get('userName').value;
    user.password = this.loginForm.get('password').value;

    this.loginService.login(user).subscribe(x => {
      if (x !== null) {
        this.loginService.loggedIn();
        localStorage.setItem('key', 'loggedIn');
        this.router.navigate(['home']);
      } else {
        alert('Invalid credentials!');
        this.loginForm.get('userName').setValue('');
        this.loginForm.get('password').setValue('');
        this.router.navigate(['login']);
      }
    });
  }
}
