
import AbstractComponent from './abstract-component';

export default class TripDayList extends AbstractComponent {
  getTemplate() {
    return `<ul class="trip-days"></ul>`;
  }
}
