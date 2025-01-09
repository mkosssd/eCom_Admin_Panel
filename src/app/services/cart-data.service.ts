import {
	EventEmitter,
	Injectable,
	Output,
} from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Product } from "../interface/product";

export interface CartItem extends Product {
	amount: number;
	isAdd?: boolean;
}
@Injectable({
	providedIn: "root",
})
export class CartDataService {
	storedPro =
		localStorage.getItem("cart") || "[]";
	prods = JSON.parse(this.storedPro);
	cartdata: CartItem[] = this.prods;
	cart$ = new BehaviorSubject(this.cartdata);
	@Output() items = new EventEmitter();
	constructor() {}
	
	data(product: CartItem, method: string) {
		const productExistInCart = this.cartdata.find(
			({ _id }) => _id === product._id
		);

		if (method === "add") {
			if (!productExistInCart) {
				this.cartdata.push({
					...product,
					amount: 1,
				});
			} else {
				productExistInCart.amount += 1;
			}
		} else {
			let index = this.cartdata.findIndex((p) => {
				return p._id === product._id;
			});
			if (productExistInCart?.amount == 1) {
				this.cartdata.splice(index, 1);
			} else {
				if (productExistInCart)
					productExistInCart.amount -= 1;
			}
		}
		localStorage.setItem(
			"cart",
			JSON.stringify(this.cartdata)
		);
		this.cart$.next(this.cartdata)
		this.items.emit(this.cartdata.length);
	}
}
