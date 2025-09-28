import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface ISuccessView {
    total: number;
}

export class SuccessView extends Component<ISuccessView> {
    protected _description: HTMLElement;
    protected _close: HTMLElement;

    constructor(container: HTMLElement, private events: IEvents) {
        super(container);
        this._description = container.querySelector('.order-success__description');
        this._close = container.querySelector('.order-success__close');

        this._close.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    set total(value: number) {
        this.setText(this._description, `Списано ${value} синапсов`);
    }
}