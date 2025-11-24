import "./scss/styles.scss";
import { Сatalog } from "./components/Models/catalog";
import { Basket } from "./components/Models/basket";
import { Buyer } from "./components/Models/buyer";
import { ApiConnect } from "./components/Models/apiConnect";

import { TemplateBasket } from "./components/view/vbasket";
import { Modal } from "./components/view/modal";
import { TemplateCardSelected } from "./components/view/vcard";
import { Gallery } from "./components/view/vgallery";
import { Header } from "./components/view/vheader";
import { TemplateOrder, TemplateContacts, TemplateSuccess } from "./components/view/vorder";

import { API_URL } from "./utils/constants";

import { IInfoCheckToBuy } from "./types";
import { EventEmitter } from "./components/base/Events";

import {
    clearSuccess,
    disabledButtonForm,
    addToBasket,
    removeFromBasket,
    refreshBasket,
    openBasket,
    openCard,
    openForm,
    getApiProduct
} from './components/base/Modal'

const productsModel = new Сatalog();

const events = new EventEmitter();
const basketModel = new Basket();



const iAmBuyer = new Buyer();

const apiItems = new ApiConnect(API_URL);
const gallery = new Gallery();
const model = new Modal(events)
const basket = new TemplateBasket(events)
const formAdressAndPaiment = new TemplateOrder(events)
const formContacts = new TemplateContacts(events)
const orderSuccess = new TemplateSuccess(events)

const viewCard = new TemplateCardSelected(events)
const header = new Header(events)

const formCheck = ['address', 'payment']
const lastFormCheck = ['address', 'payment','phone','email']


events.on('order:nextForm', () => {
    openForm(formContacts, model)
    disabledButtonForm(iAmBuyer, formContacts, ['address', 'payment','phone','email'])
});

events.on('order:doneForm', () => {
    
    const orderData: IInfoCheckToBuy = {
        payment: iAmBuyer.payment,
        email: iAmBuyer.email,
        phone: iAmBuyer.phone,
        address: iAmBuyer.address,
        total: basketModel.priseToPay,
        items: basketModel.getListOfProductsToBuy.map((item) => item.id)
    }
    
    apiItems.postProduct(orderData)
        .then((response) => {
            if ('total' in response) {
                orderSuccess.totalPrice = response.total
                clearSuccess (
                    model, 
                    basketModel, 
                    iAmBuyer, 
                    basket,
                    formAdressAndPaiment,
                    formContacts,
                    header,
                    orderSuccess,
                    events
                )
            } else {
                alert(response.error)
            }
        })
        .catch(error => {
            alert(error)
        });
    
});


events.on('order:buttonActive', (button: {name: string}) => {
    formAdressAndPaiment.paiment = button.name
    iAmBuyer.setValue('payment', button.name)
    disabledButtonForm(iAmBuyer, formAdressAndPaiment, formCheck)
});

events.on('order:inputAddress', (input: {address: string}) => {
    iAmBuyer.setValue('address', input.address)
    disabledButtonForm(iAmBuyer, formAdressAndPaiment, formCheck)
});

events.on('order:inputEmail', (input: {email: string}) => {
    iAmBuyer.setValue('email', input.email)
    disabledButtonForm(iAmBuyer, formContacts, lastFormCheck)
});

events.on('order:inputPhone', (input: {phone: string}) => {
    iAmBuyer.setValue('phone', input.phone)
    disabledButtonForm(iAmBuyer, formContacts, lastFormCheck)
});

events.on('card:open', (cardId: {id: string}) => {
    const item = productsModel.getProductById(cardId.id)
    if (item) {
        openCard(item, basketModel, viewCard, model)
    };
});


events.on('order:ready', () => {
    openForm(formAdressAndPaiment, model)
});

events.on('basket:open', () => {
    openBasket(basketModel, basket, header, model, events);
});


events.on('card:inBasket', (card: {id: string}) => {
    if (basketModel.checkProductById(card.id)) {
        removeFromBasket(card.id, productsModel, basketModel, header)
    } else {
        addToBasket(card.id, productsModel, basketModel, header)
    }
});

events.on('card:remove', (selectedCard: {id: string}) => {
    removeFromBasket(selectedCard.id, productsModel, basketModel, header)
    refreshBasket(basketModel, basket, header, events)
});


events.on('modal:close', () => {
    model.close()
});

getApiProduct(apiItems, productsModel, gallery, events)
    