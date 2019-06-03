export enum ItemType {
    DrinkFood = 1,
    Clothes,
    Equipment
}

export class Item {
    id: number;
    name: string;
    itemType: ItemType;
    price: number;
    imageUrl: string;
}
