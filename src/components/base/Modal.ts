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

import { categoryMap, CDN_URL } from "../../utils/constants";

import { IProduct } from "../../types";
import { EventEmitter } from "./Events";



export function clearSuccess (
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

export function disabledButtonForm (iAmBuyer: Buyer, form: TemplateContacts | TemplateOrder, keys: string[]) {
    const infoErrors = iAmBuyer.validate()
    form.disabledButtonOrder = keys.some(key => infoErrors[key])
    const errorKey = keys.find((key) => {return infoErrors[key]})
    if (!errorKey) {
        form.infoErrors = ''
    } else {
        form.infoErrors = infoErrors[errorKey]
    }
}


export function addToBasket (selectedCardId: string, productsModel: Сatalog, basketModel: Basket, header: Header) {
    const item = productsModel.getProductById(selectedCardId)
    if (item) {
        basketModel.addToBuyList(item)
        header.counter = basketModel.getListOfProductsToBuy.length
    }
    
}

export function removeFromBasket (selectedCardId: string, productsModel: Сatalog, basketModel: Basket, header: Header) {
    const item = productsModel.getProductById(selectedCardId)
    if (item) {
        basketModel.removeToBuyList(item)
        header.counter = basketModel.getListOfProductsToBuy.length
    }
    
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
    if (basketModel.getListOfProductsToBuy.length === 0) {
        basket.checkBasketIsEmpty = true
    } else {
        const elements: HTMLElement[] = []
        basketModel.getListOfProductsToBuy.forEach((item) => {
            let cardBasket = new TemplateCardBasket(events)
            cardBasket.cardIndex =  String(counter)
            cardBasket.cardPrice =  getPrice(item.price)
            cardBasket.cardTitle =  item.title
            cardBasket.cardId = item.id
            counter++
            elements.push(cardBasket.render())
        })
        basket.checkBasketIsEmpty = false
        basket.basketList(elements)
    }
    basket.price = basketModel.priseToPay
    header.counter = basketModel.getListOfProductsToBuy.length
}

export function openBasket (basketModel: Basket, basket: TemplateBasket, header: Header, model: Modal, events: EventEmitter): void {
    refreshBasket (basketModel, basket, header, events)
    openModal(basket.render(), model)
}

export function openCard (selectedCard: IProduct, basketModel: Basket, viewCard: TemplateCardSelected, model: Modal): void {
    viewCard.cardCategory = (selectedCard.category as keyof typeof categoryMap)
    viewCard.cardDescription = selectedCard.description
    viewCard.cardImage = `${CDN_URL}/${selectedCard.image}`
    viewCard.cardPrice = getPrice(selectedCard.price)
    viewCard.disabledButtonCard = checkOnSale(selectedCard.price)
    viewCard.cardTitle = selectedCard.title
    viewCard.cardId = selectedCard.id
    viewCard.buttonText = 'В корзину'
    if (basketModel.checkProductById(selectedCard.id)) {
        viewCard.buttonText = 'Удалить из корзины'
    }
    if (selectedCard.price === null) {
        viewCard.buttonText = 'Недоступно'
    }
    openModal(viewCard.render(), model)
}

export function getPrice (price: number | null) {
    if (price === null) {
        return `Бесценно`
    } else{
        return `${price} синапсов`
    }
}

export function checkOnSale (price: number | null) {
    return price === null
}

export function addContentModal (element:HTMLElement, model: Modal): void {
    model.clear()
    model.addContent(element);
}

export function openModal (element:HTMLElement, model: Modal): void {
    addContentModal(element, model)
    model.open();
}

export function openForm(formToOpen: TemplateOrder | TemplateContacts, model: Modal) {
    addContentModal(formToOpen.render(), model)
}

export async function getApiProduct(apiItems: ApiConnect, productsModel: Сatalog, gallery: Gallery, events: EventEmitter) {
    await apiItems.getProduct()
    .then((res) => {
        productsModel.allProducts = res
    })
    .then(() => {
        onProductsChange (productsModel.allProducts, events, gallery)
    })
    .catch((error) => alert(error))
}

function onProductsChange (products: IProduct[], events: EventEmitter, gallery: Gallery) {
    const elementsArray: HTMLElement[] = [];
    products.forEach((card) => {
      const newCard = new TemplateCardCatalog(events);
      newCard.cardCategory = card.category;
      newCard.cardImage = `${CDN_URL}/${card.image}`;
      newCard.cardPrice = getPrice(card.price);
      newCard.cardTitle = card.title;
      newCard.cardId = card.id;
      elementsArray.push(newCard.render());
    });
    gallery.gallery = elementsArray;
  };