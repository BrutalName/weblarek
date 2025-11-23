import { Сatalog } from "../Models/catalog";
import { Basket } from "../Models/basket";
import { Buyer } from "../Models/buyer";
import { ApiConnect } from "../Models/apiConnect";

import { TemplateBasket } from "../view/vbasket";
import { Modal } from "../view/modal";
import { TemplateCardCatalog, TemplateCardSelected, TemplateCardBasket } from "../view/vcard";
import { Gallery } from "../view/vgallery";
import { Header } from "../view/vheader";
import { TemplateOrder, TemplateContacts, TemplateSuccess } from "../view/vorder";

import { categoryMap } from "../../utils/constants";
import { createElement } from "../../utils/utils";

import { IProduct } from "../../types";
import { EventEmitter } from "./Events";


export function ClearSuccess (
    model: Modal, 
    basketModel: Basket, 
    iAmBuyer: Buyer, 
    basket: TemplateBasket,
    formAdressAndPaiment: TemplateOrder,
    formContacts: TemplateContacts,
    header: Header,
    orderSuccess: TemplateSuccess,
    events: EventEmitter
) {
    model.clear()
    basketModel.clearToBuyList()
    refreshBasket(basketModel, basket, header, events)
    iAmBuyer.clearAllData()
    refreshForms(formAdressAndPaiment, formContacts, iAmBuyer)
    model.addContent(orderSuccess.render())
}

export function DisabledButton (buttonOrder: HTMLButtonElement, boolean: boolean) {
    if (boolean) {
        buttonOrder.disabled = false
    } else {
        buttonOrder.disabled = true
    }
}


export function CheckFormErrors(iAmBuyer: Buyer, formAdressAndPaiment: TemplateOrder) {
    let infoErrors = iAmBuyer.validate()
    if (infoErrors.payment) {
        formAdressAndPaiment.infoErrors = infoErrors.payment
    } else if (infoErrors.address) {
        formAdressAndPaiment.infoErrors = infoErrors.address
    } else {
        formAdressAndPaiment.infoErrors = ''
    }
}

export function CheckFinalFormErrors(iAmBuyer: Buyer, formContacts: TemplateContacts) {
    let infoErrors = iAmBuyer.validate()
    if (infoErrors.email) {
        formContacts.infoErrors = infoErrors.email
    } else if (infoErrors.phone) {
        formContacts.infoErrors = infoErrors.phone
    } else {
        formContacts.infoErrors = ''
    }
     
}

export function AddToBasket (selectedCard: HTMLElement, productsModel: Сatalog, basketModel: Basket, header: Header) {
    let item = productsModel.getProductById(selectedCard.id)
    if (item) {
        basketModel.addToBuyList(item)
        header.counter = basketModel.getListOfProductsToBuy.length
    }
    
}

export function RemoveFromBasket (selectedCard: HTMLElement, productsModel: Сatalog, basketModel: Basket, header: Header) {
    let item = productsModel.getProductById(selectedCard.id)
    if (item) {
        basketModel.removeToBuyList(item)
        header.counter = basketModel.getListOfProductsToBuy.length
    }
    
}

export function CheckBasket (selectedCardId: string, basketModel: Basket): boolean {
    if (basketModel.checkProductById(selectedCardId)) {
        return true
    } else return false
}

export function refreshForms(formAdressAndPaiment: TemplateOrder, formContacts: TemplateContacts, iAmBuyer: Buyer) {
    formAdressAndPaiment.paiment = iAmBuyer.payment
    formAdressAndPaiment.address = iAmBuyer.address
    formAdressAndPaiment.disabledButtonOrder = true
    formContacts.email = iAmBuyer.address
    formContacts.phone = iAmBuyer.phone
    formContacts.disabledButtonOrder = true
}

export function refreshBasket(basketModel: Basket, basket: TemplateBasket, header: Header, events: EventEmitter) {
    let counter = 1
    let elements: HTMLElement[] = []
    
    
    if (basketModel.getListOfProductsToBuy.length === 0) {
        const span = createElement('span', { className: 'basketIsEmpty' });
        span.textContent = 'Корзина пуста'
        elements.push(span)
        basket.basketIsEmpty = true
    } else {
        basketModel.getListOfProductsToBuy.forEach((item) => {
            let cardBasket = new TemplateCardBasket(events)
            cardBasket.cardIndex =  String(counter)
            cardBasket.cardPrice =  chekPrise(item.price)
            cardBasket.cardTitle =  item.title
            cardBasket.cardId = item.id
            counter++
            elements.push(cardBasket.render())
        })
        basket.basketIsEmpty = false
    }

    basket.basketList(elements)
    basket.prise = basketModel.priseToPay
    
    header.counter = basketModel.getListOfProductsToBuy.length
}

export function OpenBasket (basketModel: Basket, basket: TemplateBasket, header: Header, model: Modal, events: EventEmitter): void {
    refreshBasket (basketModel, basket, header, events)
    OpenModal(basket.render(), model)
}

export function OpenCard (selectedCard: IProduct, basketModel: Basket, viewCard: TemplateCardSelected, model: Modal): void {
    viewCard.cardCategory = (selectedCard.category as keyof typeof categoryMap)
    viewCard.cardDescription = selectedCard.description
    viewCard.cardImage = `.${selectedCard.image}`
    viewCard.cardPrice = chekPrise(selectedCard.price)
    viewCard.itemOnSale = checkOnSale(selectedCard.price)
    viewCard.cardTitle = selectedCard.title
    viewCard.cardId = selectedCard.id
    viewCard.buttonText = 'В корзину'
    if (CheckBasket(selectedCard.id, basketModel)) {
        viewCard.buttonText = 'Удалить из корзины'
    }
    if (selectedCard.price === null) {
        viewCard.buttonText = 'Недоступно'
    }
    OpenModal(viewCard.render(), model)
}

export function chekPrise (price: number | null) {
    if (price === null) {
        return `Бесценно`
    } else{
        return `${price} синапсов`
    }
}

export function checkOnSale (price: number | null) {
    if (price === null) {
        return true
    } else{
        return false
    }
}


export function CloseModal (model: Modal): void {
    model.close();
}

export function AddContentModal (element:HTMLElement, model: Modal): void {
    model.clear()
    model.addContent(element);
}

export function OpenModal (element:HTMLElement, model: Modal): void {
    AddContentModal(element, model)
    model.open();
}

export function OpenForm(formToOpen: TemplateOrder | TemplateContacts, model: Modal) {
    AddContentModal(formToOpen.render(), model)
}

export async function getApiProduct(ApiItems: ApiConnect, productsModel: Сatalog, gallery: Gallery, events: EventEmitter) {
    await ApiItems.getProduct()
    .then((res) => {
        productsModel.allProducts = res
        productsModel.allProducts.forEach((card) => {
            const f = new TemplateCardCatalog(events);
            f.cardCategory = card.category;
            f.cardImage = card.image;
            f.cardPrice = chekPrise(card.price);
            f.cardTitle = card.title;
            f.cardId = card.id
            gallery.Gallery = f.render();
        })

    })
    .catch((error) => alert(error))
}