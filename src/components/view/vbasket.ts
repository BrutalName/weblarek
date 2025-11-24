import { ensureElement, cloneTemplate, createElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
    items: HTMLElement
}

export class TemplateBasket extends Component<IBasket> {
    protected _basketList: HTMLElement;
    protected buttonOrder: HTMLButtonElement;
    protected basketListPrise: HTMLElement;
  
    constructor(protected events: IEvents) {
        super(cloneTemplate('#basket'));
        this._basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.buttonOrder = ensureElement<HTMLButtonElement>('.basket__button', this.container)
        this.basketListPrise = ensureElement<HTMLElement>('.basket__price', this.container)

        this.buttonOrder.addEventListener('click', () => {
            this.events.emit('order:ready');
        });
    }

    basketList(items: HTMLElement[]) {
        this._basketList.replaceChildren();
        items.forEach((item) => {
            this._basketList.appendChild(item)
        })
        
    }
    
    set price (prise: number) {
        this.basketListPrise.textContent = `${prise} синапсов`
    }

    set checkBasketIsEmpty (boolean: boolean) {
        this._basketList.replaceChildren();
        if (boolean) {
            const span = createElement('span', { className: 'basketIsEmpty' });
            span.textContent = 'Корзина пуста'
            this._basketList.appendChild(span)
            this.buttonOrder.disabled = boolean
        }
        this.buttonOrder.disabled = boolean
    }

  }