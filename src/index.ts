import { AppApi } from './components/AppApi';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';
import './scss/styles.scss';
import { InputValues, IProduct, PaymentMethod } from './types';
import { Page } from './components/Page';
import { ProductData } from './components/ProductData';
import {
	ProductPreview,
	ProductContainer,
	ProductBasket,
} from './components/Product';
import { Modal } from './components/common/Modal';
import { Basket } from './components/Basket';
import { Order, OrderContacts } from './components/Order';
import { OrderData } from './components/OrderData';
import { Success } from './components/Success';

const events = new EventEmitter();
const productData = new ProductData(events);
const orderData = new OrderData(events);
const api = new AppApi(CDN_URL, API_URL);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const productCatalogTemplate =
	ensureElement<HTMLTemplateElement>('#card-catalog');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const productBasketTemplate =
	ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new OrderContacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

events.on('products:loaded', () => {
	page.catalog = productData.products.map((item) => {
		const card = new ProductContainer(
			cloneTemplate(productCatalogTemplate),
			events
		);
		return card.render(item);
	});
});

events.on('basket:change', () => {
	basket.items = productData.basket.map((item, index) => {
		const card = new ProductBasket(
			cloneTemplate(productBasketTemplate),
			events
		);
		card.index = index;
		return card.render(item);
	});
	modal.render({
		content: basket.render(),
	});
	const total = productData.getTotalPrice();
	basket.total = total;
});

events.on('basket:change', () => {
	page.counter = productData.basket.length;
});

events.on('product:selected', (item: IProduct) => {
	const selectedProduct = productData.getProduct(item.id);
	const card = new ProductPreview(cloneTemplate(cardPreviewTemplate), events);
	card.button = productData.checkBasket(item.id);
	modal.render({
		content: card.render(selectedProduct),
	});
});

events.on('basket:add', (item: IProduct) => {
	const basketItem = productData.getProduct(item.id);
	productData.addProduct(basketItem);
	modal.close();
});

events.on('basket:remove', (item: IProduct) => {
	const basketItem = productData.getProduct(item.id);
	productData.removeProduct(basketItem.id);
	events.emit('basket:change');
});

events.on(
	/^order\..*?:change$/,
	(data: { field: keyof InputValues; value: string }) => {
		orderData.setOrderField(data.field, data.value, 'order');
	}
);

events.on(
	/^contacts\..*?:change$/,
	(data: { field: keyof InputValues; value: string }) => {
		orderData.setOrderField(data.field, data.value, 'contacts');
	}
);

events.on('order:open', () => {
	modal.render({
		content: order.render({
			payment: null,
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('order:change', (data: { field: string; value: PaymentMethod }) => {
	orderData.setOrderPayment('payment', data.value);
	order.button = data.value;
	const { payment, address } = orderData.validateOrder('order');
	const valid = !payment && !address;
	const errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	order.render({
		payment: orderData.order.payment,
		address: orderData.order.address,
		valid: valid,
		errors: [].concat(errors),
	});
});

events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('contacts:change', () => {
	const { email, phone } = orderData.validateOrder('contacts');
	const valid = !email && !phone;
	const errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
	contacts.render({
		email: orderData.order.email,
		phone: orderData.order.phone,
		valid: valid,
		errors: [].concat(errors),
	});
});

events.on('contacts:submit', () => {
	api
		.orderProducts({ ...productData.getProducts(), ...orderData.order })
		.then(({ total }) => {
			success.total = total;
			productData.clear();
			orderData.clearOrder();
			modal.render({
				content: success.render(),
			});
		})
		.catch((err) => {
			console.log(err);
		});
});

events.on('success:submit', () => {
	modal.close();
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

api
	.getProducts()
	.then((data) => {
		productData.products = data;
	})
	.catch((err) => console.log(err));
