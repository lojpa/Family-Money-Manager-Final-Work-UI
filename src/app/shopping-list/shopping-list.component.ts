import { Component, OnInit } from '@angular/core';
import { Item } from '../models/item';
import { ItemService } from '../services/item.service';
import { ItemCart } from '../models/item-cart';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { ShoppingCart } from '../models/shopping-cart';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  foodActive = true;
  clothesActive = false;
  equipmentActive = false;
  items: Array<Item> = new Array<Item>();
  foodItems: Array<Item> = new Array<Item>();
  clothesItems: Array<Item> = new Array<Item>();
  equipmentItems: Array<Item> = new Array<Item>();
  cartItems: Array<ItemCart> = new Array<ItemCart>();
  totalPrice = 0;
  errorCreate = false;
  clicked = false;



  changeActive(num: number): void {
    if (num === 1) {
      this.foodActive = true;
      this.clothesActive = false;
      this.equipmentActive = false;
    } else if (num === 2) {
      this.foodActive = false;
      this.clothesActive = true;
      this.equipmentActive = false;
    } else {
      this.foodActive = false;
      this.clothesActive = false;
      this.equipmentActive = true;
    }
  }

  saveCart(cartItems: Array<ItemCart>) {
    this.errorCreate = false;
    const shoppingCart: ShoppingCart = new ShoppingCart();
    shoppingCart.totalNumberOfItems = 0;
    shoppingCart.items = new Array<ItemCart>();
    cartItems.forEach(el => {
      shoppingCart.items.push(el);
      shoppingCart.totalNumberOfItems += el.counter;
    });
    shoppingCart.items.map(x => { x.itemId = x.item.id; x.item = null; });
    shoppingCart.totalPrice = this.totalPrice;
    this.shoppingCartService.postShoppingCart(shoppingCart).subscribe(x => x, error => {
      if (error) {
        this.errorCreate = true;
      }
    });
    setTimeout(() => this.clicked = true, 2000);
    this.cartItems = new Array<ItemCart>();
    setTimeout(() => this.clicked = false, 4000);
  }

  addToCart(item: Item) {
    if (this.cartItems.find(x => x.item === item) === undefined) {
      const itemCart: ItemCart = new ItemCart();
      itemCart.item = item;
      itemCart.counter = 1;
      this.cartItems.push(itemCart);
    } else {
      this.cartItems.find(x => x.item === item).counter++;
    }
    this.totalPrice += item.price;
  }

  getShoppingCarts() {
    this.shoppingCartService.getShoppingCarts().subscribe(x => console.log(x));
  }

  removeFromCart(itemCart: ItemCart) {
      if (this.cartItems.find(x => x.item === itemCart.item).counter > 1) {
        this.cartItems.find(x => x.item === itemCart.item).counter--;
      } else {
        this.cartItems.splice(this.cartItems.indexOf(itemCart), 1);
      }
      this.totalPrice -= itemCart.item.price;
  }

  constructor(private itemService: ItemService, private shoppingCartService: ShoppingCartService) { }

  ngOnInit() {
    this.itemService.getItems().subscribe(x =>  this.items = x);
    setTimeout(() => this.items.forEach(element => {
      if (element.itemType === 1) {
        this.foodItems.push(element);
      } else if (element.itemType === 2) {
        this.clothesItems.push(element);
      } else {
        this.equipmentItems.push(element);
      }
    }), 2000);
    this.getShoppingCarts();
  }

}
