
import {AbstractComponent} from './abstract-component';

const MAX_CITY_SHOW = 3;

export class TripInfo extends AbstractComponent {
  constructor(trip) {
    super();
    this._trip = trip;
  }

  getTemplate() {
    {
      const destinations = this._trip.reduce((acc, {destination}) => {
        const last = acc[acc.length - 1];
        if (last || last !== destination.name) {
          acc.push(destination.name);
        }
        return acc;
      }, []);

      return this._trip.length > 0 ? `<div class="trip-info__main">
      <h1 class="trip-info__title">${destinations.length <= MAX_CITY_SHOW ? destinations.join(`-`) : `${destinations[0]}-...-${destinations[destinations.length - 1]}`}
      </h1>
      <p class="trip-info__dates">
      ${new Date(this._trip[0].timeStart).toDateString()} - ${new Date(this._trip[this._trip.length - 1].timeEnd).toDateString()}</p>
      </div>` : ``;
    }
  }
}
