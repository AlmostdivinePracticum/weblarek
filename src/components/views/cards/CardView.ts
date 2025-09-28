import { Component } from '../../base/Component';
import { IProduct } from '../../../types';
import { categoryMap } from '../../../utils/constants';

export abstract class CardView extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this._title = container.querySelector('.card__title');
        this._image = container.querySelector('.card__image');
        this._category = container.querySelector('.card__category');
        this._price = container.querySelector('.card__price');
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set image(value: string) {
        this.setImage(this._image, value, this._title.textContent);
    }

    set category(value: string) {
        this.setText(this._category, value);
        const cssClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
        this._category.className = `card__category ${cssClass}`;
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
        } else {
            this.setText(this._price, `${value} синапсов`);
        }
    }
}