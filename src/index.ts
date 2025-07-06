import { AppApi } from './components/AppApi';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';
import './scss/styles.scss';
import { IOrder } from './types';
import { Page } from './components/Page';
import { ProductData } from './components/ProductData';
import { Product } from './components/Product';

const order: IOrder = {
	payment: 'online',
	email: 'test@test.ru',
	phone: '+71234567890',
	address: 'Spb Vosstania 1',
	total: 2200,
	items: [
		'854cef69-976d-4c2a-a18c-2aa45046c390',
		'c101ab44-ed99-4a54-990d-47aa2bb4e7d9',
	],
};
const events = new EventEmitter();
const productData = new ProductData(events);
const api = new AppApi(CDN_URL, API_URL);
api.getProducts().then((data) => (productData.products = data)); // error
// api.getProduct('b06cde61-912f-4663-9751-09956c0eed67').then(item => console.log(item))
// api.orderProducts(order).then(data => console.log(data))

const page = new Page(document.body, events);
const productCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

//test
productData.addProduct({
	id: '854cef69-976d-4c2a-a18c-2aa45046c390',
	description: 'Если планируете решать задачи в тренажёре, берите два.',
	image: '/5_Dots.svg',
	title: '+1 час в сутках',
	category: 'софт-скил',
	price: 750,
});
productData.addProduct({
	id: 'c101ab44-ed99-4a54-990d-47aa2bb4e7d9',
	description:
		'Лизните этот леденец, чтобы мгновенно запоминать и узнавать любой цветовой код CSS.',
	image: '/Shell.svg',
	title: 'HEX-леденец',
	category: 'другое',
	price: 1450,
});

console.log(productData.basket);

productData.removeProduct('854cef69-976d-4c2a-a18c-2aa45046c390')
console.log(productData.basket);

// events.on('catalog:change', () => {
// 	page.catalog = productData.products.map((item) => {
// 		const card = new Product(cloneTemplate(productCatalogTemplate), events);
// 		return card.render(item);
// 	});
// });
