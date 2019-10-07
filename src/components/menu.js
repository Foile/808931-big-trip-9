import {makeFirstSymUp} from '../utils';
import AbstractComponent from './abstract-component';

export default class Menu extends AbstractComponent {
  constructor(statistics, tripController, tabs) {
    super();
    this._tabs = tabs;
    this._statistics = statistics;
    this._tripController = tripController;
    this.getElement().addEventListener(`click`, this._onClick.bind(this));
  }

  _onClick(evt) {
    evt.preventDefault();
    const target = evt.target;
    if (target.tagName.toLowerCase() !== `a`) {
      return;
    }
    target.classList.add(`trip-tabs__btn--active`);
    if (target.previousElementSibling) {
      target.previousElementSibling.classList.remove(`trip-tabs__btn--active`);
    } else {
      target.nextElementSibling.classList.remove(`trip-tabs__btn--active`);
    }
    switch (target.dataset.switch) {
      case `table`:
        this._statistics.hide();
        this._tripController.show();
        break;
      case `stats`:
        this._tripController.hide();
        this._statistics.show();
        break;
    }
  }

  getTemplate() {
    return `<nav
    class="trip-controls__trip-tabs trip-tabs">
    ${this._tabs.map(({name, link, active}) => `<a
    class="trip-tabs__btn ${active ? `trip-tabs__btn--active` : ``}"
    href="${link}"
    data-switch="${name}">${makeFirstSymUp(name)}</a>`).join(``)}
  </nav>`;
  }

  updateStatistics(statistics) {
    this._statistics = statistics;
  }
}
