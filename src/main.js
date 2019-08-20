import {menu} from './components/menu';
import {filtersTemplate} from './components/filters';
import {tripEventEditForm} from './components/trip-event-edit-form';
import {tripInfo} from './components/trip-info';
import {tripDayItem} from './components/trip-day';
import {tripDayList} from './components/trip-day-list';
import {tripEventList} from './components/trip-event-list';
import {tripEventItem} from './components/trip-event';
import {getEvent, getFilters} from './data';


const render = (container, template, position = `beforeend`) =>{
  container.insertAdjacentHTML(position, template);
};


const events = [getEvent(), getEvent(), getEvent(), getEvent()]
  .sort((event1, event2)=> event1.timeStart - event2.timeStart);

events[0].edit = true;

const tripInfoElement = document.querySelector(`.trip-main__trip-controls`);


render(tripInfoElement, menu([{name: `Table`, link: `#`, active: true}, {name: `Stats`, link: `#`}]));

const tripInfoCostElement = document.querySelector(`.trip-info__cost`);
render(tripInfoCostElement, tripInfo(events), `beforebegin`);

let totalAmount = 0;
events.map(((event)=>{
  totalAmount += event.price;
  event.offers.map((offer) => {
    totalAmount += offer.price;
  });
}));
tripInfoCostElement.querySelector(`.trip-info__cost-value`).textContent = totalAmount;

const tripEventsElement = document.querySelector(`.trip-events`);
render(tripEventsElement, tripDayList());

const tripDaysElement = document.querySelector(`.trip-days`);

const days = new Set(events.map(({timeStart})=>(new Date(timeStart)).setHours(0, 0, 0, 0)));

Array.from(days).forEach((day, index) => {
  render(tripDaysElement, tripDayItem(index + 1, day));

  const tripDay = tripDaysElement.querySelector(`#day-${index + 1}`);
  render(tripDay, tripEventList());

  const eventsListItem = tripDay.querySelector(`.trip-events__list`);

  events.filter(({timeStart}) => new Date(day).toLocaleDateString() === new Date(timeStart).toLocaleDateString()).forEach((event)=>
    render(eventsListItem, event.edit ? tripEventEditForm(event) : tripEventItem(event)));
});

const tripControlsElement = document.querySelector(`.trip-main__trip-controls`);
render(tripControlsElement, filtersTemplate(getFilters(events)));
