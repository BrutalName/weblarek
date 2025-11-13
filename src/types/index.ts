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

export interface IProduct extends IId {
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

export interface IOrderResponseItems extends ITotal {
    items: IProduct[];
}

export interface IOrderResponsePrise extends ITotal, IId {}

export interface IErrorResponsePrise {
    error: string
}

export interface IInfoCheckToBuy extends IBuyer, IOrderResponseItems {}
