import {EventList, EmptyEventList} from './trip-event-list';
import {Event} from './trip-event';
import {TripDay} from './trip-day';
import {EventEdit} from './trip-event-edit-form';
import {render} from '../utils';
import {TripDayList} from './trip-day-list';
import {Sort} from './sort';

export class TripController {
  constructor(events, container) {
    this._events = events;
    this._originEvents = Object.assign(events);
    this._container = container;
    this._sort = new Sort();
    // this._eventsList = new EventList();
    this._days = new TripDayList();
  }

  _onSortLinkClick(evt) {
    console.log(evt.target);
    evt.preventDefault();
    console.log(evt.target);
    if (evt.target.tagName !== `A`) {
      return;
    }
    this._container.getElement().innerHTML = ``;
    this._events = this._originEvents;

    switch (evt.target.dataset.sortType) {
      case `time`:
        this._events = this._events.slice().sort((a, b) => (a.timeEnd - a.timeStart) - (b.timeEnd - b.timeStart));
        // this._updateEvents(this._events);
        this._events.forEach((event)=> {
          this._renderEvent(this._container.getElement(), event);
        });
        break;
      case `price`:
        this._events = this._events.slice().sort((a, b) => a.price - b.price);
        this._events.forEach((event)=> {
          this._renderEvent(this._container.getElement(), event);
        });
        break;
      case `event`:
        this._updateEvents(this._events);
        break;
    }
  }

  _renderEvent(container, event) {
    let eventComponent = new Event(event);
    let eventEditComponent = new EventEdit(event);
    const activateView = () => {
      container.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    };
    const activateEdit = () => {
      container.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    };
    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        activateView();
      }
    };
    eventComponent.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        activateEdit();
      });
    eventEditComponent.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        activateView();
        document.addEventListener(`keydown`, onEscKeyDown);
      });
    eventEditComponent.getElement()
      .querySelector(`.event__save-btn`)
      .addEventListener(`click`, () => {
        container.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      });
    render(container, eventComponent.getElement());
  }

  _updateEvents(events) {
    const tripDaysElement = events.length > 0 ? this._days.getElement() : new EmptyEventList().getElement();
    render(this._container, tripDaysElement);
    const days = new Set(this._events.map(({timeStart})=>(new Date(timeStart)).setHours(0, 0, 0, 0)));

    Array.from(days).forEach((day, index) => {
      const eventContainer = new EventList();
      let dayElement = new TripDay(day, index + 1).getElement();
      render(tripDaysElement, dayElement);
      render(dayElement, eventContainer.getElement());
      events.filter(({timeStart}) => new Date(day).toLocaleDateString() === new Date(timeStart).toLocaleDateString())
      .forEach((event)=> {
        this._renderEvent(eventContainer.getElement(), event);
      });
    });
  }
  init() {
    this._updateEvents(this._events);
    this._sort.getElement()
    .addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }
}
