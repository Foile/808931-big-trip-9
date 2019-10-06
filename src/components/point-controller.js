import {render, unrender, Position, toKebab} from '../utils';
import {Event} from './trip-event';
import {EventEdit} from './trip-event-edit-form';
import moment from 'moment';
import DOMpurify from 'dompurify';

export class PointController {
  constructor(event, container, onDataChange, onChangeView, onCancel, isNew, destinations, eventTypes) {
    this._event = event;
    this._container = container;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._eventComponent = new Event(event);
    this._destinations = destinations;
    this._eventTypes = eventTypes;
    this._eventEditComponent = new EventEdit(event, destinations, eventTypes);
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
    const selectedEventType = this._eventTypes.find(({title}) => title === DOMpurify.sanitize(formData.get(`event-type`)));
    const type = selectedEventType ? selectedEventType : this._event.type;
    const destination = this._destinations.find(({name}) => name === DOMpurify.sanitize(formData.get(`event-destination`)));

    const offers = Array.from(new Set([...this._event.offers, ...type.offers]))
      .reduce((res, offer) => {
        const accepted = formData.get(`event-offer-${toKebab(offer.title)}`) === `on`;
        offer.accepted = accepted;
        if (!res.find((off) => off.title === offer.title)) {
          return [...res, offer];
        }
        return [...res];
      }, []);

    const event = {
      id: this._event.id,
      type,
      destination: destination ? destination : {name: formData.get(`event-destination`), description: ``, photo: []},
      timeStart: moment(formData.get(`event-start-time`), `DD.MM.YY HH:mm`),
      timeEnd: moment(formData.get(`event-end-time`), `DD.MM.YY HH:mm`),
      price: formData.get(`event-price`),
      offers,
      isFavorite: formData.get(`event-favorite`) === `on`,
    };
    return event;
  }

  init(isNew) {

    // по-хорошему надо переносить работу с evt, querySelector, add/removeEventListener в компонтенты,
    // а в контроллерах оставлять только логику типа _activateView
    // но это доп критерий, а отнять может много времени, поэтому в самую последнюю очередь есть смысл делать
    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._activateView();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    // стоит записывать элементы в переменные, чтобы было понятнее
    const rollupBtn = this._eventComponent.getElement().querySelector(`.event__rollup-btn`);

    rollupBtn.addEventListener(`click`, () => {
      this._activateEdit();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    // основная рекомендация - это разносить сильнее код на функции и переменные,
    // чтобы не приходилось читать какой-то системный внутренний код, а читать названия

    // а по поводу выноса логики из Контроллеров - это вообще самый верхний уровень приложения
    // тут только какая-то базовая и управляющая логика приложения должна быть
    // а получается, что сейчас здесь все приложение сосредоточено
    // так что тут хотя бы работу с DOM стоит выносить в компоненты
    // а при дальнейшем разделении можно пробовать выносить какую-то логику в отдельные модули с какой-то логикой
    // но это такая общая рекомендация на будущее, потому что на это времени много уйдет и сейчас смысла этого делать нет

    const eventEditForm = this._eventEditComponent.getElement().querySelector(`.event--edit`);

    eventEditForm.addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      // дублирование переменных и селекторов
      const formData = new FormData(eventEditForm);
      const event = this._readFormData(formData);
      this._eventEditComponent.lock(`save`);

      this._onDataChange(isNew ? null : this._event, event)
      .then(() => {
        this._activateView();
        document.removeEventListener(`keydown`, onEscKeyDown);
        this._eventEditComponent.unlock();
      })
      .catch(() => {
        this._eventEditComponent.shake();
        this._eventEditComponent.unlock();
      });
    });

    this._eventEditComponent.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (isNew) {
        unrender(this._eventEditComponent);
        this._onCancel();
        return;
      }
      this._eventEditComponent.lock(`delete`);
      this._onDataChange(this._event, null)
      .then(() => {
        this._activateView();
        document.removeEventListener(`keydown`, onEscKeyDown);
        this._eventEditComponent.unlock();
      })
      .catch(() => {
        this._eventEditComponent.shake();
        this._eventEditComponent.unlock();
      });

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
