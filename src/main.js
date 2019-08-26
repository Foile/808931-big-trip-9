import {Menu} from './components/menu';
import {Filters} from './components/filters';
import {EventEdit} from './components/trip-event-edit-form';
import {TripInfo} from './components/trip-info';
import {TripDay} from './components/trip-day';
import {TripDayList} from './components/trip-day-list';
import {EventList, EmptyEventList} from './components/trip-event-list';
import {Event} from './components/trip-event';
import {getEvent, getFilters} from './data';
import {render, Position} from './utils';

const EVENT_COUNT = 0;

const events = Array(EVENT_COUNT).fill().map(()=> getEvent())
  .sort((event1, event2)=> event1.timeStart - event2.timeStart);

const tripInfoElement = document.querySelector(`.trip-main__trip-controls`);

render(tripInfoElement, new Menu([{name: `Table`, link: `#`, active: true}, {name: `Stats`, link: `#`}]).getElement());

const tripInfo = document.querySelector(`.trip-main__trip-info`);
render(tripInfo, new TripInfo(events).getElement(), Position.AFTERBEGIN);

const tripInfoCostElement = document.querySelector(`.trip-info__cost`);

let totalAmount = 0;
events.map(((event)=>{
  totalAmount += event.price;
  event.offers.map((offer) => {
    totalAmount += offer.price;
  });
}));

tripInfoCostElement.querySelector(`.trip-info__cost-value`).textContent = totalAmount;

const tripEventsElement = document.querySelector(`.trip-events`);
const tripDaysElement = events.length > 0 ? new TripDayList().getElement() : new EmptyEventList().getElement();
render(tripEventsElement, tripDaysElement);

const days = new Set(events.map(({timeStart})=>(new Date(timeStart)).setHours(0, 0, 0, 0)));

Array.from(days).forEach((day, index) => {
  let dayElement = new TripDay(day, index + 1).getElement();
  render(tripDaysElement, dayElement);

  const eventsList = new EventList().getElement();
  render(dayElement, eventsList);

  events.filter(({timeStart}) => new Date(day).toLocaleDateString() === new Date(timeStart).toLocaleDateString()).forEach((event)=> {
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

const tripControlsElement = document.querySelector(`.trip-main__trip-controls`);
render(tripControlsElement, new Filters(getFilters(events)).getElement());
