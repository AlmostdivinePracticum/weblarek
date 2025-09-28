import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';

export abstract class FormView<T> extends Component<T> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._submit = container.querySelector('button[type="submit"]');
        this._errors = container.querySelector('.form__errors');

        container.addEventListener('submit', (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.events.emit(`${this.constructor.name}:submit`);
        });
    }

    set valid(value: boolean) {
        this.setDisabled(this._submit, !value);
    }

    set errors(value: string) {
        this._errors.innerHTML = value;
    }
}