import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {map, catchError } from 'rxjs/operators';
import { Transaction } from '../models/transaction';
import { Observable, throwError } from 'rxjs';
import { Category } from '../models/category';
import { User } from '../models/user';


@Injectable({
    providedIn: 'root',
})
export class RegistrationService {
    constructor(private http: HttpClient) { }

    user: User;

    getUser(id: number) {
        return this.http.get<User>('http://localhost:8888/api/users' + id).pipe(map(x => this.user = x));
    }

    postUser(user: User): Observable<User> {
        return this.http.post<User>('http://localhost:8888/api/users', user).pipe(map(x => x));
    }
}
