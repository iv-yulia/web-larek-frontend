import { IProduct } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class Product extends Component<IProduct> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _description: HTMLElement;
	protected _price: HTMLSpanElement;
	protected _id: string;
	protected _index: HTMLSpanElement;
	protected _button: HTMLSpanElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);

		this.events = events;
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLSpanElement>('.card__price', container);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		if (value === null) {
			this.setText(this._price, 'Бесценно');
			this.setText(this._button, 'Недоступно');
			this.setDisabled(this._button, true);
		} else {
			this.setText(this._price, `${String(value)} синапсов`);
		}
	}

	set id(value: string) {
		this._id = value;
	}

	get id() {
		return this._id;
	}
}

export class ProductCatalog extends Product {
	constructor(protected container: HTMLElement, events: IEvents) {
		super(container, events);

		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._category = ensureElement<HTMLSpanElement>(
			'.card__category',
			container
		);
	}

	set image(value: string) {
		this.setImage(this._image, value);
	}

	set category(value: string) {
		this.setText(this._category, value);
	}
}
export class ProductContainer extends ProductCatalog {
	constructor(protected container: HTMLElement, events: IEvents) {
		super(container, events);

		this.container.addEventListener('click', () => {
			this.events.emit('product:selected', this);
		});
	}
}

export class ProductPreview extends ProductContainer {
	constructor(protected container: HTMLElement, events: IEvents) {
		super(container, events);

		this._description = ensureElement<HTMLParagraphElement>(
			'.card__text',
			container
		);
		this._button = ensureElement<HTMLButtonElement>('.card__button', container);

		this._button.addEventListener('click', (e) => {
			e.stopPropagation();
			this.events.emit('basket:add', this);
		});
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set button(value: boolean) {
		if (value) {
			this.setText(this._button, 'Уже в корзине');
			this.setDisabled(this._button, true);
		} else {
			this.setText(this._button, 'В корзину');
		}
	}
}

export class ProductBasket extends Product {
	protected _button: HTMLButtonElement;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container, events);

		this._button = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			container
		);
		this._index = ensureElement<HTMLImageElement>(
			'.basket__item-index',
			container
		);
		this._button.addEventListener('click', () => {
			events.emit('basket:remove', this);
		});
	}

	set index(value: number) {
		this.setText(this._index, value + 1);
	}
}
