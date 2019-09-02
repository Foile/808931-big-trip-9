import {EventList, EmptyEventList} from './trip-event-list';
import {TripDay} from './trip-day';
import {render} from '../utils';
import {TripDayList} from './trip-day-list';
import {Sort} from './sort';
import {PointController} from './point-controller';

export class TripController {
  constructor(events, container) {
    this._events = events;
    this._originEvents = Object.assign(events);
    this._container = container;
    this._sort = new Sort();
    this._days = new TripDayList();
    this._points = [];
  }

  _onSortLinkClick(evt) {
    if (evt.target.tagName[0] !== `L`) {
      return;
    }
    evt.preventDefault();
    evt.target.form.querySelector(`#sort-${evt.target.dataset.sortType}`).checked = true;

    this._container.innerHTML = ``;
    render(this._container, this._sort.getElement());
    this._events = this._originEvents;
    switch (evt.target.dataset.sortType) {
      case `time`:
        this._renderSortedEvents((a, b) => (a.timeEnd - a.timeStart) - (b.timeEnd - b.timeStart));
        break;
      case `price`:
        this._renderSortedEvents((a, b) => a.price - b.price);
        break;
      default:
        this._renderDayEvents();
        break;
    }
  }

  _renderSortedEvents(sorting) {
    this._days.getElement().innerHTML = ``;
    const tripDays = this._events.length > 0 ? new TripDayList() : new EmptyEventList();
    render(this._container, tripDays.getElement());
    this._days = tripDays;
    const tripDay = new TripDay();
    render(tripDays.getElement(), tripDay.getElement());
    const eventContainer = new EventList();
    render(tripDay.getElement(), eventContainer.getElement());
    this._events = this._events.slice().sort(sorting);
    this._events.forEach((event) => {
      const point = new PointController(event, eventContainer, this.onDataChange, this.onChangeView);
      this._points.push(point);
    });
  }

  _renderDayEvents() {
    this._days.getElement().innerHTML = ``;
    const tripDays = this._events.length > 0 ? new TripDayList() : new EmptyEventList();
    render(this._container, tripDays.getElement());
    this._days = tripDays;
    const days = new Set(this._events.map(({timeStart}) => (new Date(timeStart)).setHours(0, 0, 0, 0)));
    Array.from(days).forEach((day, index) => {
      let dayElement = new TripDay(day, index + 1).getElement();
      render(tripDays.getElement(), dayElement);
      const eventContainer = new EventList();
      render(dayElement, eventContainer.getElement());
      this._events.filter(({timeStart}) => new Date(day).toLocaleDateString() === new Date(timeStart).toLocaleDateString())
        .forEach((event) => {
          const point = new PointController(event, eventContainer, this.onDataChange, this.onChangeView);
          this._points.push(point);
        });
    });
  }

  init() {
    render(this._container, this._sort.getElement());
    this._renderDayEvents(this._events);
    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }

  onDataChange(oldData, newData) {
    this._events[this._events.findIndex((event) => event === oldData)] = newData;
    this._renderDayEvents(this._events);
  }
  onChangeView() {}
}
