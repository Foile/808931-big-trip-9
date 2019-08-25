import {AbstractComponent} from './abstract-component';

export class Menu extends AbstractComponent {
  constructor(tabs) {
    super();
    this._tabs = tabs;
  }
  getTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
  ${this._tabs.map(({name, link, active})=>`<a class="trip-tabs__btn  ${active ? `trip-tabs__btn--active` : ``}" href="${link}">${name}</a>`)}
  </nav>`;
  }
}
