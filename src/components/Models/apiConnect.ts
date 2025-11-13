import { ApiPostMethods, IProduct, IGetApiItems, IGetApiPrise, IErrApiPrise, IPushApiItems } from "../../types";
import {Api} from '../base/Api'


export class ApiConnect extends Api {

    getProduct(): Promise<IProduct[]> {
        return this.get<IGetApiItems>('/product/')
        .then(res => res.items)
    }

    postProduct(chek: IPushApiItems): void {
        this.post<IGetApiPrise | IErrApiPrise>('/order/', chek)
    }
}