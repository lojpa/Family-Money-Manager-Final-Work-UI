import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Family Money Manager';
  loggedIn = false;

  constructor(private router: Router, private loginService: LoginService) { }
  ngOnInit() {
    this.loginService._subject.subscribe(x => this.loggedIn = x);
    if (localStorage.getItem('key')) {
      this.loggedIn = true;
    }
  }
  logOut() {
    localStorage.removeItem('key');
    this.loggedIn = false;
    this.router.navigate(['login']);
  }

}

