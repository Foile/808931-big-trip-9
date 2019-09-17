import {render, unrender, Position, toKebab} from '../utils';
import {Event} from './trip-event';
import {EventEdit} from './trip-event-edit-form';
import {eventTypes} from '../data';
import moment from 'moment';

export class PointController {
  constructor(event, container, onDataChange, onChangeView, onCancel, isNew, destinations) {
    this._event = event;
    this._container = container;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._eventComponent = new Event(event);
    this._destinations = destinations;
    this._eventEditComponent = new EventEdit(event, this._destinations);
    this._onCancel = onCancel;
    this.init(isNew);
  }

  _activateView() {
    if (this._container.getElement().contains(this._eventEditComponent.getElement())) {
      this._container.getElement().replaceChild(this._eventComponent.getElement(), this._eventEditComponent.getElement());
      this._eventEditComponent.resetForm();
    }
  }

  _activateEdit() {
    this._onChangeView();
    if (this._container.getElement().contains(this._eventComponent.getElement())) {
      this._container.getElement().replaceChild(this._eventEditComponent.getElement(), this._eventComponent.getElement());
    }
  }

  _readFormData(formData) {
    const selectedEventType = eventTypes.find(({title}) => title === formData.get(`event-type`));
    const destination = this._destinations.find(({name}) => name === formData.get(`event-destination`));
    const event = {
      type: selectedEventType ? selectedEventType : this._event.type,
      destination: destination ? destination : {name: formData.get(`event-destination`), description: ``, photo: []},
      timeStart: moment(formData.get(`event-start-time`), `DD.MM.YYYY HH:mm`),
      timeEnd: moment(formData.get(`event-end-time`), `DD.MM.YYYY HH:mm`),
      price: formData.get(`event-price`),
      offers: this._event.type.offers.reduce(((res, offer) => formData.get(`event-offer-${toKebab(offer.title)}`) === `on` ? [...res, offer] : [...res]), []),
      isFavorite: formData.get(`event-favorite`) === `on`,
    };
    return event;
  }

  init(isNew) {
    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._activateView();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };
    this._eventComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
      this._activateEdit(); document.addEventListener(`keydown`, onEscKeyDown);
    });
    this._eventEditComponent.getElement().querySelector(`.event--edit`).addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      const formData = new FormData(this._eventEditComponent.getElement().querySelector(`.event--edit`));
      const entry = this._readFormData(formData);
      this._onDataChange(isNew ? null : this._event, entry);
      this._activateView();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    this._eventEditComponent.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (isNew) {
        unrender(this._eventEditComponent);
        this._onCancel();
        return;
      }
      this._onDataChange(this._event, null);

    });

    this._eventEditComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
      if (!isNew) {
        this._activateView();
        document.addEventListener(`keydown`, onEscKeyDown);
      } else {
        unrender(this._eventEditComponent);
        this._onCancel();
      }

    });

    if (isNew) {
      render(this._container.getElement(), this._eventEditComponent.getElement(), Position.AFTERBEGIN);
    } else {
      render(this._container.getElement(), this._eventComponent.getElement());
    }
  }

}
