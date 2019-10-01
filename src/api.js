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

  createEvent(event) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(ModelEvent.eventForUpload(event)),
      headers: new Headers({'Content-Type': `application/json`})
    })
        .then(toJSON)
        .then(ModelEvent.parseEvent);
  }

  updateEvent(id, data) {
    const uploadData = ModelEvent.eventForUpload(data);
    return this
    ._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(uploadData),
      headers: new Headers({'Content-Type': `application/json`})
    })
    .then(toJSON)
    .then(ModelEvent.parseEvent);
  }

  deleteEvent(id) {
    return this._load({url: `points/${id}`, method: Method.DELETE});
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
