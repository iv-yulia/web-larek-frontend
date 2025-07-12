import { BasketItem, IProduct } from '../types';
import { IEvents } from './base/events';

interface IProductData {
	products: IProduct[];
	basket: BasketItem[];
	getProducts(): void;
	getProduct(id: string): IProduct;
	addProduct(item: IProduct): void;
	checkBasket(id: string): void;
	removeProduct(id: string): void;
	clear(): void;
}

export class ProductData implements IProductData {
	protected _products: IProduct[];
	protected _basket: BasketItem[] = [];

	constructor(protected events: IEvents) {
		this.events = events;
	}

	set products(products: IProduct[]) {
		this._products = products;
		this.events.emit('products:loaded');
	}

	get products() {
		return this._products;
	}

	get basket() {
		return this._basket;
	}

	addProduct(item: IProduct) {
		this._basket = [...this._basket, item];
		this.events.emit('basket:change');
	}

	removeProduct(id: string) {
		this._basket = this._basket.filter((item) => item.id !== id);
		this.events.emit('basket:change');
	}

	getTotalPrice() {
		return this._basket.reduce((total, item) => {
			return total + item.price;
		}, 0);
	}

	getProduct(id: string) {
		return this._products.find((item) => item.id === id);
	}

	checkBasket(id: string) {
		return this._basket.some((item) => item.id === id);
	}

	getProducts() {
		const items = this._basket.map((item) => item.id);
		const total = this.getTotalPrice();
		return {
			items,
			total,
		};
	}

	clear() {
		this._basket = [];
		this.events.emit('basket:change');
	}
}
