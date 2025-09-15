import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { IProduct, IBuyer, TPayment } from './types';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { ShoppingCart } from './components/Models/ShoppingCart';
import { Buyer } from './components/Models/Buyer';
import { Api } from './components/base/Api';
import { LarekAPI } from './components/Api/LarekAPI';
import { API_URL } from './utils/constants'

// ========================================================
// Тестирование ProductCatalog
// ========================================================

console.group('Тестирование ProductCatalog');
const catalog = new ProductCatalog();

// Сохраняем товары
catalog.setProducts(apiProducts.items);
console.log('Сохранили товары в каталог:', apiProducts.items.length, 'шт.');

// Получаем все товары
const allProducts = catalog.getProducts();
console.log('Все товары из каталога:', allProducts);

let foundProduct: IProduct | undefined;
const firstProductId = allProducts[0]?.id;
if (firstProductId) {
    foundProduct = catalog.getProductById(firstProductId);
    console.log('Найден товар по ID', firstProductId, ':', foundProduct);
}

// Устанавливаем выбранный товар
if (foundProduct) {
    catalog.setSelectedProduct(foundProduct);
    console.log('Установлен выбранный товар для просмотра:', catalog.getSelectedProduct());
}

console.groupEnd();

// ========================================================
// Тестирование ShoppingCart
// ========================================================

console.group('Тестирование ShoppingCart');
const cart = new ShoppingCart();

// Добавляем первые 2 товара в корзину
const product1 = allProducts[0];
const product2 = allProducts[1];

if (product1 && product2) {
    cart.addItem(product1);
    cart.addItem(product2);
    console.log('Добавили 2 товара в корзину');
}

// Проверяем содержимое корзины
console.log('Товары в корзине:', cart.getItems());

// Проверяем наличие товара по id
console.log(`Есть ли товар с id "${product1?.id}" в корзине?`, cart.hasItem(product1?.id || ''));

// Считаем общую стоимость
console.log('Общая стоимость:', cart.getTotalPrice());

// Считаем количество товаров
console.log('Количество товаров в корзине:', cart.getItemCount());

// Удаляем один товар
if (product1) {
    cart.removeItem(product1.id);
    console.log(`Удалили товар с id "${product1.id}"`);
}

// Проверяем после удаления
console.log('Товары в корзине после удаления:', cart.getItems());
console.log('Количество после удаления:', cart.getItemCount());

// Очищаем корзину
cart.clear();
console.log('Корзина очищена. Товаров:', cart.getItemCount());

console.groupEnd();

// ========================================================
// Тестирование Buyer
// ========================================================

console.group('Тестирование Buyer');
const buyer = new Buyer();

// Данные покупателя для теста
const testBuyerData: IBuyer = {
    payment: 'card',
    email: 'test@example.com',
    phone: '+7 (999) 123-45-67',
    address: 'ул. Тестовая, д. 1'
};

// Сохраняем все данные
buyer.setAllData(testBuyerData);
console.log('Сохранили данные покупателя:', buyer.getData());

// Проверяем сеттеры
buyer.payment = 'cash';
buyer.email = 'updated@example.com';
console.log('Обновили payment и email:', buyer.getData());

// Валидация
const validation = buyer.validate();
console.log('Валидация данных:', validation);

// Проверим валидацию с ошибками
buyer.email = 'invalid-email';
buyer.phone = '';
const invalidValidation = buyer.validate();
console.log('Валидация с ошибками:', invalidValidation);

// Очищаем данные
buyer.clear();
console.log('Данные покупателя очищены');

// Попробуем получить данные — должно быть исключение
try {
    buyer.getData();
} catch (err) {
    console.log('Ожидаемая ошибка при попытке получить данные после очистки:', (err as Error).message);
}

console.groupEnd();

// ========================================================
// Тестирование работы с API
// ========================================================


console.group('Загрузка данных с сервера');

// Создаём экземпляр API
const api = new Api(API_URL);

// Создаём наш коммуникационный слой
const larekApi = new LarekAPI(api);

// Создаём модель каталога
const productCatalog = new ProductCatalog();

// Загружаем товары с сервера
larekApi.getProducts()
    .then(products => {
        console.log('Получено товаров с сервера:', products.length);

        // Сохраняем в модель
        productCatalog.setProducts(products);
        console.log('Каталог сохранён в ProductCatalog');

        // Проверяем содержимое модели
        const storedProducts = productCatalog.getProducts();
        console.log('Товары в каталоге после загрузки:', storedProducts);
    })
    .catch(err => {
        console.error('Ошибка при загрузке товаров:', err);
    })
    .finally(() => {
        console.groupEnd();
        console.log('Все тесты моделей данных пройдены!');
    });
