import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement, cloneTemplate, ensureAllElements } from "../../utils/utils";
import { IBuyer } from "../../types/index";

interface SuccessData {
    total: string;
}

abstract class Info extends Component<IBuyer> {
    protected buttonOrder: HTMLButtonElement;
    protected errors: HTMLElement;

    constructor(container: string | HTMLTemplateElement, selectorElement: string, protected events: IEvents, buttonEvent: string) {
        super(cloneTemplate(container));

        this.buttonOrder = ensureElement<HTMLButtonElement>(selectorElement, this.container)
        this.errors = ensureElement<HTMLElement>('.form__errors', this.container)

        this.buttonOrder.addEventListener('click', (event) => {
            event.preventDefault()
            this.events.emit(buttonEvent);
        });

    }

    set infoErrors (text: string) {
        this.errors.textContent = text
    }

    set disabledButtonOrder (boolean: boolean) {
        this.buttonOrder.disabled = boolean
    }
}

export class TemplateOrder extends Info {
    protected buttonPaiementOrder: HTMLButtonElement[];
    protected _address: HTMLInputElement;

    constructor(protected eventsOrderButton: IEvents) {
        super('#order', '.order__button', eventsOrderButton, 'order:nextForm');

        this.buttonPaiementOrder = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);
        this._address = ensureElement<HTMLInputElement>('.form__input', this.container);

        this.buttonPaiementOrder.forEach(button => {
            button.addEventListener('click', () => {
                this.events.emit('order:buttonActive', {name: button.name})
            });
        });

        this._address.addEventListener('input', () => {
            this.events.emit('order:inputAddress', {address: this._address.value});
        });
    }

    set address (text: string) {
        this._address.value = text
    }
    set paiment (text: string) {
        if (text === '') {
        this.buttonPaiementOrder.forEach((button) => {
            if (button.classList.contains('button_alt-active')) {
                button.classList.remove('button_alt-active')
            }
        })} else {
            this.buttonPaiementOrder.forEach((button) => {
                if (button.classList.contains('button_alt-active') && !(button.name === text)) {
                    button.classList.remove('button_alt-active')
                }
                if (!(button.classList.contains('button_alt-active')) && button.name === text) {
                    button.classList.add('button_alt-active')
                }
            })
        }
    }



}

export class TemplateContacts extends Info {
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;

    constructor(protected eventsOrderButton: IEvents) {
        super('#contacts', '.button', eventsOrderButton, 'order:doneForm');
        this._email = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this._phone = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this._email.addEventListener('input', () => {
            this.events.emit('order:inputEmail', {email: this._email.value});
        });
        this._phone.addEventListener('input', () => {
            this.events.emit('order:inputPhone', {phone: this._phone.value});
        });
    }
    
    set email (text: string) {
        this._email.value = text
    }

    set phone (text: string) {
        this._phone.value = text
    }
}

export class TemplateSuccess extends Component<SuccessData> {
    protected buttonOrder: HTMLButtonElement;
    protected total: HTMLElement;

    constructor(protected events: IEvents) {
        super(cloneTemplate('#success'));

        this.buttonOrder = ensureElement<HTMLButtonElement>('.order-success__close', this.container)
        this.total = ensureElement<HTMLElement>('.order-success__description', this.container)

        this.buttonOrder.addEventListener('click', () => {
            this.events.emit('modal:close');
        });

    }

    set totalPrice (value: number) {
        this.total.textContent = `Списано ${value} синапсов`
    }
}