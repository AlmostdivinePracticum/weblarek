# Проектная работа "Веб-ларек"

**Стек**: HTML, SCSS, TypeScript, Vite  
**Архитектура**: MVP (Model-View-Presenter)  
**Состояние**: Реализован слой Model (часть 1)  

### Структура проекта (затронутые файлы)

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

```
src/
├── ... 
├── main.ts                 — точка входа приложения
├── types/
│   └── index.ts            — типы данных
├── utils/
│   ├── constants.ts        — константы
│   └── utils.ts            — утилиты
├── components/
│   ├── base/               — базовые классы
│   │   ├── Component.ts
│   │   ├── Api.ts
│   │   └── Events.ts
│   ├── Models/             — модели данных
│   │   ├── ProductCatalog.ts
│   │   ├── ShoppingCart.ts
│   │   └── Buyer.ts
│   └── Api/
│       └── LarekAPI.ts     — коммуникационный слой
└── ... 
```

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```
или
```
yarn
yarn dev
```

## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, 
где пользователи могут просматривать товары, добавлять их в корзину и 
оформлять заказы. Сайт предоставляет удобный интерфейс с модальными 
окнами для просмотра деталей товаров, управления корзиной и выбора 
способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), 
которая обеспечивает четкое разделение ответственности между классами слоев Model
и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных. Не знает о представлении. Включает:
- ProductCatalog — каталог товаров
- ShoppingCart — корзина покупок
- Buyer — данные покупателя
- LarekAPI — слой коммуникации с сервером  

View - слой представления, отвечает за отображение данных на странице. Не содержит логики.   
Presenter - посредник, обрабатывает события от View, вызывает методы Model, обновляет View.  

Преимущества:

- Тестируемость — Model можно тестировать без UI.  
- Разделение ответственности — логика не перемешана с отображением.  
- Гибкость — можно менять View, не трогая Model.  

### Базовый код

#### Класс Component (`components/base/Component.ts`)
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
- `constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
- `container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
- `render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
- `setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api (`components/base/Api.ts`)
Содержит в себе базовую логику отправки запросов.

Конструктор:  
- `constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
- `baseUrl: string` - базовый адрес сервера  
- `options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
- `get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
- `post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
- `handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter (`components/base/Events.ts`)
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
- `_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
- `on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
- `emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
- `trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.


### Типы данных

Описаны в файле types/index.ts, расширены типы из стартера.

```
export type TPayment = 'card' | 'cash';

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IOrderRequest {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export interface IOrderResponse {
  id: string;
  total: number;
}
```


### Детальное описание интерфейсов классов

#### ProductCatalog — каталог товаров (`components/Models/ProductCatalog.ts`)

Ответственность:

- Хранит массив всех товаров.
- Хранит выбранный товар для детального просмотра.

Поля: 

- `_products: IProduct[]` — массив всех товаров.  
- `_selectedProduct: IProduct | null` — текущий выбранный товар.  

Конструктор:

- `constructor()`

Методы:

- `setProducts(products: IProduct[]): void` — сохраняет массив товаров.  
- `getProducts(): IProduct[]` — возвращает копию массива.  
- `getProductById(id: string): IProduct | undefined` — поиск по ID.  
- `setSelectedProduct(product: IProduct): void` — устанавливает выбранный товар.  
- `getSelectedProduct(): IProduct | null` — возвращает выбранный товар.  

#### ShoppingCart — корзина покупок (`components/Models/ShoppingCart.ts`)

Ответственность:

- Хранит товары, выбранные пользователем.

Поля:

- `_items: IProduct[]` — массив товаров в корзине.

Конструктор:

- `constructor()`

Методы:

- `getItems(): IProduct[]` — возвращает товары в корзине.  
- `addItem(product: IProduct): void` — добавляет товар.  
- `removeItem(id: string): void` — удаляет товар по ID.  
- `clear(): void` — очищает корзину.  
- `getTotalPrice(): number` — возвращает общую стоимость.  
- `getItemCount(): number` — возвращает количество товаров.  
- `hasItem(id: string): boolean` — проверяет наличие товара по ID.  

#### Buyer — данные покупателя (`components/Models/Buyer.ts`)

Ответственность:

- Хранит: метод оплаты, адрес электронной почты, телефон, адрес.

Поля:

- `_payment: TPayment | null` — метод оплаты.
- `_address: string` — адрес доставки.
- `_phone: string` — телефон.
- `_email: string` — адрес электронной почты.

Конструктор:

- `constructor()`


Методы:

- `setAllData(data: IBuyer): void` — устанавливает все данные.  
- `getData(): IBuyer` — возвращает данные (бросает ошибку, если не заполнены).  
- `clear(): void` — очищает все поля.  
- `validate(): { isValid: boolean; errors: string[] }` — возвращает {isValid: boolean, errors: string[]}.  

Отдельные сеттеры:
- `set payment(value: TPayment)` — возвращает метод оплаты.  
- `set address(value: string)` — возвращает адрес доставки.  
- `set phone(value: string)` — возвращает номер телефона.  
- `set email(value: string)` — возвращает адрес электронной почты.  

#### Коммуникационный слой — LarekAPI (`components/Api/LarekAPI.ts`)

Ответственность:

- Получение товаров с сервера.
- Отправка заказа на сервер.

Использует композицию — принимает в конструкторе api: IApi.

Поля:

- `api: IApi` — экземпляр API для выполнения запросов.

Конструктор:

- `constructor()`

Методы:

- `getProducts(): Promise<IProduct[]>` — GET /product  
- `sendOrder(order: IOrderRequest): Promise<IOrderResponse>` — POST /order  



### Тестирование 

В main.ts выполняется:

- Создание экземпляров всех классов.

```
const catalog = new ProductCatalog();
const cart = new ShoppingCart();
const buyer = new Buyer();
const api = new Api(API_URL);
const larekApi = new LarekAPI(api);
```
- Тестирование всех методов моделей и вывод результатов в console.log:  

  - `catalog.setProducts(apiProducts.items)` → `catalog.getProducts()` → вывод в консоль.  
  - `catalog.getProductById(id)` → поиск первого товара → вывод в консоль.  
  - `catalog.setSelectedProduct()` → `getSelectedProduct()` → вывод в консоль.  
  - `cart.addItem()` → `getItems()` → вывод в консоль.  
  - `cart.hasItem()`, `getTotalPrice()`, `getItemCount()` — протестированы и выведены.  
  - `cart.removeItem()` → повторный вывод содержимого корзины.  
  - `buyer.setAllData(testBuyerData)` → `getData()` → вывод.  
  - Обновление через сеттеры → вывод.
  - `validate()` — успешная и с ошибками → вывод.
  - `buyer.clear()` → попытка `getData()` → перехват ошибки → вывод сообщения.


- Запрос к серверу за товарами:
  Все операции сопровождаются подписанными выводами в консоль для наглядности и проверки.
```
larekApi.getProducts().then(products => {
  productCatalog.setProducts(products);
  console.log('Товары в каталоге после загрузки:', productCatalog.getProducts());
});
```