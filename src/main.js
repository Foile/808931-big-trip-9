import {Menu} from './components/menu';
import {Filters} from './components/filters';
import {TripInfo} from './components/trip-info';
import {TripDayList} from './components/trip-day-list';
import {EmptyEventList} from './components/trip-event-list';
import {getEvent, getFilters} from './data';
import {render, Position} from './utils';
import {TripController} from './components/trip-controller';

const EVENT_COUNT = 6;

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


new TripController(events, tripEventsElement).init();

const tripControlsElement = document.querySelector(`.trip-main__trip-controls`);
render(tripControlsElement, new Filters(getFilters(events)).getElement());
