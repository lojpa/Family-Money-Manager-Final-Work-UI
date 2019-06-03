import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Category } from '../models/category';


@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    constructor(private http: HttpClient) { }

    categories: Category[] = [];
    category: Category;

    getCategories() {
        // now returns an Observable of Config
        return this.http.get<Category[]>('http://localhost:8888/api/categories').pipe(map(x => this.categories = x));
    }

    getExpenseCategories() {
        // now returns an Observable of Config
        return this.http.get<Category[]>('http://localhost:8888/api/categories/expenseCategories').pipe(map(x => this.categories = x));
    }

    getCategoryById(id: number): Observable<Category> {
        // now returns an Observable of Config
        return this.http.get<Category>('http://localhost:8888/api/categories/' + id).pipe(map(x => this.category = x));
    }

    postCategory(category: Category): Observable<Category> {
        return this.http.post<Category>('http://localhost:8888/api/categories', category).pipe(map(x => x));
    }

}
