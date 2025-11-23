import { IProduct } from "../../types";

export class Сatalog {
    protected _allProductsList: IProduct[] = []
    protected _selectedProduct: IProduct | null = null

    set allProducts(products: IProduct[]) {
        this._allProductsList = products;
    }

    get allProducts(): IProduct[] {
        return this._allProductsList;
    }

    getProductById(id: string): IProduct | undefined {
        return this._allProductsList.find((product: IProduct) => product.id === id);
    }

    set detailedProduct(product: IProduct | null) {
        this._selectedProduct = product;
    }

    get detailedProduct(): IProduct | null {
        return this._selectedProduct;
    }

}
