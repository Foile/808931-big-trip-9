import {eventTypes} from './data';
import TripController from './controllers/trip-controller';
import Api from './api';
import TripInfoLoading from './components/trip-info-loading';
import {render, unrender, Position} from './utils';

const tripInfo = document.querySelector(`.trip-main__trip-info`);
const tripControlsElement = document.querySelector(`.trip-main__trip-controls`);
const tripInfoCostElement = document.querySelector(`.trip-info__cost`).querySelector(`.trip-info__cost-value`);
const replacer = new TripInfoLoading();

const api = new Api({endPoint: `https://htmlacademy-es-9.appspot.com/big-trip`, authorization: `Basic test84848`});

const extendEventTypes = (offersData) => {
  const types = eventTypes;
  types.map((type) => {
    const typeOffers = offersData.find((offer) => {
      return offer.type === type.title;
    });
    type.offers = typeOffers.offers;
  });
  return types;
};

render(tripInfo, replacer.getElement(), Position.AFTERBEGIN);

Promise.all([
  api.getOffers(),
  api.getDestinations(),
  api.getEvents()
]).then(([offers, destinations, events]) => {
  unrender(replacer);
  const extendedEventTypes = extendEventTypes(offers);
  const tripEventsElement = document.querySelector(`.trip-events`);
  const tripController = new TripController(events,
      tripEventsElement,
      tripInfo,
      tripControlsElement,
      tripInfoCostElement,
      destinations,
      extendedEventTypes,
      api);

  tripController.init();
}).catch(() => {
  unrender(replacer);
});
