
import {AbstractComponent} from './abstract-component';

export class TripInfo extends AbstractComponent {
  constructor(trip) {
    super();
    this._trip = trip;
  }
  getTemplate() {
    {
      const destinations = [];
      this._trip.map(({destination})=> destinations[destinations.length - 1] && destinations[destinations.length - 1] === destination.name ? {} : destinations.push(destination.name));
      return this._trip.length > 0 ? `<div class="trip-info__main">
      <h1 class="trip-info__title">${destinations.length <= 3 ? destinations.join(`-`) : destinations[0] + `-...-` + destinations[destinations.length - 1]}</h1>
      <p class="trip-info__dates">${new Date(this._trip[0].timeStart).toDateString()} - ${new Date(this._trip[this._trip.length - 1].timeEnd).toDateString()}</p>
      </div>` : ``;
    }
  }
}
