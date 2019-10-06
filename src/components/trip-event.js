
import {AbstractComponent} from './abstract-component';
import {makeFirstSymUp, calcDuration, DATE_FORMAT, TIME_FORMAT} from '../utils';
import moment from 'moment';

const MAX_OFFERS_SHOW = 3;

export class Event extends AbstractComponent {
  constructor({id, type, destination, timeStart, timeEnd, price, offers, isFavorite}) {
    super();
    this._id = id;
    this._type = type;
    this._destination = destination;
    this._timeStart = timeStart;
    this._timeEnd = timeEnd;
    this._price = price;
    this._offers = offers;
    this._isFavorite = isFavorite;
  }
  getTemplate() {
    return `<li class="trip-events__item">
  <div class="event">
    <div class="event__type">
      <img
        class="event__type-icon"
        width="42"
        height="42"
        src="${this._type.title.length > 0 ? `img/icons/${this._type.title}.png` : ``}"
        alt="Event type icon">
    </div>
    <h3 class="event__title">${makeFirstSymUp(this._type.title)} ${this._type.type === `activity` ? `in` : `to`} ${this._destination.name}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time
          class="event__start-time"
          datetime="${moment(this._timeStart).format(DATE_FORMAT)}">${moment(this._timeStart).format(TIME_FORMAT)}
        </time>
        &mdash;
        <time
          class="event__end-time"
          datetime="${moment(this._timeEnd).format(DATE_FORMAT)}">${moment(this._timeEnd).format(TIME_FORMAT)}
        </time>
      </p>
      <p class="event__duration">${calcDuration(this._timeStart, this._timeEnd)}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;
      <span class="event__price-value">${this._price}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
    ${(this._offers) ? Array.from(this._offers).filter(({accepted}) => accepted).map(({title, price: offerPrice, accepted}) => accepted ? `<li class="event__offer">
    <span class="event__offer-title">${makeFirstSymUp(title)}</span>
    &plus;
    &euro;&nbsp;<span class="event__offer-price">${offerPrice}</span>
   </li>` : ``).slice(0, MAX_OFFERS_SHOW).join(``) : ``}
    </ul>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
  </li>`;
  }
}
