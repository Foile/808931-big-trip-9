import {AbstractComponent} from './abstract-component';

export class TripDay extends AbstractComponent {
  constructor(date, counter) {
    super();
    this._counter = counter;
    this._date = date;
  }
  getTemplate() {
    return `<li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${this._counter}</span>
      <time class="day__date" datetime="${this._date}">${new Date(this._date).toLocaleDateString(`en-GB`, {
  day: `numeric`, month: `short`, year: `numeric`
})}</time>
    </div></li>`;
  }
}
