import {destinations, eventTypeGroups} from '../data';

import {Event} from './trip-event';

const makeFirstSymUp = (string) => `${string[0].toUpperCase()}${string.slice(1)}`;
export class EventEdit extends Event {
  constructor(event, offersStack) {
    super(event);
    this._offersStack = offersStack;
  }
  getTemplate() {
    return `<li class="trip-events__item">
    <form class="event  event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type.title}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
        <div class="event__type-list">
        ${Object.keys(eventTypeGroups).map((group) => `
    <fieldset class="event__type-group">
    <legend class="visually-hidden">
      ${group}</legend>
      ${eventTypeGroups[group].reduce((acc, title) =>
    `${acc}<div class="event__type-item">
        <input id="event-type-${title}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${title}">
        <label class="event__type-label  event__type-label--${title}" for="event-type-${title}-1">${title}</label>
        </div>\n`, ``)}
    </fieldset>`).join(`\n`)}</div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${makeFirstSymUp(this._type.title)} ${this._type.type === `activity` ? `in` : `to`}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._destination.name}" list="destination-list-1">
        <datalist id="destination-list-1">${destinations.map(({name}) => `<option value="${name}"></option>`).join(``)}
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${new Date(this._timeStart).toLocaleDateString()}">
        —
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${new Date(this._timeEnd).toLocaleDateString()}">
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          €
        </label>
        <input
          class="event__input event__input--price"
          id="event-price-1"
          type="text"
          name="event-price"
          value="${this._price}">
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" checked="">
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
        </svg>
      </label>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${this._offersStack.map(({name, title, price: offerPrice}) => `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${name}-1"
        type="checkbox" name="event-offer-${name}" ${this._offers.find((offerChecked) => offerChecked.name === name) ? `checked=""` : ``}>
        <label class="event__offer-label" for="event-offer-${name}-1">
          <span class="event__offer-title">${title}</span>+
          €&nbsp;<span class="event__offer-price">${offerPrice}</span>
        </label>
      </div>`).join(``)}
        </div>
      </section>
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${this._destination.description}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
          ${this._destination.photo.map((photo) => `<img class="event__photo" src="${photo}" alt="Event photo">`).join(``)}
          </div>
        </div>
      </section>
    </section>
    </form>
    </li>`;
  }
  resetForm() {
    this.getElement().querySelector(`.event--edit`).reset();
    this.getElement().querySelector(`.event__type-icon`).src = `img/icons/${this._type.title}.png`;
    this.getElement().querySelector(`.event__type-output`).textContent = `${makeFirstSymUp(this._type.title)} ${this._type.type}`;
    this.getElement().querySelector(`.event__destination-description`).textContent = `${this._description}`;
    this.getElement().querySelector(`.event__favorite-checkbox`).checked = this._isFavorite;

    if (this._offers.length > 0) {
      this.getElement().querySelector(`.event__section--offers`).classList.remove(`visually-hidden`);
      this.getElement().querySelector(`.event__available-offers`).innerHTML = ``;
      this.getElement().querySelector(`.event__available-offers`).insertAdjacentHTML(`beforeend`, `${this._offers.map(({name, id, price, isChecked}) => `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="${id}-1" type="checkbox" name="${id}" ${isChecked ? `checked` : ``}>
        <label class="event__offer-label" for="${id}-1">
          <span class="event__offer-title">${name}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
        </label>
      </div>`).join(``)}`);
    } else if (!this.getElement().querySelector(`.event__section--offers`).classList.contains(`visually-hidden`)) {
      this.getElement().querySelector(`.event__section--offers`).classList.add(`visually-hidden`);
    }
  }

  _setCurrentTypeChecked() {
    Array.from(this.getElement().querySelectorAll(`input[name="event-type"]`)).find((eventType) => eventType.title === this._type.title).checked = true;
  }

  _changeOptionsByType() {
    this.getElement()
      .querySelectorAll(`.event__type-input`)
      .forEach((typeItem) => {
        typeItem.addEventListener(`click`, (evt) => {
          const target = evt.currentTarget;
          const typeData = this._tripTypes.find(({type}) => type.title === target.title);

          if (typeData.options.length === 0) {
            this.getElement().querySelector(`.event__section--offers`).classList.add(`visually-hidden`);
          } else {
            this.getElement().querySelector(`.event__section--offers`).classList.remove(`visually-hidden`);
          }

          this.getElement().querySelector(`.event__type-icon`).src = `img/icons/${typeData.type.title}.png`;
          this.getElement().querySelector(`.event__type-output`).textContent = `${makeFirstSymUp(typeData.type.title)} ${typeData.type.placeholder}`;
          this.getElement().querySelector(`.event__type-toggle`).checked = false;

          this.getElement().querySelector(`.event__available-offers`).innerHTML = ``;
          this.getElement().querySelector(`.event__available-offers`).insertAdjacentHTML(`beforeend`,
              `${typeData.options.map(({name, id, price, isChecked}) => `<div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="${id}-1" type="checkbox" name="${id}" ${isChecked ? `checked` : ``}>
                <label class="event__offer-label" for="${id}-1">
                  <span class="event__offer-title">${name}</span>
                  &plus;
                  &euro;&nbsp;<span class="event__offer-price">${price}</span>
                </label>
              </div>`).join(``)}`);
        });
      });
  }
  _changeDescByCity() {
    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, (evt) => {
        const target = evt.currentTarget;
        const cityData = destinations.find(({city}) => city === target.value);
        if (cityData) {
          this.getElement().querySelector(`.event__destination-description`).textContent = cityData.description;
        } else {
          this.getElement().querySelector(`.event__destination-description`).textContent = ``;
        }
      });
  }
}
