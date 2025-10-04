import { FormView } from './FormView';
import { IBuyer } from '../../../types';

export class ContactsForm extends FormView<IBuyer> {
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this._email = container.querySelector('.form__input[name="email"]');
        this._phone = container.querySelector('.form__input[name="phone"]');

        this._email.addEventListener('input', () => {
            this.events.emit('contacts:change', {
                field: 'email',
                value: this._email.value
            });
        });

        this._phone.addEventListener('input', () => {
            this.events.emit('contacts:change', {
                field: 'phone',
                value: this._phone.value
            });
        });
    }

    set email(value: string) {
        this._email.value = value;
    }

    set phone(value: string) {
        this._phone.value = value;
    }

    set emailValid(valid: boolean) {
        this.toggleClass(this._email, 'form__input_invalid', !valid);
    }

    set phoneValid(valid: boolean) {
        this.toggleClass(this._phone, 'form__input_invalid', !valid);
    }

    setValidation(errors: string[], fields: { email: boolean; phone: boolean }) {
        this.errors = errors.join('<br>');
        this.valid = errors.length === 0;
        this.emailValid = fields.email;
        this.phoneValid = fields.phone;
    }
}