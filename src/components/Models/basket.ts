import { IProduct } from "../../types";

export class Basket {
    protected _productsToBuyList: IProduct[] = []

    get getListOfProductsToBuy(): IProduct[] {
        return this._productsToBuyList;
    }

    addToBuyList(product: IProduct):void {
        this._productsToBuyList.push(product)
    }

    removeToBuyList(product: IProduct):void {
        const index = this._productsToBuyList.findIndex(item => item.id === product.id);
        this._productsToBuyList.splice(index, 1); 
    }

    clearToBuyList():void {
        this._productsToBuyList.splice(0, this._productsToBuyList.length) 
    }

    get priseToPay(): number {
        return this._productsToBuyList.reduce((sum, item) => {
            if (item.price !== null) {
                return sum + item.price;
            }
            return sum;
        }, 0);
    }

    get productCounter(): number {
        return this._productsToBuyList.length
    }

    checkProductById(id: string): boolean {
        return this._productsToBuyList.some(item => item.id === id);
    }
}