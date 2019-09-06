import {AbstractComponent} from './abstract-component';
import {lodash} from 'lodash';
import {Chart} from 'chart.js';
import {createElement} from '../utils';

const BAR_HEIGHT = 55;

export class Statistics extends AbstractComponent {
  constructor(statistics, events) {
    super();
    this._statistics = statistics;
    this._events = events;
    this._charts = [];
  }
  getTemplate() {
    return `<section class="statistics">
    <h2>Trip statistics</h2>
  </section>`;
  }

  getElement() {
    if (!this._element) {
      const element = createElement(this.getTemplate());
      this._statistics.forEach(({name}) => {
        const ctx = createElement(`<canvas class="statistics__chart  statistics__chart--${name}" width="900"></canvas>`);
        const statContainer = createElement(`<div class="statistics__item statistics__item--${name}"></div>`);
        statContainer.appendChild(ctx);
        element.appendChild(statContainer);
        const chart = new Chart(ctx, this.configChart(this.getStatistics(name, this._events), name));
        this._charts.push(chart);
        this._element = element;
      });

    }

    return this._element;
  }


  getStatistics(name, events) {
    switch (name) {
      case `transport`: return this.getTransportData(events);
      case `money`: return this.getMoneyData(events);
      case `time`: return this.getTimeData(events);
      default: return null;
    }
  }


  getTransportData(events) {
    return this.calcStatistics(events);
  }

  getMoneyData(events) {
    return this.calcStatistics(events);
  }
  getTimeData(events) {
    return this.calcStatistics(events);
  }

  calcStatistics(events) {
    return {labels: [`test`], data: [12]};
  }

  configChart({labels, data}, title) {
    return {
      plugins: [labels],
      type: `horizontalBar`,
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            display: false
          }
        },
        title: {
          display: true,
          text: title.toUpperCase(),
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    };
  }
}
