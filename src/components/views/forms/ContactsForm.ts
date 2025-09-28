import { FormView } from './FormView';
import { IBuyer } from '../../../types';

export class ContactsForm extends FormView<IBuyer> {
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;
    private _currentEmail: string = '';
    private _currentPhone: string = '';

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this._email = container.querySelector('.form__input[name="email"]');
        this._phone = container.querySelector('.form__input[name="phone"]');

        this._email.addEventListener('input', () => {
            this._currentEmail = this._email.value;
            this.events.emit('contacts:change', {
                field: 'email',
                value: this._currentEmail
            });
            this.validate();
        });

        this._phone.addEventListener('input', () => {
            this._currentPhone = this._phone.value;
            this.events.emit('contacts:change', {
                field: 'phone',
                value: this._currentPhone
            });
            this.validate();
        });
    }

    private validate() {
        const errors: string[] = [];

        if (!this.isValidEmail(this._currentEmail)) {
            errors.push('Некорректный email');
        }

        if (!this.isValidPhone(this._currentPhone)) {
            errors.push('Некорректный телефон');
        }

        this.errors = errors.join('<br>');
        this.valid = errors.length === 0;
    }

    private isValidEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    private isValidPhone(phone: string): boolean {
        return /^\+?[\d\s\-\(\)]{10,}$/.test(phone);
    }

    set email(value: string) {
        this._currentEmail = value;
        this._email.value = value;
        this.validate();
    }

    set phone(value: string) {
        this._currentPhone = value;
        this._phone.value = value;
        this.validate();
    }

    set emailValid(valid: boolean) {
        this.toggleClass(this._email, 'form__input_invalid', !valid);
    }

    set phoneValid(valid: boolean) {
        this.toggleClass(this._phone, 'form__input_invalid', !valid);
    }
}