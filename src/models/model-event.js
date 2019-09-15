import {eventTypes} from '../data';

export class ModelEvent {
  constructor(data) {
    this.id = data.id;
    this.destination = data.destination;
    this.timeStart = data.date_from;
    this.timeEnd = data.date_to;
    this.price = data.base_price;
    this.isFavorite = data.is_favorite;
    this.type = this.findEventType(data.type);
    this.offers = data.offers;
  }

  findEventType(type) {
    return eventTypes.find(({title})=> title === type);
  }

  static parseEvent(data) {
    return new ModelEvent(data);
  }

  static parseEvents(data) {
    return data.map(ModelEvent.parseEvent);
  }

}
