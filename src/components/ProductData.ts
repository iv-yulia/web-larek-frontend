import { BasketItem, IProduct } from '../types';
import { IEvents } from './base/events';

interface IProductData {
	products: IProduct[];
	basket: BasketItem[];
	// preview: string | null;
	// events: IEvents;
	// getProducts(): IProduct[];
	// getProduct(id: string): IProduct;
	addProduct(item: IProduct): void;
	removeProduct(id: string): void;
	// clear(): void;
}

export class ProductData implements IProductData {
	protected _products: IProduct[];
	protected _basket: BasketItem[] = [];
	// protected _preview: string | null;

	constructor(protected events: IEvents) {}

	set products(products: IProduct[]) {
		this._products = products;
		this.events.emit('catalog:change');
	}

	get products() {
		return this._products;
	}

	get basket() {
		return this._basket;
	}

	addProduct(item: IProduct): void {
		this._basket = [...this._basket, item];
	}

  removeProduct(id: string): void {
    this._basket = this._basket.filter(item => item.id !== id)
  }
}
