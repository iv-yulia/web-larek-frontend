import { createElement, ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

interface IBasket {
	total: number;
	items: HTMLElement[];
}

export class Basket extends Component<IBasket> {
	protected _total: HTMLElement;
	protected _basket: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._total = ensureElement<HTMLElement>('.basket__price', container);
		this._basket = ensureElement<HTMLElement>('.basket__list', container);
		this._button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			container
		);

		this._button.addEventListener('click', () => {
			this.events.emit('order:open');
		});
	}

	set total(value: number) {
		this.setText(this._total, `${String(value)} синапсов`);
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._basket.replaceChildren(...items);
		} else {
			this._basket.replaceChildren(
				createElement<HTMLElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	toggleButton(value: number) {
		if (value) {
			this.setDisabled(this._button, false);
		} else {
			this.setDisabled(this._button, true);
		}
	}
}
