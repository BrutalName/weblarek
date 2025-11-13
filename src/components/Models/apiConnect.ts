import { ApiPostMethods, IProduct, IOrderResponseItems, IOrderResponsePrise, IErrorResponsePrise, IInfoCheckToBuy } from "../../types";
import {Api} from '../base/Api'


export class ApiConnect extends Api {

    getProduct(): Promise<IProduct[]> {
        return this.get<IOrderResponseItems>('/product/')
        .then(res => res.items)
    }

    postProduct(chek: IInfoCheckToBuy): Promise<IOrderResponsePrise | IErrorResponsePrise> {
        return this.post<IOrderResponsePrise | IErrorResponsePrise>('/order/', chek)
    }
}