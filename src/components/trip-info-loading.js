
import AbstractComponent from './abstract-component';

export default class TripInfoLoading extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `Loading...`;
  }
}

