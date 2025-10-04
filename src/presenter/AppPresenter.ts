import { IEvents } from '../components/base/Events';
import { ProductCatalog } from '../components/Models/ProductCatalog';
import { ShoppingCart } from '../components/Models/ShoppingCart';
import { Buyer } from '../components/Models/Buyer';
import { LarekAPI } from '../components/Api/LarekAPI';
import { CardCatalog } from '../components/views/cards/CardCatalog';
import { CardPreview } from '../components/views/cards/CardPreview';
import { CardBasket } from '../components/views/cards/CardBasket';
import { Gallery } from '../components/views/Gallery';
import { BasketView } from '../components/views/BasketView';
import { OrderForm } from '../components/views/forms/OrderForm';
import { ContactsForm } from '../components/views/forms/ContactsForm';
import { SuccessView } from '../components/views/SuccessView';
import { ModalView } from '../components/views/ModalView';
import { CDN_URL } from '../utils/constants';
import { Page } from '../components/views/Page';

export class AppPresenter {
    private catalogCards: CardCatalog[] = [];
    private basketItems: CardBasket[] = [];
    private currentOrderForm: OrderForm | null = null;
    private currentContactsForm: ContactsForm | null = null;
    private currentBasketView: BasketView | null = null;

    constructor(
        private events: IEvents,
        private catalog: ProductCatalog,
        private cart: ShoppingCart,
        private buyer: Buyer,
        private api: LarekAPI,
        private gallery: Gallery,
        private page: Page,
        private modal: ModalView
    ) {
        this.init();
    }

    private init() {
        this.events.on('catalog:changed', this.handleCatalogChanged.bind(this));
        this.events.on('catalog:selected', this.handleProductSelected.bind(this));
        this.events.on('cart:changed', this.handleCartChanged.bind(this));
        this.events.on('buyer:changed', this.handleBuyerChanged.bind(this));

        this.events.on('card:close', this.handleCardClose.bind(this));
        this.events.on('card:select', this.handleCardSelect.bind(this));
        this.events.on('card:to-basket', this.handleAddToBasket.bind(this));
        this.events.on('basket:remove', this.handleRemoveFromBasket.bind(this));
        this.events.on('header:basket-click', this.handleOpenBasket.bind(this));
        this.events.on('basket:order', this.handleOrderStart.bind(this));
        this.events.on('order:payment', this.handlePaymentSelect.bind(this));
        this.events.on('order:address', this.handleAddressChange.bind(this));
        this.events.on('contacts:change', this.handleContactsChange.bind(this));
        this.events.on('OrderForm:submit', this.handleOrderSubmit.bind(this));
        this.events.on('success:close', this.handleSuccessClose.bind(this));
        this.events.on('ContactsForm:submit', this.handleContactsSubmit.bind(this));
        this.events.on('card:add-to-cart', this.handleAddToCart.bind(this));
        this.events.on('card:remove-from-cart', this.handleRemoveFromCart.bind(this));
        this.events.on('modal:close', this.handleModalClose.bind(this));
    }

    private handleCatalogChanged() {
        const products = this.catalog.getProducts();
        this.catalogCards = products.map(product => {
            const cardTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
            const cardElement = cardTemplate.content.querySelector('.card').cloneNode(true) as HTMLElement;
            const card = new CardCatalog(cardElement, this.events);
            card.render({
                id: product.id,
                title: product.title,
                image: CDN_URL + product.image,
                category: product.category,
                price: product.price
            });
            return card;
        });
        this.gallery.render({ items: this.catalogCards.map(card => card.container) });
    }

    private handleProductSelected() {
        const product = this.catalog.getSelectedProduct();
        if (product) {
            const cardTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
            const cardElement = cardTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
            const card = new CardPreview(cardElement, this.events);
            const inCart = this.cart.hasItem(product.id);
            card.render({
                id: product.id,
                title: product.title,
                image: CDN_URL + product.image,
                category: product.category,
                price: product.price,
                description: product.description
            });
            card.inCart = inCart;
            this.modal.open(card.container);
        }
    }


    private handleCartChanged() {
        const items = this.cart.getItems();
        const total = this.cart.getTotalPrice();
        const hasValidItems = total > 0;
        const isEmpty = items.length === 0;

        this.page.counter = items.length;

        this.catalogCards.forEach(card => {
            const product = this.catalog.getProductById(card.container.dataset.id!);
            if (product) {
                card.inCart = this.cart.hasItem(product.id);
            }
        });

        if (this.currentBasketView) {
            this.basketItems = items.map((item, index) => {
                const cardTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
                const cardElement = cardTemplate.content.querySelector('.basket__item').cloneNode(true) as HTMLElement;
                const card = new CardBasket(cardElement, this.events);
                card.render({
                    id: item.id,
                    title: item.title,
                    price: item.price !== null ? item.price : 0,
                    index: index + 1
                });
                return card;
            });

            this.currentBasketView.render({
                items: this.basketItems.map(item => item.container),
                total,
                buttonDisabled: items.length === 0 || !hasValidItems,
                isEmpty
            });
        }
    }

    private handleBuyerChanged() {
        const validation = this.buyer.validate();

        if (this.currentOrderForm) {
            const errors: string[] = [];
            if (!validation.fields.payment) errors.push('Выберите способ оплаты');
            if (!validation.fields.address) errors.push('Укажите адрес доставки');

            this.currentOrderForm.setValidation(errors, {
                payment: validation.fields.payment,
                address: validation.fields.address
            });
        }

        if (this.currentContactsForm) {
            const errors: string[] = [];
            if (!validation.fields.email) {
                errors.push(this.buyer.email.trim() ? 'Некорректный формат email' : 'Email не указан');
            }
            if (!validation.fields.phone) {
                errors.push(this.buyer.phone.trim() ? 'Некорректный формат телефона' : 'Телефон не указан');
            }

            this.currentContactsForm.setValidation(errors, {
                email: validation.fields.email,
                phone: validation.fields.phone
            });
        }
    }

    private handleCardSelect(data: { id: string }) {
        const product = this.catalog.getProductById(data.id);
        if (product) {
            this.catalog.setSelectedProduct(product);
            this.events.emit('catalog:selected');
        }
    }

    private handleAddToBasket() {
        const product = this.catalog.getSelectedProduct();
        if (product) {
            this.cart.addItem(product);
            this.events.emit('cart:changed');
            this.modal.close();
        }
    }

    private handleRemoveFromBasket(data: { id: string }) {
        this.cart.removeItem(data.id);
        this.events.emit('cart:changed');
    }

    private handleOpenBasket() {
        const items = this.cart.getItems();
        const total = this.cart.getTotalPrice();
        const hasValidItems = total > 0;
        const isEmpty = items.length === 0;

        this.basketItems = items.map((item, index) => {
            const cardTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
            const cardElement = cardTemplate.content.querySelector('.basket__item').cloneNode(true) as HTMLElement;
            const card = new CardBasket(cardElement, this.events);
            card.render({
                id: item.id,
                title: item.title,
                price: item.price !== null ? item.price : 0,
                index: index + 1
            });
            return card;
        });

        const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
        const basketElement = basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
        const basketView = new BasketView(basketElement, this.events);

        basketView.render({
            items: this.basketItems.map(item => item.container),
            total,
            buttonDisabled: items.length === 0 || !hasValidItems,
            isEmpty
        });

        this.currentBasketView = basketView;
        this.modal.open(basketView.container);
    }

    private handleCardClose() {
        this.modal.close();
    }

    private handleOrderStart() {
        const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
        const orderElement = orderTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
        const orderForm = new OrderForm(orderElement, this.events);

        this.currentOrderForm = orderForm;
        this.currentContactsForm = null;

        if (this.buyer.payment === null) {
            this.buyer.payment = 'card';
        }

        orderForm.setInitialData({
            payment: this.buyer.payment,
            address: this.buyer.address
        });

        // Принудительная первоначальная валидация
        const validation = this.buyer.validate();
        const errors: string[] = [];
        if (!validation.fields.payment) errors.push('Выберите способ оплаты');
        if (!validation.fields.address) errors.push('Укажите адрес доставки');

        orderForm.setValidation(errors, {
            payment: validation.fields.payment,
            address: validation.fields.address
        });

        this.modal.open(orderForm.container);
    }

    private handlePaymentSelect(data: { payment: 'card' | 'cash' }) {
        this.buyer.payment = data.payment;
        this.events.emit('buyer:changed');
    }

    private handleAddressChange(data: { address: string }) {
        this.buyer.address = data.address;
        this.events.emit('buyer:changed');
    }

    private handleContactsChange(data: { field: 'email' | 'phone', value: string }) {
        if (data.field === 'email') {
            this.buyer.email = data.value;
        } else {
            this.buyer.phone = data.value;
        }
        this.events.emit('buyer:changed');
    }

    private async handleOrderSubmit() {
        const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
        const contactsElement = contactsTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
        const contactsForm = new ContactsForm(contactsElement, this.events);

        this.currentContactsForm = contactsForm;
        this.currentOrderForm = null;

        contactsForm.render({
            email: this.buyer.email,
            phone: this.buyer.phone
        });

        const validation = this.buyer.validate();
        const errors: string[] = [];
        if (!validation.fields.email) {
            errors.push(this.buyer.email.trim() ? 'Некорректный формат email' : 'Email не указан');
        }
        if (!validation.fields.phone) {
            errors.push(this.buyer.phone.trim() ? 'Некорректный формат телефона' : 'Телефон не указан');
        }

        contactsForm.setValidation(errors, {
            email: validation.fields.email,
            phone: validation.fields.phone
        });

        this.modal.open(contactsForm.container);
    }

    private async handleContactsSubmit() {
        try {
            const buyerData = this.buyer.getData();
            const sellableItems = this.cart.getItems().filter(item => item.price !== null);
            const orderData = {
                ...buyerData,
                total: sellableItems.reduce((sum, item) => sum + item.price!, 0),
                items: sellableItems.map(item => item.id)
            };

            const response = await this.api.sendOrder(orderData);

            this.cart.clear();
            this.buyer.clear();

            this.page.counter = 0;

            const successTemplate = document.getElementById('success') as HTMLTemplateElement;
            const successElement = successTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
            const successView = new SuccessView(successElement, this.events);
            successView.render({ total: response.total });
            this.modal.open(successView.container);
        } catch (error) {
            console.error('Ошибка при оформлении заказа:', error);
        }
    }

    private handleSuccessClose() {
        this.currentOrderForm = null;
        this.currentContactsForm = null;
        this.currentBasketView = null;
        this.modal.close();
    }

    private handleAddToCart(data: { id: string }) {
        const product = this.catalog.getProductById(data.id);
        if (product && product.price !== null) {
            this.cart.addItem(product);
            this.events.emit('cart:changed');
        }
    }

    private handleRemoveFromCart(data: { id: string }) {
        this.cart.removeItem(data.id);
        this.events.emit('cart:changed');
    }

    private handleModalClose() {
        this.currentOrderForm = null;
        this.currentContactsForm = null;
        this.currentBasketView = null;
    }
}