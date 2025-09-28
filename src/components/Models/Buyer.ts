import { IBuyer, TPayment } from '../../types';

export class Buyer {
    private _payment: TPayment | null = null;
    private _address: string = '';
    private _phone: string = '';
    private _email: string = '';

    constructor(private events: IEvents) {}

    setAllData(data: IBuyer): void {
        this._payment = data.payment;
        this._address = data.address;
        this._phone = data.phone;
        this._email = data.email;
        this.events.emit('buyer:changed');
    }

    set payment(value: TPayment) {
        this._payment = value;
        this.events.emit('buyer:changed');
    }

    set address(value: string) {
        this._address = value;
        this.events.emit('buyer:changed');
    }

    set phone(value: string) {
        this._phone = value;
        this.events.emit('buyer:changed');
    }

    set email(value: string) {
        this._email = value;
        this.events.emit('buyer:changed');
    }

    getData(): IBuyer {
        if (this._payment === null) {
            throw new Error('Не выбран способ оплаты');
        }
        return {
            payment: this._payment,
            address: this._address,
            phone: this._phone,
            email: this._email,
        };
    }

    clear(): void {
        this._payment = null;
        this._address = '';
        this._phone = '';
        this._email = '';
    }

    validate(): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!this._payment) {
            errors.push('Способ оплаты не выбран');
        }

        if (!this._address.trim()) {
            errors.push('Адрес не указан');
        }

        if (!this._phone.trim()) {
            errors.push('Телефон не указан');
        } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(this._phone)) {
            errors.push('Некорректный формат телефона');
        }

        if (!this._email.trim()) {
            errors.push('Email не указан');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this._email)) {
            errors.push('Некорректный формат email');
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }
}