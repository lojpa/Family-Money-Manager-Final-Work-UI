import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Transaction } from '../models/transaction';
import { Observable, Subject } from 'rxjs';
import { Category } from '../models/category';
import { User } from '../models/user';
import { UserLogin } from '../models/login';


@Injectable({
    providedIn: 'root',
})
export class LoginService {
    constructor(private http: HttpClient) { }

    user: UserLogin;
    public _subject: Subject<boolean> = new Subject<boolean>();

    loggedIn() {
        this._subject.next(true);
    }
    login(user: UserLogin) {
        return this.http.post<UserLogin>('http://localhost:8888/api/usersLogin', user).pipe(map(x => this.user = x));
    }
}
