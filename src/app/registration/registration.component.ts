import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RegistrationService } from '../services/registration.service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registrationForm: FormGroup;
  user: any;
  users: any[];
  isErrorHappened = false;
  clicked = false;


  constructor(private fb: FormBuilder, private regService: RegistrationService, private router: Router) {
  }

  getUser(id: number) {
    this.regService.getUser(id).subscribe(x => this.user = x);
  }

  postUser(user: User) {
    this.isErrorHappened = false;
    if (user.firstName.length < 5) {
      alert('First name should be more than 5 characters length');
      return;
    }
    if (user.lastName.length < 5) {
      alert('Last name should be more than 5 characters length');
      return;
    }
    if (user.password !== user.confirmPassword) {
      return;
    }
    user.id = 0;
    setTimeout(() => this.regService.postUser(user).subscribe(x => x, error => {
      // in case of error, add the callback to bring the item back and re-throw the error.
      if (error) {
        this.isErrorHappened = true;
        this.clicked = true;
      }
    }
    ), 1000);
    setTimeout(() => this.clicked = true, 2000);
    setTimeout(() => this.clicked = false, 4000);

    setTimeout(() => this.redirect(), 5000);
  }

  redirect(): void {
    if (this.isErrorHappened === false) {
      this.router.navigate(['login']);
    }
  }

  login() {
    this.router.navigate(['login']);
  }


  ngOnInit() {
    this.registrationForm = this.fb.group({
      firstName: [undefined],
      lastName: [undefined],
      userName: [undefined],
      password: [undefined],
      confirmPassword: [undefined],
      email: [undefined]
    });
  }

}
