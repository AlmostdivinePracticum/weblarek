import { FormView } from './FormView';
import { IBuyer } from '../../../types';
import { IEvents } from '../../base/Events';

export class OrderForm extends FormView<IBuyer> {
    protected _paymentButtons: HTMLButtonElement[];
    protected _address: HTMLInputElement;
    protected _errors: HTMLElement;
    private _currentPayment: 'card' | 'cash' | null = null;
    private _currentAddress: string = '';

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this._paymentButtons = Array.from(container.querySelectorAll('.order__buttons .button_alt'));
        this._address = container.querySelector('.form__input')!;
        this._errors = container.querySelector('.form__errors')!;

        this._paymentButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const payment = button.getAttribute('name') as 'card' | 'cash';
                if (payment) {
                    this._currentPayment = payment;
                    this.events.emit('order:payment', { payment });

                    this._paymentButtons.forEach(btn => {
                        btn.classList.toggle('button_alt-active', btn === button);
                    });
                    this.validate();
                }
            });
        });

        this._address.addEventListener('input', () => {
            this._currentAddress = this._address.value;
            this.events.emit('order:address', { address: this._currentAddress });
            this.validate();
        });
    }

    private validate() {
        const errors: string[] = [];

        if (this._currentPayment === null) {
            errors.push('Выберите способ оплаты');
        }

        if (this._currentAddress.trim() === '') {
            errors.push('Укажите адрес доставки');
        }

        this.errors = errors.join('<br>');
        this.valid = errors.length === 0;
    }

    set payment(value: 'card' | 'cash') {
        this._currentPayment = value;
        this._paymentButtons.forEach(btn => {
            const btnName = btn.getAttribute('name');
            if (btnName === value) {
                btn.classList.add('button_alt-active');
            } else {
                btn.classList.remove('button_alt-active');
            }
        });
        this.validate();
    }

    set address(value: string) {
        this._currentAddress = value;
        this._address.value = value;
        this.validate();
    }

    set addressValid(valid: boolean) {
        this.toggleClass(this._address, 'form__input_invalid', !valid);
    }

    render(data?: Partial<IBuyer>) {
        if (data) {
            Object.assign(this as object, data);
        } else {
            this.payment = 'card';
            this.address = this._address.value || '';
        }
        return this.container;
    }

    setInitialData(data: Partial<IBuyer>) {
        if (data.payment) {
            this.payment = data.payment;
        }
        if (data.address !== undefined) {
            this.address = data.address;
        }
    }
}