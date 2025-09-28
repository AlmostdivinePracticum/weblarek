# Проектная работа "Веб-ларек"

**Стек**: HTML, SCSS, TypeScript, Vite  
  
**Архитектура**: MVP (Model-View-Presenter)  
- Model — управляет данными и бизнес-логикой
- View — отвечает за отображение данных, не содержит логики
- Presenter — посредник между Model и View, обрабатывает события и управляет потоком данных  
  
**Состояние**: 
- Реализован слой Model
- Реализован слой View
- Реализован слой Presenter

### Структура проекта (затронутые файлы)

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом
- src/components/views/ — папка с вью

```
src/
├── ... 
├── main.ts                 — точка входа приложения
├── types/
│   └── index.ts            — типы данных
├── utils/
│   ├── constants.ts        — константы
│   └── utils.ts            — утилиты
├── presenter/
│   └── AppPresenter.ts     — презентер        
├── components/
│   ├── base/               — базовые классы
│   │   ├── Component.ts
│   │   ├── Api.ts
│   │   └── Events.ts
│   ├── Models/             — модели данных
│   │   ├── ProductCatalog.ts
│   │   ├── ShoppingCart.ts
│   │   └── Buyer.ts
│   ├── views/              — вьюшки
│   │   ├── cards/          — папка в вью карточек
│   │   ├── forms/          — папка в вью форм
│   │   ├── BasketView.ts
│   │   ├── Gallery.ts
│   │   ├── ModalView.ts
│   │   └── SuccessView.ts
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
- src/presenter/AppPresenter.ts - файл с реализацией презентера

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


### Компоненты слоя View
#### Базовые классы:
##### Component\<T\> (`src/components/base/Component.ts`)
Базовый абстрактный класс для всех компонентов представления.  
Ответственность: инкапсуляция работы с DOM.  

Методы:
- `render(data?: Partial<T>)` — основной метод отображения  
- `setText(element: HTMLElement, value: string)` — установка текстового содержимого  
- `setImage(element: HTMLImageElement, src: string, alt?: string)` — работа с изображениями  
- `setDisabled(element: HTMLElement, state: boolean)` — управление состоянием disabled  
- `toggleClass(element: HTMLElement, className: string, force?: boolean)` — работа с CSS-классами  

##### FormView\<T\> (`src/components/views/forms/FormView.ts`)
Базовый класс для всех форм.  
Наследники: `OrderForm`, `ContactsForm`  
Ответственность: общая логика форм (обработка submit, управление кнопкой отправки, отображение ошибок).  
Методы:  
- `set valid(value: boolean)` — управление состоянием кнопки отправки  
- `set errors(value: string)` — отображение сообщений об ошибках  

##### CardView (`src/components/views/cards/CardView.ts`)
Базовый класс для всех карточек товаров.  
Наследники: `CardCatalog`, `CardPreview`, `CardBasket`.
Ответственность: общая логика отображения карточек (заголовок, изображение, категория, цена).  

#### Конкретные компоненты: 
##### Gallery (`src/components/views/Gallery.ts`)  
Шаблон: используется контейнер .gallery из index.html  
Ответственность: отображение списка карточек товаров в каталоге.  
Свойства:  
- `items: HTMLElement[]` — массив карточек для отображения  

##### CardCatalog (`src/components/views/cards/CardCatalog.ts`)
Шаблон: #card-catalog.  
Ответственность: карточка товара в каталоге.  
Особенности:  
- Вся карточка является кликабельной областью
- При клике генерирует событие card:select
- Отображает цену как «Бесценно» при `price: null`


##### CardPreview (`src/components/views/cards/CardPreview.ts`)
Шаблон: #card-preview  
Ответственность: детальный просмотр товара в модальном окне  
Особенности:  
- Содержит кнопку «Купить»/«Удалить из корзины»/«Недоступно»
- При клике на кнопку генерирует соответствующие события
- После действия автоматически закрывает модальное окно

##### CardBasket (`src/components/views/cards/CardBasket.ts`)
Шаблон: #card-basket  
Ответственность: элемент товара в корзине  
Особенности:  
- Отображает порядковый номер товара
- Содержит кнопку удаления
- При клике на кнопку генерирует событие `basket:remove`

##### BasketView (src/components/views/BasketView.ts)
Шаблон: #basket  
Ответственность: модальное окно корзины  
Свойства:  
- `items: HTMLElement[]` — список товаров в корзине
- `total: number` — общая сумма
- `buttonDisabled: boolean` — состояние кнопки «Оформить»
- `isEmpty: boolean` — признак пустой корзины (отображает «Корзина пуста»)

##### OrderForm (`src/components/views/forms/OrderForm.ts`)
Шаблон: #order  
Ответственность: форма выбора способа оплаты и адреса доставки  
Особенности:  
- Валидация в реальном времени
- Отображение ошибок при пустых полях
- Управление активностью кнопки «Далее»

##### ContactsForm (`src/components/views/forms/ContactsForm.ts`)
Шаблон: #contacts  
Ответственность: форма ввода контактных данных  
Особенности:  
- Валидация email и телефона по формату
- Отображение ошибок при некорректных данных
- Управление активностью кнопки «Оплатить»

##### SuccessView (`src/components/views/SuccessView.ts`)
Шаблон: #success  
Ответственность: окно успешного оформления заказа  
Особенности:  
- Отображает итоговую сумму списания
- При клике на кнопку генерирует событие `success:close`

##### ModalView (`src/components/views/ModalView.ts`)
Шаблон: .modal (уже в DOM)  
Ответственность: управление модальным окном  
Особенности:   
- Не наследуется другими классами
- Управляет видимостью через класс `modal_active`
- Обрабатывает закрытие по кнопке «X» и клику вне модалки

### Слой Презентера

AppPresenter (`src/presenter/AppPresenter.ts`)

Ответственность: координация взаимодействия между Model и View.

Основные функции:
- Подписка на события от Model и View
- Обработка действий пользователя
- Обновление данных в Model
- Обновление состояния View
- Управление модальными окнами
- Валидация данных перед отправкой на сервер

#### Обрабатываемые события:

##### От моделей:

- `catalog:changed` — обновление каталога товаров
- `catalog:selected` — выбор товара для просмотра
- `cart:changed` — изменение содержимого корзины
- `buyer:changed` — изменение данных покупателя

##### От представлений:

- `card:select` — выбор карточки в каталоге
- `card:add-to-cart` — добавление товара в корзину
- `card:remove-from-cart` — удаление товара из корзины
- `header:basket-click` — открытие корзины
- `basket:order` — начало оформления заказа
- `order:payment` — выбор способа оплаты
- `order:address` — изменение адреса доставки
- `contacts:change` — изменение контактных данных
- `OrderForm:submit` — отправка формы заказа
- `ContactsForm:submit` — отправка формы контактов
- `success:close` — закрытие окна успеха

##### Особенности реализации:
- Использует инверсию зависимостей — все зависимости передаются через конструктор
- Обеспечивает полную изоляцию слоёв
- Обрабатывает ошибки при работе с API
- Фильтрует недоступные товары (`price: null`) при отправке заказа
- Обеспечивает валидацию данных на всех этапах

#### События приложений

| Событие               | Источник         | Назначение                             |
|-----------------------|------------------|----------------------------------------|
| `catalog:changed`     | `ProductCatalog` | Обновление каталога товаров            |
| `catalog:selected`    | `ProductCatalog` | Выбор товара для детального просмотра  |
| `cart:changed`        | `ShoppingCart`   | Изменение содержимого корзины          |
| `buyer:changed`       | `Buyer`           | Изменение данных покупателя            |
| `card:select`         | `CardCatalog`     | Клик по карточке в каталоге            |
| `card:add-to-cart`    | `CardPreview`     | Добавление товара в корзину            |
| `card:remove-from-cart` | `CardPreview`     | Удаление товара из корзины             |
| `header:basket-click` | `main.ts`         | Клик по иконке корзины в хедере        |
| `basket:remove`       | `CardBasket`      | Удаление товара из корзины (из списка) |
| `basket:order`        | `BasketView`      | Нажатие кнопки «Оформить»              |
| `order:payment`       | `OrderForm`       | Выбор способа оплаты                   |
| `order:address`        | `OrderForm`       | Изменение адреса доставки              |
| `contacts:change`      | `ContactsForm`     | Изменение контактных данных            |
| `OrderForm:submit`     | `OrderForm`        | Отправка формы заказа|
| `ContactsForm:submit`  | `ContactsForm`     | Отправка формы контактов |
| `success:close` | `SuccessView` | Закрытие окна успеха |
| `modal:close` |  `CardPreview` | Закрытие модального окна после действия | 




