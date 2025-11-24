import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement, cloneTemplate } from "../../utils/utils";
import { ICardCatalog, ICardBasket, ICardSelected } from "../../types/index";
import { categoryMap } from '../../utils/constants';

abstract class Card<T> extends Component<T> {
    protected buttonCard: HTMLButtonElement;
    protected price: HTMLElement;
    protected title: HTMLElement;

    constructor(container: string | HTMLTemplateElement, selectorElement: string) {
        super(cloneTemplate(container));

        if (this.container.classList.contains(selectorElement)) {
            this.buttonCard = this.container as HTMLButtonElement;
        } else {
            this.buttonCard = ensureElement<HTMLButtonElement>(`.${selectorElement}`, this.container)
        }
        this.price = ensureElement<HTMLElement>('.card__price', this.container)
        this.title = ensureElement<HTMLElement>('.card__title', this.container)
    }

    set cardPrice (value: string) {
        this.price.textContent = value
    }

    set cardTitle (name: string) {
        this.title.textContent = name
    }

    set cardId (Id: string) {
        this.container.id = Id
    }

}


export class TemplateCardCatalog extends Card<ICardCatalog> {
    protected image: HTMLImageElement;
    protected category: HTMLElement;

    constructor(protected events: IEvents) {
        super('#card-catalog', 'gallery__item');

        this.image = ensureElement<HTMLImageElement>('.card__image', this.container)
        this.category = ensureElement<HTMLElement>('.card__category', this.container)

        this.buttonCard.addEventListener('click', () => {
            this.events.emit('card:open', {id: this.container.id});
        });
    }
    
    set cardImage (src: string) {
        this.image.src = src
    }

    set cardCategory (category: string) {
        this.category.textContent = category

        for (const key in categoryMap) {
            this.category.classList.toggle(
                categoryMap[key as keyof typeof categoryMap],
                key === category
            )
        }
    }
}


export class TemplateCardSelected extends Card<ICardSelected> {
    protected image: HTMLImageElement;
    protected category: HTMLElement;
    protected description: HTMLElement;
    
    constructor(protected events: IEvents) {
        super('#card-preview', 'card__button');

        this.image = ensureElement<HTMLImageElement>('.card__image', this.container)
        this.category = ensureElement<HTMLElement>('.card__category', this.container)
        this.description = ensureElement<HTMLElement>('.card__text', this.container)

        this.buttonCard.addEventListener('click', () => {
            this.events.emit('card:inBasket', {id: this.container.id});
            if (this.buttonCard.textContent === 'В корзину') {
                this.buttonCard.textContent = 'Удалить из корзины'
            } else {
                this.buttonCard.textContent = 'В корзину'
            }
        });
    }

    set cardImage (src: string) {
        this.image.src = src
    }

    set cardDescription (text: string) {
        this.description.textContent = text
    }

    set cardCategory (category: keyof typeof categoryMap) {
        this.category.textContent = category

        for (const key in categoryMap) {
            this.category.classList.toggle(
                categoryMap[key as keyof typeof categoryMap],
                key === category
            )
        }
    }

    set buttonText(text: string) {
        this.buttonCard.textContent = text
    }

    set disabledButtonCard (boolean: boolean) {
        this.buttonCard.disabled = boolean
    }
}


export class TemplateCardBasket extends Card<ICardBasket> {
    protected index: HTMLElement;

    constructor(protected events: IEvents) {
        super('#card-basket', 'card__button');

        this.index = ensureElement<HTMLElement>('.basket__item-index', this.container)

        this.buttonCard.addEventListener('click', () => {
            this.events.emit('card:remove', {id: this.container.id});
        });
    }

    set cardIndex (src: string) {
        this.index.textContent = src
    }
}
