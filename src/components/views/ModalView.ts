import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class ModalView extends Component<{}> {
    private _content: HTMLElement;

    constructor(container: HTMLElement, private events: IEvents) {
        super(container);

        this._content = container.querySelector('.modal__content')!;

        const closeBtn = container.querySelector('.modal__close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.close();
            });
        }

        container.addEventListener('click', (e) => {
            if (e.target === container) {
                this.close();
            }
        });
    }

    open(content: HTMLElement) {
        this._content.innerHTML = '';
        this._content.appendChild(content);
        this.container.classList.add('modal_active');
    }

    close() {
        this.container.classList.remove('modal_active');
    }
}