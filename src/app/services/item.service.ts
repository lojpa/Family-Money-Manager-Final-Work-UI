import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Item } from '../models/item';


@Injectable({
    providedIn: 'root',
})
export class ItemService {
    constructor(private http: HttpClient) { }

    items: Item[] = [];
    item: Item;

    getItems() {
        // now returns an Observable of Config
        return this.http.get<Item[]>('http://localhost:8888/api/items').pipe(map(x => this.items = x));
    }

    getItemById(id: number): Observable<Item> {
        // now returns an Observable of Config
        return this.http.get<Item>('http://localhost:8888/api/items/' + id).pipe(map(x => this.item = x));
    }

    postItem(item: Item): Observable<void> {
        return this.http.post<void>('http://localhost:8888/api/items', item).pipe(map(x => x));
    }

}
