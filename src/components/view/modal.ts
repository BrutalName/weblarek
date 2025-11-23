import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export class Modal {
    protected modalButton: HTMLButtonElement;
    protected modalElement: HTMLElement;
    protected contentContainer: HTMLElement;
    protected modalOverlay: HTMLElement;
    
        constructor(protected events: IEvents) {
          this.modalElement = ensureElement<HTMLElement>('#modal-container');
          this.contentContainer = ensureElement<HTMLElement>('.modal__content', this.modalElement);
          this.modalButton = ensureElement<HTMLButtonElement>('.modal__close', this.modalElement);
          this.modalOverlay = ensureElement<HTMLElement>('.modal__container', this.modalElement);

          this.modalButton.addEventListener('click', () => {
            this.events.emit('modal:close');
        })
          this.modalElement.addEventListener('click', (event) => {
            if (event.target === this.modalElement) {
              this.events.emit('modal:close')
            }

        });
          
        }
      
        open() {
          this.modalElement.classList.add('modal_active');
        }
      
        close() {
          this.modalElement.classList.remove('modal_active');

        }
      
        addContent(content: HTMLElement) {
          this.contentContainer.appendChild(content);
        }
      
        clear() {
          this.contentContainer.replaceChildren();
        }
    }