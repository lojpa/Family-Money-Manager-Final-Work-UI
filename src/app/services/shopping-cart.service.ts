import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ShoppingCart } from '../models/shopping-cart';


@Injectable({
    providedIn: 'root',
})
export class ShoppingCartService {
    constructor(private http: HttpClient) { }

    shoppingCarts: ShoppingCart[] = [];
    shoppingCart: ShoppingCart;

    getShoppingCarts() {
        // now returns an Observable of Config
        return this.http.get<ShoppingCart[]>('http://localhost:8888/api/shoppingCarts').pipe(map(x => this.shoppingCarts = x));
    }

    removeShoppingCart(id: number) {
        // now returns an Observable of Config
        return this.http.delete<void>('http://localhost:8888/api/shoppingCarts/' + id).pipe(map(x => x));
    }

    getShoppingCartById(id: number): Observable<ShoppingCart> {
        // now returns an Observable of Config
        return this.http.get<ShoppingCart>('http://localhost:8888/api/shoppingCarts/' + id).pipe(map(x => this.shoppingCart = x));
    }

    postShoppingCart(shoppingCart: ShoppingCart): Observable<void> {
        return this.http.post<void>('http://localhost:8888/api/shoppingCarts', shoppingCart).pipe(map(x => x));
    }

    updateShoppingCart(shoppingCart: ShoppingCart): Observable<ShoppingCart> {
        return this.http.put<ShoppingCart>('http://localhost:8888/api/shoppingCarts', shoppingCart).pipe(map(x => x));
    }

}
