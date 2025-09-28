import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IBasketView {
    items: HTMLElement[];
    total: number;
    buttonDisabled: boolean;
    isEmpty: boolean;
}

export class BasketView extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _emptyMessage: HTMLElement;

    constructor(container: HTMLElement, private events: IEvents) {
        super(container);
        this._list = container.querySelector('.basket__list')!;
        this._total = container.querySelector('.basket__price')!;
        this._button = container.querySelector('.basket__button')!;
        this._emptyMessage = container.querySelector('.basket__empty')!;

        this._button.addEventListener('click', () => {
            this.events.emit('basket:order');
        });
    }

    set items(items: HTMLElement[]) {
        this._list.replaceChildren(...items);
    }

    set total(value: number) {
        this.setText(this._total, `Итого: ${value} синапсов`);
    }

    set buttonDisabled(value: boolean) {
        this.setDisabled(this._button, value);
    }

    set isEmpty(value: boolean) {
        this._list.style.display = value ? 'none' : '';
        this._emptyMessage.style.display = value ? '' : 'none';
    }
}