import {render} from '../utils';
import {Event} from './trip-event';
import {EventEdit} from './trip-event-edit-form';

export class PointController {
  constructor(event, container, onDataChange, onChangeView) {
    this._event = event;
    this._container = container;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._eventComponent = new Event(event);
    this._eventEditComponent = new EventEdit(event);

    this.init();
  }

  _renderEvent() {
    const activateView = () => {
      this._container.getElement().replaceChild(this._eventComponent.getElement(), this._eventEditComponent.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    };
    const activateEdit = () => {
      this._container.getElement().replaceChild(this._eventEditComponent.getElement(), this._eventComponent.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    };
    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        activateView();
      }
    };
    this._eventComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => activateEdit());
    this._eventEditComponent.getElement().querySelector(`.event--edit`).addEventListener(`submit`, (evt) => {
      console.log(evt);
      evt.preventDefault();
      const formData = new FormData(this._eventEditComponent.getElement().querySelector(`.event--edit`));

      const entry = {
        type: formData.get(`event-type-toggle`),
        destination: formData.get(`event-destination`),
        timeStart: new Date(formData.get(`event-start-time`)),
        timeEnd: new Date(formData.get(`event-end-time`)),
        price: formData.get(`event-price`),
        offers: formData.getAll(`event-offer`)
      };

      console.log(entry);

      this._onDataChange(this._event, entry);
      activateView();
    });
    this._eventEditComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
      activateView();
      document.addEventListener(`keydown`, onEscKeyDown);
    });
    render(this._container.getElement(), this._eventComponent.getElement());
  }

  init() {
    this._renderEvent(this._event);
  }

}
