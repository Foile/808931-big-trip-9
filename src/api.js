import {ModelEvent} from './models/model-event';
import {ModelOffer} from './models/model-offer';
import {ModelDestination} from './models/model-destination';
const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};
const toJSON = (response) => {
  return response.json();
};
export class Api {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getEvents() {
    return this._load({url: `points`}).then(toJSON).then(ModelEvent.parseEvents);
  }

  getOffers() {
    return this._load({url: `offers`}).then(toJSON).then(ModelOffer.parseTypeOffers);
  }
  getDestinations() {
    return this._load({url: `destinations`}).then(toJSON).then(ModelDestination.parseDestinations);
  }

  createEvent({Event}) {
  }

  updateEvent({id, data}) {
  }

  deleteEvent({id}) {
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(`fetch error: ${err}`);
        throw err;
      });
  }
}
