import {Menu} from './components/menu';
import {Filters} from './components/filters';
import {TripInfo} from './components/trip-info';
import {getFilters, eventTypes} from './data';
import {render, Position} from './utils';
import {TripController} from './controllers/trip-controller';
import {Statistics} from './components/statistics';
import {Api} from './api';

const tripInfoElement = document.querySelector(`.trip-main__trip-controls`);
const tripInfoCostElement = document.querySelector(`.trip-info__cost`).querySelector(`.trip-info__cost-value`);

const menu = new Menu([{name: `table`, link: `#`, active: true}, {name: `stats`, link: `#`}]);
render(tripInfoElement, menu.getElement());
const tripInfo = document.querySelector(`.trip-main__trip-info`);

const api = new Api({endPoint: `https://htmlacademy-es-9.appspot.com/big-trip`, authorization: `Basic test84848`});

const extendEventTypes = (offersData)=> {
  const types = eventTypes;
  types.map((type) => {
    const typeOffers = offersData.find((offer) => {
      return offer.type === type.title;
    });
    type.offers = typeOffers.offers;
  });
  return types;
};

Promise.all([
  api.getOffers(),
  api.getDestinations(),
  api.getEvents()
]).then(([offers, destinations, events]) => {
  const extendedEventTypes = extendEventTypes(offers);
  render(tripInfo, new TripInfo(events).getElement(), Position.AFTERBEGIN);
  const tripEventsElement = document.querySelector(`.trip-events`);
  const filters = new Filters(getFilters());
  const tripController = new TripController(events,
      tripEventsElement,
      tripInfoCostElement,
      filters,
      destinations,
      extendedEventTypes,
      api);
  const statistics = new Statistics([{name: `money`}, {name: `transport`}, {name: `time`}], events);
  statistics.hide();

  const menuOnClick = (evt) => {
    evt.preventDefault();
    const target = evt.target;
    if (target.tagName.toLowerCase() !== `a`) {
      return;
    }
    target.classList.add(`trip-tabs__btn--active`);
    if (target.previousElementSibling) {
      target.previousElementSibling.classList.remove(`trip-tabs__btn--active`);
    } else {
      target.nextElementSibling.classList.remove(`trip-tabs__btn--active`);
    }
    switch (target.dataset.switch) {
      case `table`:
        statistics.hide();
        tripController.show();
        break;
      case `stats`:
        tripController.hide();
        statistics.show();
        break;
    }
  };

  const newPointOnClick = () => {
    menu.getElement().querySelector(`a[data-switch="table"]`).classList.add(`trip-tabs__btn--active`);
    menu.getElement().querySelector(`a[data-switch="stats"]`).classList.remove(`trip-tabs__btn--active`);
    statistics.hide();
    tripController.show();
    tripController.createEvent();
  };

  const addNewPointBtn = document.querySelector(`.trip-main__event-add-btn`);
  const tripControlsElement = document.querySelector(`.trip-main__trip-controls`);
  menu.getElement().addEventListener(`click`, menuOnClick);
  addNewPointBtn.addEventListener(`click`, newPointOnClick);
  render(tripControlsElement, filters.getElement());
  render(tripEventsElement.parentNode, statistics.getElement());
  tripController.init();
});
