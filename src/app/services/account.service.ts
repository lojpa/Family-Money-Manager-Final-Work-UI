import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map } from 'rxjs/operators';
import { Account } from '../models/account';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class AccountService {
    constructor(private http: HttpClient) { }

    accounts: Account[] = [];
    account: Account;

    getAccounts() {
        // now returns an Observable of Config
        return this.http.get<Account[]>('http://localhost:8888/api/accounts').pipe(map(x => this.accounts = x));
    }

    getAccountById(id: number): Observable<Account> {
        // now returns an Observable of Config
        return this.http.get<Account>('http://localhost:8888/api/accounts/' + id).pipe(map(x => this.account = x));
    }

    postAccount(account: Account): Observable<void> {
        return this.http.post<void>('http://localhost:8888/api/accounts', account).pipe(map(x => x));
    }

    patchAccount(account: Account): Observable<void> {
        return this.http.put<void>('http://localhost:8888/api/accounts', account).pipe(map(x => x));
    }

}
