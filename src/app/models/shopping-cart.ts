import { ItemCart } from './item-cart';

export class ShoppingCart {
    id: number;
    items: Array<ItemCart>;
    totalNumberOfItems: number;
    totalPrice: number;
}
