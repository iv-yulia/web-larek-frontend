import { IProduct } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class Product extends Component<IProduct> {
	protected _title: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _category?: HTMLElement;
  protected _description?: HTMLElement;
	protected _price: HTMLSpanElement;
	protected _id: string;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLSpanElement>('.card__price', container);
	}

  render(productData: Partial<IProduct> | undefined) { 
    const { ...products } = productData;
    Object.assign(this, products); 
    return this.container;
}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		if (value === null) {
			this.setText(this._price, 'Бесценно');
		} else {
			this.setText(this._price, `${String(value)} синапсов`);
		}
	}

	set id(value: string) {
		this._id = value;
	}
}
