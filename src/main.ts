import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { IProduct, IBuyer, TPayment } from './types';
import { EventEmitter } from './components/base/Events';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { ShoppingCart } from './components/Models/ShoppingCart';
import { Buyer } from './components/Models/Buyer';
import { Api } from './components/base/Api';
import { LarekAPI } from './components/Api/LarekAPI';
import { API_URL } from './utils/constants';
import { Gallery } from './components/views/Gallery';
import { CardCatalog } from './components/views/cards/CardCatalog';
import { OrderForm } from './components/views/forms/OrderForm';
import { ModalView } from './components/views/ModalView';
import { AppPresenter } from './presenter/AppPresenter';
import {Page} from "./components/views/Page.ts";

// Создание экземпляров
const events = new EventEmitter();
const catalog = new ProductCatalog(events);
const cart = new ShoppingCart(events);
const buyer = new Buyer(events);
const api = new Api(API_URL);
const larekApi = new LarekAPI(api);

const pageContainer = document.querySelector('.page') as HTMLElement;
const page = new Page(pageContainer);
const gallery = new Gallery(page.gallery);
const headerBasket = page.basketButton;

headerBasket.addEventListener('click', () => {
    events.emit('header:basket-click');
});

const modalContainer = document.getElementById('modal-container') as HTMLElement;
const modal = new ModalView(modalContainer, events);

// Создание презентера
const presenter = new AppPresenter(
    events,
    catalog,
    cart,
    buyer,
    larekApi,
    gallery,
    page,
    modal
);

// Загрузка товаров с сервера
larekApi.getProducts()
    .then(products => {
        catalog.setProducts(products);
    })
    .catch(err => {
        console.error('Ошибка при загрузке товаров:', err);
    });

// Обработка клика по корзине в хедере
headerBasket.addEventListener('click', () => {
    events.emit('header:basket-click');
});