import { Component } from '../../base/Component';
import { IProduct } from '../../../types';
import { IEvents } from '../../base/Events';

export class CardBasket extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _index: HTMLElement;

    constructor(container: HTMLElement, private events: IEvents) {
        super(container);
        this._title = container.querySelector('.card__title');
        this._price = container.querySelector('.card__price');
        this._button = container.querySelector('.basket__item-delete');
        this._index = container.querySelector('.basket__item-index');

        this._button.addEventListener('click', () => {
            this.events.emit('basket:remove', { id: container.dataset.id });
        });
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number) {
        if (value === 0) {
            this.setText(this._price, 'Бесценно');
        } else {
            this.setText(this._price, `${value} синапсов`);
        }
    }

    set index(value: number) {
        this.setText(this._index, String(value));
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }
}