export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IOrderProduct {
	total: number;
	items: string[];
}

export interface IOrder {
	payment: PaymentMethod;
	address: string;
	email: string;
	phone: string;
}

export interface IOrderResult {
	id: string;
	total: number;
}

export type BasketItem = Pick<IProduct, 'id' | 'title' | 'price'>;

export type CatalogItem = Omit<IProduct, 'description'>;

export type PaymentMethod = 'card' | 'cash' | '';

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export type InputValues = Omit<IOrder, 'payment'>;

export type PaymentValues = Pick<IOrder, 'payment'>;
