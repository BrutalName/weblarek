import { IBuyer, TPayment } from "../../types";

export class Buyer implements IBuyer {
    payment: TPayment = '';
    email: string = '';
    phone: string = '';
    address: string = '';

    setValue(fieldName: keyof IBuyer, value: string | TPayment): void {
        (this as any)[fieldName] = value;
    }
    
    getAllData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email,
        };
    }
    
    clearAllData(): void {
        this.payment = '';
        this.address = '';
        this.phone = '';
        this.email = '';
    }
    
    validate(): { [key: string]: string } {
        const errorsBuyer: { [key: string]: string } = {};
    
        if (!this.payment) {
            errorsBuyer.payment = 'Не выбран способ оплаты';
        }
        if (!this.email) {
            errorsBuyer.email = 'Введите email';
        }
        if (!this.phone) {
            errorsBuyer.phone = 'Введите телефон';
        }
        if (!this.address) {
            errorsBuyer.address = 'Введите адрес';
        }
    
        return errorsBuyer;
    }
}
