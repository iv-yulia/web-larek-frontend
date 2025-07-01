export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IProductListResult {
	total: number;
	items: IProduct[];
}

export interface IOrderForm {
	payment: PaymentMethod;
	address: string;
	email: string;
	phone: string;
}

export interface IOrder extends IOrderForm {
	items: string[];
	total: number;
}

export interface IOrderResult {
	id: string;
	total: number;
}

export type BasketItem = Pick<IProduct, 'id' | 'title' | 'price'>;

export type CatalogItem = Omit<IProduct, 'description'>;

export type PaymentMethod = 'online' | 'cash';

export type FormErrors = Partial<Record<keyof IOrder, string>>;

// export interface IAppState {
//   catalog: IProduct[];
//   basket: string[];
//   preview: string | null;
//   order: IOrder | null;
// }git
