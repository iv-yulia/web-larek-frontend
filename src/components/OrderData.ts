import {
	FormErrors,
	IOrder,
	InputValues,
	PaymentMethod,
	PaymentValues,
} from '../types';
import { IEvents } from './base/events';

interface IOrderData {
	order: IOrder;
	setOrderField(
		field: keyof InputValues,
		value: IOrder[keyof IOrder],
		emit: string
	): void;
	setOrderPayment(field: string, value: PaymentMethod): void;
	validateOrder(value: string): FormErrors;
	clearOrder(): void;
}

export class OrderData implements IOrderData {
	formErrors: FormErrors = {};
	order: IOrder = {
		email: '',
		phone: '',
		address: '',
		payment: '',
	};
	constructor(protected events: IEvents) {
		this.events = events;
	}

	setOrderField(field: keyof InputValues, value: string, emit: string) {
		this.order[field] = value;
		this.events.emit(`${emit}:change`, { field: field });
	}

	setOrderPayment(field: keyof PaymentValues, value: PaymentMethod) {
		this.order[field] = value;
	}

	validateOrder(form: string) {
		const errors: FormErrors = {};
		if (form === 'order') {
			if (!this.order.address) {
				errors.address = 'Необходимо указать адрес';
			}
			if (!this.order.payment) {
				errors.payment = 'Выберите способ оплаты';
			}
		}
		if (form === 'contacts') {
			if (!this.order.email) {
				errors.email = 'Необходимо указать email';
			}
			if (!this.order.phone) {
				errors.phone = 'Необходимо указать телефон';
			}
		}
		return errors;
	}

	clearOrder() {
		this.order.payment = '';
		this.order.email = '';
		this.order.phone = '';
		this.order.address = '';
	}
}
