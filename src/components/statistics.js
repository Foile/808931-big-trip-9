import {AbstractComponent} from './abstract-component';
// import {_} from 'lodash';
import {Chart} from 'chart.js';
import {createElement} from '../utils';
import moment from 'moment';
import {eventTypes} from '../data';

const BAR_HEIGHT = 40;

export class Statistics extends AbstractComponent {
  constructor(statistics, events) {
    super();
    this._statistics = statistics;
    this._events = events;
    this._charts = [];
  }
  getTemplate() {
    return `<section class="statistics"><h2>Trip statistics</h2></section>`;
  }

  getElement() {
    if (!this._element) {
      const element = createElement(this.getTemplate());
      this._statistics.forEach(({name}) => {
        const ctx = createElement(`<canvas class="statistics__chart  statistics__chart--${name}" width="900"></canvas>`);
        const statContainer = createElement(`<div class="statistics__item statistics__item--${name}"></div>`);
        statContainer.appendChild(ctx);
        element.appendChild(statContainer);
        const stat = this.getStatistics(name, this._events);
        ctx.height = stat.data.length * (BAR_HEIGHT + 2);
        const chart = new Chart(ctx, this.configChart(stat, name === `time` ? `time spent` : name));
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

  getChartTitle(title) {
    return `${eventTypes.find((eventType) => eventType.title === title).emoji} ${title.toUpperCase()}`;
  }

  getTransportData(events) {
    let obj = new Map();
    events.filter(({type}) => type.type === `transfer`).forEach(({type}) => {
      const title = this.getChartTitle(type.title);
      const cnt = obj.has(title) ? obj.get(title) : 0;
      obj.set(title, cnt + 1);
    });
    return {labels: [...obj.keys()], data: [...obj.values()]};
  }

  getMoneyData(events) {
    let obj = new Map();
    events.forEach(({type, price}) => {
      const title = this.getChartTitle(type.title);
      const prc = obj.has(title) ? obj.get(title) : 0;
      obj.set(title, prc + price);
    });
    return {labels: [...obj.keys()], data: [...obj.values()]};
  }

  getTimeData(events) {
    let obj = new Map();
    events.forEach(({type, timeStart, timeEnd}) => {
      const title = this.getChartTitle(type.title);
      const time = Math.abs(moment(timeEnd).diff(moment(timeStart)));
      const cnt = obj.has(title) ? obj.get(title) : 0;
      obj.set(title, cnt + time);
    });
    return {labels: [...obj.keys()], data: [...obj.values()]};
  }

  configChart({labels, data}, title) {
    return {
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
            display: true
          },
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
              fontSize: 10,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: BAR_HEIGHT,
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
            minBarLength: 20

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
