import {menu} from './components/menu';
import {filters} from './components/filters';
import {tripEventEditForm} from './components/trip-event-edit-form';
import {tripInfo} from './components/trip-info';
import {tripDayItem} from './components/trip-day';
import {tripDayList} from './components/trip-day-list';
import {tripEventList} from './components/trip-event-list';
import {tripEventItem} from './components/trip-event';

const render = (container, template, position = `beforeend`) =>{
  container.insertAdjacentHTML(position, template);
};

const tripInfoElement = document.querySelector(`.trip-main__trip-info`);
render(tripInfoElement, menu());

const tripInfoCostElement = document.querySelector(`.trip-info__cost`);
render(tripInfoCostElement, tripInfo(), `beforebegin`);

const tripControlsElement = document.querySelector(`.trip-main__trip-controls`);
render(tripControlsElement, filters());

const tripEventsElement = document.querySelector(`.trip-events`);
render(tripEventsElement, tripDayList());

const tripDaysElement = document.querySelector(`.trip-days`);
render(tripDaysElement, tripDayItem(1, `2019-03-18`, `MAR 18`));

const tripDay = document.querySelector(`.trip-days__item`);
render(tripDay, tripEventList());

const eventsListItem = tripDay.querySelector(`.trip-events__list`);
render(eventsListItem, tripEventEditForm());
render(eventsListItem, tripEventItem());
render(eventsListItem, tripEventItem());
render(eventsListItem, tripEventItem());
