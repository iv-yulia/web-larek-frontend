import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

interface ISuccess {
	total: number;
}

export class Success extends Component<ISuccess> {
	protected _button: HTMLButtonElement;
	protected _total: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._button = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			container
		);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			container
		);

		this._button.addEventListener('click', () => {
			this.events.emit('success:submit');
		});
	}

	set total(value: number) {
		this.setText(this._total, `Списано ${value} синапсов`);
	}
}
