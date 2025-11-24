import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface IGallery {
    items: HTMLElement
}

export class Gallery extends Component<IGallery> {

    constructor() {
        super(ensureElement('.gallery'))
    }

    set gallery(items: HTMLElement[]) {
        this.container.replaceChildren();
        items.forEach((item) => {
            this.container.appendChild(item)
        })
    }
}