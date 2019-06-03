import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, catchError } from 'rxjs/operators';
import { Transaction } from '../models/transaction';
import { Observable, BehaviorSubject } from 'rxjs';
import { Category } from '../models/category';


@Injectable({
    providedIn: 'root',
})
export class TransactionService {
    constructor(private http: HttpClient) { }

    transactions: Transaction[] = [];
    categories: Category[] = [];
    transactionsAmount: number;
    private messageSource = new BehaviorSubject('default message');
    currentMessage = this.messageSource.asObservable();

    changeMessage(message: string) {
        this.messageSource.next(message);
    }


    getTransactions() {
        return this.http.get<Transaction[]>('http://localhost:8888/api/expenseIncomes').pipe(map(x => this.transactions = x));
    }

    getTransactionsPerMonth() {
        return this.http.get<number[]>('http://localhost:8888/api/expenseIncomes/perMonth').pipe(map(x => x));
    }

    getTransactionsAmountByCategory(categoryId: number) {
        console.log('tu je dejo');
        return this.http.get<number>('http://localhost:8888/api/expenseIncomes/amount/' + categoryId)
        .pipe(map(x => this.transactionsAmount = x));
    }

    getCategories() {
        return this.http.get<Category[]>('http://localhost:8888/api/categories').pipe(map(x => this.categories = x));
    }

    postTransactions(transaction: Transaction): Observable<Transaction> {
        return this.http.post<Transaction>('http://localhost:8888/api/expenseIncomes', transaction).pipe(map(x => x));
    }

    patchTransactions(transaction: Transaction): Observable<Transaction> {
        return this.http.put<Transaction>('http://localhost:8888/api/expenseIncomes', transaction).pipe(map(x => x));
    }

}
