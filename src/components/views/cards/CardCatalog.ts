import { CardView } from './CardView';
import { IEvents } from '../../base/Events';

export class CardCatalog extends CardView {

    constructor(container: HTMLElement, private events: IEvents) {
        super(container);

        container.addEventListener('click', () => {
            this.events.emit('card:select', { id: container.dataset.id });
        });
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }
}