import {AbstractComponent} from './abstract-component';

export class Filters extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }
  getTemplate() {
    return `<form class="trip-filters" action="#" method="get">
  ${this._filters.map(({title}) => `<div class="trip-filters__filter">
  <input id="filter-${title.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${title.toLowerCase()}" ${title === `Everything` ? `checked` : ``}>
  <label class="trip-filters__filter-label" for="filter-${title.toLowerCase()}">${title}</label>
  </div>`).join(``)}
  <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
  }
}
