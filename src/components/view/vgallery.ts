import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface IGallery {
    items: HTMLElement
}

export class Gallery extends Component<IGallery> {

    constructor() {
        super(ensureElement('.gallery'))
    }

    set Gallery(items: HTMLElement) {
        this.container.append(items)
    }
}