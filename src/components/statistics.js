import {AbstractComponent} from './abstract-component';

export class Statistics extends AbstractComponent {
  constructor(statistics) {
    super();
    this._statistics = statistics;
  }
  getTemplate() {
    return `<section class="statistics">
    <h2>Trip statistics</h2>
    ${this._statistics.map(({name}) => `<div class="statistics__item statistics__item--${name}">
    <canvas class="statistics__chart  statistics__chart--${name}" width="900"></canvas>
  </div>`).join(``)}
  </section>`;
  }
  update(events) {


  }
}
