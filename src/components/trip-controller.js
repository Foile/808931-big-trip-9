import {EventList, EmptyEventList} from './trip-event-list';
import {TripDay} from './trip-day';
import {render, unrender, calcPrice, Position} from '../utils';
import {TripDayList} from './trip-day-list';
import {Sort} from './sort';
import {PointController} from './point-controller';
import {getFilters, eventTypes} from '../data';


export class TripController {
  constructor(events, container, totalPriceElement, filters, destinations, api) {
    this._events = events;
    this._container = container;
    this._sort = new Sort();
    this._days = new TripDayList();
    this._views = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
    this._onCancel = this._onCancel.bind(this);
    this._totalPriceElement = totalPriceElement;
    this._addEventController = null;
    this._addEventContainer = null;
    this._filters = filters;
    this._currentFilter = getFilters()[0];
    this._currentSort = `day`;
    this._destinations = destinations;
    this._api = api;
  }

  _onSortLinkClick(evt) {
    if (evt.target.tagName[0] !== `L`) {
      return;
    }
    evt.preventDefault();
    evt.target.form.querySelector(`#sort-${evt.target.dataset.sortType}`).checked = true;
    this._container.innerHTML = ``;
    this._sort.getElement().querySelector(`.trip-sort__item--day`).innerHTML = ``;
    render(this._container, this._sort.getElement());
    this._currentSort = evt.target.dataset.sortType;
    this.update();
  }

  _renderEvents(container, events) {
    events.filter(this._currentFilter.callback).forEach((event) => {
      const point = new PointController(event,
          container,
          this._onDataChange,
          this._onChangeView,
          null,
          false,
          this._destinations);
      this._views.push(point._activateView.bind(point));
    });
    this._totalPriceElement.textContent = calcPrice(this._events);
  }

  _renderSortedEvents(sorting) {
    this._days.getElement().innerHTML = ``;
    const tripDays = this._events.length > 0 ? new TripDayList() : new EmptyEventList();
    render(this._container, tripDays.getElement());
    this._days = tripDays;
    const tripDay = new TripDay();
    render(tripDays.getElement(), tripDay.getElement());
    this._eventContainer = new EventList();
    render(tripDay.getElement(), this._eventContainer.getElement());
    this._renderEvents(this._eventContainer, this._events.slice().sort(sorting));
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
      this._eventContainer = new EventList();
      render(dayElement, this._eventContainer.getElement());
      const dayEvents = this._events.filter(
          ({timeStart}) => new Date(day).toLocaleDateString() === new Date(timeStart).toLocaleDateString()
      );
      this._renderEvents(this._eventContainer, dayEvents);
    });
  }

  _onFilterClick(evt) {
    if (evt.target.tagName[0].toLowerCase() !== `i`) {
      return;
    }
    this._currentFilter = getFilters().find(({title})=>evt.target.value === title.toLowerCase());
    this.update();
  }

  init() {
    render(this._container, this._sort.getElement());
    this._renderDayEvents();
    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
    this._filters.getElement().addEventListener(`click`, (evt)=> this._onFilterClick(evt));
  }

  hide() {
    const classes = this._container.classList;
    if (!classes.contains(`visually-hidden`)) {
      classes.add(`visually-hidden`);
    }
  }

  show() {
    const classes = this._container.classList;
    if (classes.contains(`visually-hidden`)) {
      classes.remove(`visually-hidden`);
    }
  }

  update() {
    switch (this._currentSort) {
      case `time`:
        this._renderSortedEvents((a, b) => (a.timeEnd - a.timeStart) - (b.timeEnd - b.timeStart));
        break;
      case `price`:
        this._renderSortedEvents((a, b) => a.price - b.price);
        break;
      default:
        this._renderDayEvents();
        this._sort.getElement().querySelector(`.trip-sort__item--day`).innerHTML = `Day`;
        break;
    }
  }
  _onDataChange(oldData, newData) {
    const index = this._events.findIndex((event) => event === oldData);
    if (newData === null) {
      return this._api.deleteEvent(oldData.id)
      .then(() => {
        this._events = [...this._events.slice(0, index), ...this._events.slice(index + 1)];
      }).then(()=>{
        this.update();
      });
    } else if (oldData === null) {
      this._addEventController = null;
      return this._api.createEvent(newData)
      .then((event) => {
        this._events = [event, ...this._events];
      }).then(()=>{
        this.update();
      });
    } else {
      return this._api.updateEvent(oldData.id, newData)
      .then((event) => {
        this._events[index] = event;
      }).then(()=>{
        this.update();
      });
    }
  }

  _onChangeView() {
    this._views.forEach((activateView) => activateView());
  }

  _onCancel() {
    this._addEventController = null;
    unrender(this._addEventContainer);
  }

  createEvent() {
    if (this._addEventController !== null) {
      return;
    }
    let event = {
      type: eventTypes[0],
      destination: this._destinations[0],
      timeStart: Date.now(),
      timeEnd: Date.now(),
      price: 0,
      isFavorite: false,
      offers: eventTypes[0].offers
    };
    const tripDay = new TripDay();
    render(this._days.getElement(), tripDay.getElement(), Position.AFTERBEGIN);
    this._eventContainer = new EventList();
    render(tripDay.getElement(), this._eventContainer.getElement(), Position.BEFOREEND);
    this._addEventContainer = tripDay;
    this._addEventController = new PointController(event,
        this._eventContainer,
        this._onDataChange,
        this._onChangeView,
        this._onCancel,
        true,
        this._destinations);
  }
}
