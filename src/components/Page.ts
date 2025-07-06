import {Component} from "./base/Component";
import {IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

interface IPage {
    counter: number;
    catalog: HTMLElement[];
}

export class Page extends Component<IPage> {
  protected _counter: HTMLElement;
  protected _catalog: HTMLElement;
  protected _basket: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)

    this._counter = ensureElement<HTMLElement>('.header__basket-counter', container);
    this._catalog = ensureElement<HTMLElement>('.gallery', container);
    this._basket = ensureElement<HTMLButtonElement>('.header__basket', container);
}

set counter(value: number) {
  this.setText(this._counter, String(value));
}

set catalog(items: HTMLElement[]) {
  this._catalog.replaceChildren(...items);
}
}