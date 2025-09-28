import { IProduct } from '../../types';

export class ShoppingCart {
    private _items: IProduct[] = [];

    constructor(private events: IEvents) {}

    getItems(): IProduct[] {
        return [...this._items];
    }

    addItem(product: IProduct): void {
        this._items.push(product);
        this.events.emit('cart:changed');
    }

    removeItem(id: string): void {
        const index = this._items.findIndex(item => item.id === id);
        if (index !== -1) {
            this._items.splice(index, 1);
        }
        this.events.emit('cart:changed');
    }

    clear(): void {
        this._items = [];
        this.events.emit('cart:changed');
    }

    getTotalPrice(): number {
        return this._items
            .filter(item => item.price !== null)
            .reduce((sum, item) => sum + (item.price as number), 0);
    }

    getItemCount(): number {
        return this._items.length;
    }

    hasItem(id: string): boolean {
        return this._items.some(item => item.id === id);
    }
}