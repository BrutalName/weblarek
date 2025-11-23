export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export type TPayment = 'card' | 'cash' | ''

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

interface ITotal {
    total: number;
}

interface IId {
    id: string;
}

interface IItemPriceAndTitle {
    price: number | null;
    title: string;
}

interface IItemCategoryAndImage {
    category: string;
    image: string;
}

export interface IItem extends IItemPriceAndTitle, IItemCategoryAndImage {}

export interface IProduct extends IItem, IId {
    description: string;
} 

export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

export interface IOrderResponseItems extends ITotal {
    items: IProduct[];
}

export interface IOrderResponsePrise extends ITotal, IId {}

export interface IErrorResponsePrise {
    error: string
}

export interface IInfoCheckToBuy extends IBuyer, ITotal {
    items: string[]
}

export interface ICardCatalog extends IItem {}

export interface ICardBasket extends IItemPriceAndTitle {}

export interface ICardSelected extends IItem {
    description: string;
}