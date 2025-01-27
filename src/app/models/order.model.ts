import { Book } from "./book.model";

export interface Order {
    price: number;
    quantity: number;
    address: Object;
    boos:Book[];
}
