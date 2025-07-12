import { Product } from "./product";

export interface Category {
    _id?: string,
    name: String,
    description: string
}
export interface CartItem extends Product {
	amount: number;
	isAdd?: boolean;
}
export interface ProductList {
    products: CartItem[]
}