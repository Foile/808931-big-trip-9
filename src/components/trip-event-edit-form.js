import {eventTypeGroups} from '../data';
import {makeFirstSymUp} from '../utils';
import Event from './trip-event';
import moment from 'moment';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';
import {toKebab} from '../utils';

export default class EventEdit extends Event {
  constructor(event, destinations, eventTypes) {
    super(event);
    this._destinations = destinations;
    this._eventTypes = eventTypes;
    this._changeOffersByType();
    this._changeDescByCity();
    const getFlatpickrConfig = (value) => {

      const config = {
        defaultDate: [moment(value).format(`DD.MM.YY hh:mm`)],
        enableTime: true,
        noCalendar: false,
        altInput: false,
        altFormat: `h:i`,
        dateFormat: `d.m.y h:i`,
      };
      return config;
    };

    flatpickr(this._element.querySelector(`.event__input[name='event-start-time']`), getFlatpickrConfig(this._timeStart));
    flatpickr(this._element.querySelector(`.event__input[name='event-end-time']`), getFlatpickrConfig(this._timeEnd));

    this._saveButton = this._element.querySelector(`.event__save-btn`);
    this._resetButton = this._element.querySelector(`.event__reset-btn`);
    this._offersSection = this._element.querySelector(`.event__section--offers`);
    this._availableOffers = this._element.querySelector(`.event__available-offers`);
    this._destinationSection = this._element.querySelector(`.event__section--destination`);
    this._destinationDescription = this._element.querySelector(`.event__destination-description`);
    this._eventPhotosTape = this._element.querySelector(`.event__photos-tape`);
    this._eventTypeInput = null;
    this._editForm = this._element.querySelector(`.event--edit`);
    this._eventTypeOutput = this._element.querySelector(`.event__type-output`);
    this._typeIcon = this._element.querySelector(`.event__type-icon`);
    this._eventTypeToggle = this._element.querySelector(`.event__type-toggle`);
  }

  get destinationInput() {
    return this._element.querySelector(`.event__input--destination`);
  }

  get startTimeInput() {
    return this._element.querySelector(`.event__input[name='event-start-time']`);
  }

  get endTimeInput() {
    return this._element.querySelector(`.event__input[name='event-end-time']`);
  }

  get favoriteCheckbox() {
    return this._element.querySelector(`.event__favorite-checkbox`);
  }

  get eventTypeInput() {
    if (!this._eventTypeInput) {
      this._eventTypeInput = this.getElement().querySelectorAll(`input[name="event-type"]`);
    }
    return this._eventTypeInput;
  }

  shake() {
    const ANIMATION_TIMEOUT = 600;
    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._element.style.animation = ``;
    }, ANIMATION_TIMEOUT);
    this._addRedFrame();
  }

  lock(action) {
    this._removeRedFrame();
    this._saveButton.innerHTML = action === `save` ? `Saving...` : `Save`;
    this._resetButton.innerHTML = action === `delete` ? `Deleting...` : `Delete`;
    this._saveButton.disabled = true;
    this._resetButton.disabled = true;
  }

  unlock() {
    this._saveButton.disabled = false;
    this._resetButton.disabled = false;
    this._saveButton.innerHTML = `Save`;
    this._resetButton.innerHTML = `Delete`;
  }

  resetForm() {
    this._editForm.reset();
    this._typeIcon.src = `img/icons/${this._type.title}.png`;
    this._eventTypeOutput.textContent = `${makeFirstSymUp(this._type.title)} ${this._type.type === `activity` ? `in` : `to`}`;
    if (this._destination) {
      this._destinationSection.classList.remove(`visually-hidden`);
      this._destinationDescription.textContent = `${this._destination.description}`;
      this._eventPhotosTape.innerHTML = ``;
      this._eventPhotosTape.insertAdjacentHTML(`beforeend`,
          `${this._destination.pictures.map(
              ({src, description}) => `<img class="event__photo" src="${src}" alt="${description}">`
          ).join(``)}`);
    }
    this.favoriteCheckbox.checked = this._isFavorite;
    this.startTimeInput.value = moment(this._timeStart).format(`DD.MM.YY hh:mm`);
    this.endTimeInput.value = moment(this._timeEnd).format(`DD.MM.YY hh:mm`);
    const offersClasses = this._offersSection.classList;
    if (this._offers.length > 0) {
      this._offersSection.classList.remove(`visually-hidden`);
      this._availableOffers.innerHTML = ``;
      this._availableOffers.insertAdjacentHTML(`beforeend`,
          this._offers.map(({title, price: offerPrice, accepted}) => `<div class="event__offer-selector">
          <input
            class="event__offer-checkbox visually-hidden"
            id="event-offer-${toKebab(title)}-1"
            type="checkbox" name="event-offer-${toKebab(title)}" ${accepted && `checked=""`}>
          <label class="event__offer-label" for="event-offer-${toKebab(title)}-1">
            <span class="event__offer-title">${title}</span>+
            €&nbsp;<span class="event__offer-price">${offerPrice}</span>
          </label>
          </div>`).join(``));
    } else if (!offersClasses.contains(`visually-hidden`)) {
      offersClasses.add(`visually-hidden`);
    }
  }

  _removeRedFrame() {
    this._element.style.border = `none`;
  }

  _addRedFrame() {
    this._element.style.border = `1px dotted red`;
    this._element.style.borderRadius = `18px`;
  }

  _setCurrentTypeChecked() {
    const types = Array.from(this.eventTypeInput);
    const selected = types.find(({title}) => title === this._type.title);
    selected.checked = true;
  }

  _changeOffersByType() {
    this.eventTypeInput
      .forEach((typeItem) => {
        typeItem.addEventListener(`click`, (evt) => {
          const target = evt.currentTarget;
          const typeData = this._eventTypes.find(({title}) => title === target.value);
          if (typeData.offers.length === 0) {
            this._offersSection.classList.add(`visually-hidden`);
          } else {
            this._offersSection.classList.remove(`visually-hidden`);
          }
          this._typeIcon.src = `img/icons/${typeData.title}.png`;
          this._eventTypeOutput.textContent = `${makeFirstSymUp(typeData.title)} ${typeData.type === `activity` ? `in` : `to`}`;
          this._eventTypeToggle.checked = false;

          this._availableOffers.innerHTML = ``;
          this._availableOffers.insertAdjacentHTML(`beforeend`,
              typeData.offers.map(({title, price: offerPrice}) => `<div class="event__offer-selector">
              <input
                class="event__offer-checkbox visually-hidden"
                id="event-offer-${toKebab(title)}-1"
                type="checkbox"
                name="event-offer-${toKebab(title)}">
              <label
                class="event__offer-label"
                for="event-offer-${toKebab(title)}-1">
                  <span class="event__offer-title">${title}</span>+
                  €&nbsp;<span class="event__offer-price">${offerPrice}</span>
              </label>
              </div>`).join(``));
        });
      });
  }

  _changeDescByCity() {
    this.destinationInput
      .addEventListener(`change`, (evt) => {
        const target = evt.currentTarget;
        const cityData = this._destinations.find(({name}) => name === target.value);
        if (!cityData) {
          this._destinationSection.classList.add(`visually-hidden`);
        } else {
          this._destinationSection.classList.remove(`visually-hidden`);
          this._destinationDescription.textContent = cityData.description;
          this._eventPhotosTape.innerHTML = ``;
          this._eventPhotosTape.insertAdjacentHTML(`beforeend`, cityData ?
            cityData.pictures.map(({src, description}) => `<img
              class="event__photo"
              src="${src}"
              alt="${description}">`)
              .join(``)
            : ``);
        }
      });
  }

  removeElement() {
    this._element.flatpickr().destroy();
    this._element = null;
  }

  getTemplate() {
    return `<li class="trip-events__item">
    <form
      class="event event--edit"
      action="#"
      method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label
          class="event__type event__type-btn"
          for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17"
          src="${this._type.title.length > 0 ? `img/icons/${this._type.title}.png` : ``}"
          alt="${this._type.title} icon">
        </label>
        <input
          class="event__type-toggle visually-hidden"
          id="event-type-toggle-1"
          type="checkbox">
        <div class="event__type-list">
        ${Object.keys(eventTypeGroups).map((group) => `
    <fieldset class="event__type-group">
    <legend class="visually-hidden">
      ${group}</legend>
      ${eventTypeGroups[group].reduce((acc, title) =>
    `${acc}<div class="event__type-item">
        <input
          id="event-type-${title}-1"
          class="event__type-input visually-hidden"
          type="radio"
          name="event-type"
          value="${title}">
        <label
          class="event__type-label event__type-label--${title}"
          for="event-type-${title}-1">${title}</label>
        </div>\n`, ``)}
    </fieldset>`).join(`\n`)}</div>
      </div>
      <div class="event__field-group event__field-group--destination">
        <label
          class="event__label event__type-output"
          for="event-destination-1">
          ${makeFirstSymUp(this._type.title)} ${this._type.type === `activity` ? `in` : `to`}
        </label>
        <input
          class="event__input event__input--destination"
          id="event-destination-1"
          type="text"
          name="event-destination"
          value="${this._destination.name}"
          list="destination-list-1">
        <datalist id="destination-list-1">
          ${this._destinations.map(({name}) => `<option value="${name}"></option>`).join(``)}
        </datalist>
      </div>
      <div class="event__field-group event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input
          class="event__input event__input--time"
          id="event-start-time-1"
          type="text"
          name="event-start-time"
          value="${this._timeStart}">
        —
        <label
          class="visually-hidden"
          for="event-end-time-1">
          To
        </label>
        <input
          class="event__input event__input--time"
          id="event-end-time-1"
          type="text"
          name="event-end-time"
          value="${this._timeEnd}">
      </div>
      <div class="event__field-group event__field-group--price">
        <label
          class="event__label"
          for="event-price-1">
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
      <button
        class="event__save-btn btn btn--blue"
        type="submit">Save</button>
      <button
        class="event__reset-btn"
        type="reset">Delete</button>
      <input
        id="event-favorite-1"
        class="event__favorite-checkbox visually-hidden"
        type="checkbox"
        name="event-favorite" ${this._isFavorite && `checked=""`}>
      <label
        class="event__favorite-btn"
        for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376
            9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574
            6.48934 1.5716 9.1631L14 21z"></path>
          </svg>
      </label>
      <button
        class="event__rollup-btn"
        type="button">
          <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section event__section--offers ${(this._offers && this._offers.length > 0) ? `` : `visually-hidden`}">
      <h3 class="event__section-title event__section-title--offers">
        Offers
      </h3>
      <div class="event__available-offers">
        ${this._offers ? this._offers.map(({title, price: offerPrice, accepted}) => `<div class="event__offer-selector">
        <input
          class="event__offer-checkbox visually-hidden"
          id="event-offer-${toKebab(title)}-1"
          type="checkbox"
          name="event-offer-${toKebab(title)}" ${accepted && `checked=""`}>
        <label
          class="event__offer-label"
          for="event-offer-${toKebab(title)}-1">
            <span class="event__offer-title">${title}</span>+
            €&nbsp;<span class="event__offer-price">${offerPrice}</span>
        </label>
      </div>`).join(``) : ``}
      </div>
      </section>
      <section class="event__section event__section--destination ${(this._destination) ? `` : `visually-hidden`}">
        <h3 class="event__section-title event__section-title--destination">
          Destination
        </h3>
        <p class="event__destination-description">${this._destination.description}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
          ${this._destination.pictures ? this._destination.pictures.map(({src, description}) => `<img class="event__photo"
          src="${src}" alt="${description}">`).join(``) : ``}
          </div>
        </div>
      </section>
    </section>
    </form>
    </li>`;
  }

}
