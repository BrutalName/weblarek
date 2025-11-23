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
    ClearSuccess,
    DisabledButton,
    CheckFormErrors,
    CheckFinalFormErrors,
    AddToBasket,
    RemoveFromBasket,
    CheckBasket,
    refreshBasket,
    OpenBasket,
    OpenCard,
    CloseModal,
    OpenForm,
    getApiProduct
} from './components/base/Modal'

const productsModel = new Сatalog();

const events = new EventEmitter();
const basketModel = new Basket();



const iAmBuyer = new Buyer();

const ApiItems = new ApiConnect(API_URL);
const gallery = new Gallery();
const model = new Modal(events)
const basket = new TemplateBasket(events)
const formAdressAndPaiment = new TemplateOrder(events)
const formContacts = new TemplateContacts(events)
const orderSuccess = new TemplateSuccess(events)

let viewCard = new TemplateCardSelected(events)
const header = new Header(events)






events.on('order:continueForm', (buttonOrder: HTMLButtonElement) => {
    OpenForm(formContacts, model)
    DisabledButton(buttonOrder, (!(iAmBuyer.getAllData().address === '') && !(iAmBuyer.getAllData().payment === '')))
});

events.on('order:doneForm', () => {
    
    let orderData: IInfoCheckToBuy = {
        payment: iAmBuyer.payment,
        email: iAmBuyer.email,
        phone: iAmBuyer.phone,
        address: iAmBuyer.address,
        total: basketModel.priseToPay,
        items: basketModel.getListOfProductsToBuy.map((item) => item.id)
    }
    
    ApiItems.postProduct(orderData)
        .then((response) => {
            if ('total' in response) {
                orderSuccess.totalPrice = response.total
                ClearSuccess (
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

events.on('order:end', (buttonOrder: HTMLButtonElement) => {
    DisabledButton(buttonOrder, (!(iAmBuyer.getAllData().phone === '') && !(iAmBuyer.getAllData().email === '') && !(iAmBuyer.getAllData().address === '') && !(iAmBuyer.getAllData().payment === '')))
});

events.on('order:continue', (buttonOrder: HTMLButtonElement) => {
    DisabledButton(buttonOrder, (!(iAmBuyer.getAllData().address === '') && !(iAmBuyer.getAllData().payment === '')))
});

events.on('order:toggleButtonActive', (buttons: HTMLButtonElement[]) => {
    buttons.forEach(button => {
        if (button.classList.contains('button_alt-active')) {
            button.classList.remove('button_alt-active')
        } else {
            button.classList.add('button_alt-active')
            iAmBuyer.setValue('payment', button.name)
        }
        
    }) 
});

events.on('order:buttonActive', (button: HTMLButtonElement) => {
    button.classList.add('button_alt-active')
    iAmBuyer.setValue('payment', button.name)
    CheckFormErrors(iAmBuyer, formAdressAndPaiment)
});

events.on('order:inputEmail', (input: HTMLInputElement) => {
    iAmBuyer.setValue('email', input.value)
    CheckFinalFormErrors(iAmBuyer, formContacts)
});

events.on('order:inputPhone', (input: HTMLInputElement) => {
    iAmBuyer.setValue('phone', input.value)
    CheckFinalFormErrors(iAmBuyer, formContacts)
});


events.on('order:inputAddress', (input: HTMLInputElement) => {
    iAmBuyer.setValue('address', input.value)
    CheckFormErrors(iAmBuyer, formAdressAndPaiment)
});

events.on('card:open', (selectedCard: HTMLElement) => {
    let item = productsModel.getProductById(selectedCard.id)
    if (item) {
        OpenCard(item, basketModel, viewCard, model)
    };
});

events.on('modal:close', () => {
    CloseModal(model);
});

events.on('basket:open', () => {
    OpenBasket(basketModel, basket, header, model, events);
});

events.on('card:inBasket', (selectedCard: HTMLElement) => {
    if (CheckBasket(selectedCard.id, basketModel)) {
        RemoveFromBasket(selectedCard, productsModel, basketModel, header)
        events.on('card:inBasketText', (selectedCard: HTMLElement) => {
            selectedCard.textContent = 'В корзину'
        })
    } else {
        AddToBasket(selectedCard, productsModel, basketModel, header)
        events.on('card:inBasketText', (selectedCard: HTMLElement) => {
            selectedCard.textContent = 'Удалить из корзины'
        })
    }
});

events.on('card:remove', (selectedCard: HTMLElement) => {
    RemoveFromBasket(selectedCard, productsModel, basketModel, header)
    refreshBasket(basketModel, basket, header, events)
});

events.on('order:ready', () => {
    OpenForm(formAdressAndPaiment, model)
});


getApiProduct(ApiItems, productsModel, gallery, events)
    