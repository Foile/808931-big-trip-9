
import {AbstractComponent} from './abstract-component';

export class TripInfo extends AbstractComponent {
  constructor(trip) {
    super();
    this._trip = trip;
  }
  getTemplate() {
    // здесь не нужен map, если элементы внутри цикла пушится
    const destinations = [];
    this._trip.forEach(({destination}) => {

      const last = destinations[destinations.length - 1];

      if (last || last !== destination.name) {
        destinations.push(destination.name);
      }
    });

    // константа 3 + можно вынести оба рассчета (длины и даты) в функции

    return this._trip.length > 0 ? `<div class="trip-info__main">
      <h1 class="trip-info__title">${destinations.length <= 3 ? destinations.join(`-`) : destinations[0] + `-...-` + destinations[destinations.length - 1]}</h1>
      <p class="trip-info__dates">${new Date(this._trip[0].timeStart).toDateString()} - ${new Date(this._trip[this._trip.length - 1].timeEnd).toDateString()}</p>
      </div>` : ``;
  }
}
