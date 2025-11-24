# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

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
npm run start
```

или

```
yarn
yarn start
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
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.


## Данные


### Интерфейсы данных

#### Интерфейс IProduct
Является интерфейсом данных для всех товаров.

Структура:
`id: string` - ID товара
`description: string` - подробное описание товара
`image: string` - картинка / фото товара
`title: string` - название товара
`category: string` - название группы / категории товара
`price: number | null` - цена товара


#### Интерфейс IBuyer
Интерфейс данных по покупателю

Структура:
`payment: TPayment` - способ оплаты
`email: string` - email покупателя
`phone: string` - телефон покупателя
`address: string` - адрес доставки


### Классы данных

#### Класс Сatalog
Класс каталога. Хранит массив котолога и товар для подробного отображения

содержит методы:
    Сеттер `allProducts(products: IProduct[])` - сохранение массива товаров полученного в параметрах метода;
    Геттер `allProducts(): IProduct[]` - получение массива товаров из модели;
    `getProduct(id: string): IProduct | undefined` - получение одного товара по его id;
    Сеттер `detailedProduct(product: IProduct)` - сохранение товара для подробного отображения;
    Геттер `detailedProduct(): IProduct | null` - получение товара для подробного отображения.


#### Класс Basket
Класс карзины. Работает с данными желаемой покупке. Хранит информацию о выбранных товарах. Дает инвормоцию о их количестве, общей сумме.

методы:
    Геттер `getListOfProductsToBuy(): IProduct[]` - получение массива товаров, которые находятся в корзине;
    `addToBuyList(product: IProduct):void` - добавление товара, который был получен в параметре, в массив корзины;
    `removeToBuyList(product: IProduct):void` - удаление товара, полученного в параметре из массива корзины;
    `clearToBuyList():void` - очистка корзины;
    Геттер `priseToPay(): number` - получение стоимости всех товаров в корзине;
    Геттер `productCounter(): number` - получение количества товаров в корзине;
    `checkProductById(id: string): boolean` - проверка наличия товара в корзине по его id, полученного в параметр метода.


#### Класс Buyer
Класс покупателя. Хранит данные о покупателе и проверят недостоющую информацию

хранит следующие данные:
    `payment: TPayment` - вид оплаты;
    `email: string` - адреc;
    `phone: string` - телефон;
    `address: string` - email.
методы:
    `setValue(fieldName: keyof IBuyer, value: string | TPayment): void` - один общий метод сохранения данных в модели. Принимает ключ и его значение;
    `getAllData(): IBuyer` - получение всех данных покупателя;
    `clearAllData(): void` - очистка данных покупателя;
    `validate(): { [key: string]: string }` - валидация данных. Поле является валидным, если оно не пустое. Метод возвращает объект. В объекте находяться поля, соответствующие полям класса, значениями у которых текст ошибки. Поля без ошибок отсутствуют.


## Слой коммуникации

#### Класс ApiConnect

Класс связи и получения данных с сервера

Методы:
`getProduct(): Promise<IProduct[]>` - получает Promise с массивом товаров
`postProduct(chek: IInfoCheckToBuy): Promise<IOrderResponsePrise | IErrorResponsePrise>` - передает данные о покупателе и выбранных товарах для сверки с сервером, и возвращает Promise с информацией, или Promise с причиной ошибки


## Слой представления


#### Класс Modal

DOM элемент для отображения полученых обьектов

    constructor(protected events: IEvents)

Ивенты для кнопки:
    ('modal:close')

Методы:
        open() - открыть окно
        close() - закрыть окно
        addContent(content: HTMLElement) - добавить контент
        clear() - очистить контунт


#### Класс Gallery

Класс отображения элементов каталога товаров

    constructor(protected events: IEvents)

Методы:
        set gallery(items: HTMLElement) - добавить элемент к галерее



#### Класс TemplateBasket

Элемент для отображения корзины покупок

    constructor(protected events: IEvents)

Ивенты для кнопки:
    ('order:ready')

содержит методы:

    basketList(items: HTMLElement[]) - массив элемнтов товаров для отображения
    set prise (prise: number) - установить сумму
    set basketIsEmpty (boolean: boolean) - отключить кнопку
    render(data?: Partial<T>): HTMLElement - Вернуть корневой DOM-элемент


#### Класс TemplateCardCatalog

Класс отображени внешнего вида товаров в каталоге

constructor(protected events: IEvents)

Ивенты для кнопки:
    ('card:open', {id: this.container.id})

содержит методы:

    set cardImage (src: string) - установить картинку
    set cardCategory (category: string) - установить категорию
    set cardPrice (value: string) - установить цену
    set cardTitle (name: string) - название
    set cardId (Id: string) - id товара
    render(data?: Partial<T>): HTMLElement - Вернуть корневой DOM-элемент

#### Класс TemplateCardSelected

Класс отображени выбранного товара

constructor(protected events: IEvents)

Ивенты для кнопки:
    ('card:inBasket', {id: this.container.id});

содержит методы:

    set cardImage (src: string) - установить картинку
    set cardCategory (category: string) - установить категорию
    set cardPrice (value: string) - установить цену
    set cardTitle (name: string) - название
    set cardId (Id: string) - id товара
    set cardDescription (text: string)- установить описание
    set buttonText(text: string) - текст кнопки покупки
    set disabledButtonCard(boolean: boolean) - отключить кнопку покупки
    render(data?: Partial<T>): HTMLElement - Вернуть корневой DOM-элемент


#### Класс TemplateCardBasket

Класс отображени товаров в корзине

constructor(protected events: IEvents)

Ивенты для кнопки:
    ('card:remove', {id: this.container.id})

содержит методы:

    set cardIndex (src: string) - номер в списке корзины
    set cardPrice (value: string) - установить цену
    set cardTitle (name: string) - название
    set cardId (Id: string) - id товара
    render(data?: Partial<T>): HTMLElement - Вернуть корневой DOM-элемент


#### Класс Header

Класс для работы с шапкой сайта

constructor(protected events: IEvents)

Ивенты для кнопки:
    ('basket:open')

содержит методы:

    set counter(value: number) - установить значок количество товаров в карзине


#### Класс TemplateOrder

Класс для работы с ипутами формы адреса и способа оплаты

constructor(protected events: IEvents)

Ивенты для кнопки:
    ('order:buttonActive', {name: button.name})
    ('order:inputAddress', {address: this._address.value})
    ('order:nextForm')

содержит методы:

    set address (text: string) - установить адресс
    set paiment (text: string) - установить способ оплаты
    set disabledButtonOrder (boolean: boolean) - отключить кнопку
    set infoErrors (text: string) - установить ошибку валидации
    render(data?: Partial<T>): HTMLElement - Вернуть корневой DOM-элемент


#### Класс TemplateContacts

Класс для работы с ипутами формы телефона и емайли

constructor(protected events: IEvents)

Ивенты для кнопки:
    ('order:inputEmail', {email: this._email.value})
    ('order:inputPhone', {phone: this._phone.value})
    ('order:doneForm')

содержит методы:

    set email (text: string) - установить емайл
    set phone (text: string) - установить телефон
    set disabledButtonOrder (boolean: boolean) - отключить кнопку
    set infoErrors (text: string) - установить ошибку валидации
    render(data?: Partial<T>): HTMLElement - Вернуть корневой DOM-элемент


#### Класс TemplateSuccess

Класс формы успешной покупки

constructor(protected events: IEvents)

Ивенты для кнопки:
    ('modal:close')

содержит методы:

    set totalPrice (value: number) - полученную итоговую
    render(data?: Partial<T>): HTMLElement - Вернуть корневой DOM-элемент
