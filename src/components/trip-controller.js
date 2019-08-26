import {EventList, EmptyEventList} from './trip-event-list';
import {Event} from './trip-event';
import {TripDay} from './trip-day';
import {EventEdit} from './trip-event-edit-form';
import {render} from '../utils';
import {TripDayList} from './trip-day-list';

export class TripController {
  constructor(events, container) {
    this._events = events;
    this._container = container;
  }
  init() {
    const tripDaysElement = this._events.length > 0 ? new TripDayList().getElement() : new EmptyEventList().getElement();
    render(this._container, tripDaysElement);
    const days = new Set(this._events.map(({timeStart})=>(new Date(timeStart)).setHours(0, 0, 0, 0)));

    Array.from(days).forEach((day, index) => {
      let dayElement = new TripDay(day, index + 1).getElement();
      render(tripDaysElement, dayElement);

      const eventsList = new EventList().getElement();
      render(dayElement, eventsList);

      this._events.filter(({timeStart}) => new Date(day).toLocaleDateString() === new Date(timeStart).toLocaleDateString()).forEach((event)=> {
        let eventComponent = new Event(event);
        let eventEditComponent = new EventEdit(event);

        const onEscKeyDown = (evt) => {
          if (evt.key === `Escape` || evt.key === `Esc`) {
            eventsList.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
            document.removeEventListener(`keydown`, onEscKeyDown);
          }
        };

        eventComponent.getElement()
          .querySelector(`.event__rollup-btn`)
          .addEventListener(`click`, () => {
            eventsList.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
            document.addEventListener(`keydown`, onEscKeyDown);
          });

        eventEditComponent.getElement()
          .querySelector(`.event__rollup-btn`)
          .addEventListener(`click`, () => {
            eventsList.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
            document.addEventListener(`keydown`, onEscKeyDown);
          });

        eventEditComponent.getElement()
          .querySelector(`.event__save-btn`)
          .addEventListener(`click`, () => {
            eventsList.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
            document.removeEventListener(`keydown`, onEscKeyDown);
          });


        render(eventsList, eventComponent.getElement());
      });
    });
  }
}
