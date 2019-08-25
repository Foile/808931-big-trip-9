
import {AbstractComponent} from './abstract-component';

export class EventList extends AbstractComponent {
  getTemplate() {
    return `<ul class="trip-events__list"></ul>`;
  }
}
