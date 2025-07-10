import { IOrder } from '../types';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Form } from './common/Form';

export class Order extends Form<IOrder> {
	protected _cashButton: HTMLButtonElement;
	protected _cardButton: HTMLButtonElement;
	protected _address: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._cashButton = ensureElement<HTMLButtonElement>(
			'button[name=cash]',
			container
		);
		this._cardButton = ensureElement<HTMLButtonElement>(
			'button[name=card]',
			container
		);

		this._cashButton.addEventListener('click', () => {
			this.events.emit(`${this.container.name}:change`, {
				field: 'payment',
				value: this._cashButton.name,
			});
		});

		this._cardButton.addEventListener('click', () => {
			this.events.emit(`${this.container.name}:change`, {
				field: 'payment',
				value: this._cardButton.name,
			});
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	set button(value: string) {
		this._cardButton.classList.toggle('button_alt-active', value === 'card');
		this._cashButton.classList.toggle('button_alt-active', value === 'cash');
	}
}

export class OrderContacts extends Form<IOrder> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	constructor(protected container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}
}
