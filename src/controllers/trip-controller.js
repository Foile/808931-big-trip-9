import EventList from '../components/trip-event-list';
import EmptyEventList from '../components/trip-event-list-empty';
import TripDay from '../components/trip-day';
import {render, unrender, calcPrice, Position} from '../utils';
import TripDayList from '../components/trip-day-list';
import TripInfo from '../components/trip-info';
import Sort from '../components/sort';
import PointController from './point-controller';
import {getFilters, calcFilters} from '../data';
import Filters from '../components/filters';
import Statistics from '../components/statistics';
import Menu from '../components/menu';

export default class TripController {
  constructor(events, container, tripInfo, filtersContainer, totalPriceElement, destinations, eventTypes, api) {
    this._events = events;
    this._container = container;
    this._infoContainer = tripInfo;
    this._filtersContainer = filtersContainer;
    this._totalPriceElement = totalPriceElement;
    this._destinations = destinations;
    this._eventTypes = eventTypes;
    this._api = api;
    this._filters = new Filters(getFilters(), calcFilters(events));
    this._currentFilter = getFilters()[0];
    this._tripInfo = new TripInfo(events);
    this._sort = new Sort();
    this._days = new TripDayList();
    this._statistics = new Statistics([{name: `money`}, {name: `transport`}, {name: `time`}], events);
    this._statistics.hide();
    this._menu = new Menu(this._statistics, this, [{name: `table`, link: `#`, active: true}, {name: `stats`, link: `#`}]);
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
    this._onCancel = this._onCancel.bind(this);
    this._addEventController = null;
    this._addEventContainer = null;
    this._currentSort = `day`;
    this._views = [];
  }

  _renderEvents(container, events) {
    events.filter(this._currentFilter.callback).forEach((event) => {
      const point = new PointController(event,
          container,
          this._onDataChange,
          this._onChangeView,
          null,
          false,
          this._destinations,
          this._eventTypes);
      this._views.push(point._activateView.bind(point));
    });
  }

  _renderDays() {
    unrender(this._days);
    this._days = this._events.length > 0 ? new TripDayList() : new EmptyEventList();
    render(this._container, this._days.getElement());
  }

  _renderSortedEvents(sorting) {
    this._renderDays();
    const tripDay = new TripDay();
    render(this._days.getElement(), tripDay.getElement());
    this._eventContainer = new EventList();
    render(tripDay.getElement(), this._eventContainer.getElement());
    this._renderEvents(this._eventContainer, this._events.slice().sort(sorting));
  }

  _renderDayEvents() {
    this._renderDays();
    const days = new Set(this._events.filter(this._currentFilter.callback).map(({timeStart}) => (new Date(timeStart)).setHours(0, 0, 0, 0)));
    Array.from(days).forEach((day, index) => {
      const dayElement = new TripDay(day, index + 1).getElement();
      render(this._days.getElement(), dayElement);
      this._eventContainer = new EventList();
      render(dayElement, this._eventContainer.getElement());
      const dayEvents = this._events.filter(
          ({timeStart}) => new Date(day).toLocaleDateString() === new Date(timeStart).toLocaleDateString()
      );
      this._renderEvents(this._eventContainer, dayEvents);
    });
  }

  _updateEvents(oldData, newData) {
    const index = this._events.findIndex((event) => event === oldData);
    if (oldData && !newData) {
      return this._api.deleteEvent(oldData.id)
        .then(() => {
          this._events = [...this._events.slice(0, index), ...this._events.slice(index + 1)];
        });
    }
    if (!oldData && newData) {
      this._addEventController = null;
      return this._api.createEvent(newData)
        .then((event) => {
          this._events = [event, ...this._events];
        });
    }

    return this._api.updateEvent(oldData.id, newData)
      .then((event) => {
        this._events[index] = event;
      });
  }

  init() {
    this._totalPriceElement.textContent = calcPrice(this._events);
    render(this._container, this._sort.getElement());
    render(this._infoContainer, this._tripInfo.getElement(), Position.AFTERBEGIN);
    render(this._filtersContainer, this._menu.getElement());
    render(this._filtersContainer, this._filters.getElement());
    render(this._container.parentNode, this._statistics.getElement());
    this._renderDayEvents();
    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
    this._filters.getElement().addEventListener(`click`, (evt) => this._onFilterClick(evt));

    const addNewPointBtn = this._infoContainer.parentNode.querySelector(`.trip-main__event-add-btn`);

    const newPointOnClick = () => {
      this._menu.getElement().querySelector(`a[data-switch="table"]`).classList.add(`trip-tabs__btn--active`);
      this._menu.getElement().querySelector(`a[data-switch="stats"]`).classList.remove(`trip-tabs__btn--active`);
      this._statistics.hide();
      this.show();
      this.createEvent();
    };
    addNewPointBtn.addEventListener(`click`, newPointOnClick);

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
    this._statistics.hide();
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

  updateFilters() {
    unrender(this._filters);
    this._filters = new Filters(getFilters(), calcFilters(this._events));
    render(this._filtersContainer, this._filters.getElement());
    this._filters.getElement().addEventListener(`click`, (evt) => this._onFilterClick(evt));
  }

  updateInfo() {
    unrender(this._tripInfo);
    this._tripInfo = new TripInfo(this._events);
    render(this._infoContainer, this._tripInfo.getElement(), Position.AFTERBEGIN);
  }

  updateStatistics() {
    unrender(this._statistics);
    this._statistics = new Statistics([{name: `money`}, {name: `transport`}, {name: `time`}], this._events);
    render(this._container.parentNode, this._statistics.getElement());
    this._totalPriceElement.textContent = calcPrice(this._events);
    this._statistics.hide();
    this._menu.updateStatistics(this._statistics);
  }

  createEvent() {
    if (this._addEventController !== null) {
      return;
    }
    const event = {
      type: this._eventTypes[0],
      destination: this._destinations[0],
      timeStart: Date.now(),
      timeEnd: Date.now(),
      price: 0,
      isFavorite: false,
      offers: this._eventTypes[0].offers
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
        this._destinations,
        this._eventTypes);
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

  _onFilterClick(evt) {
    if (evt.target.tagName[0].toLowerCase() !== `i`) {
      return;
    }
    this._currentFilter = getFilters().find(({title}) => evt.target.value === title.toLowerCase());
    this.update();
  }

  _onDataChange(oldData, newData) {
    return this._updateEvents(oldData, newData)
      .then(() => {
        this.update();
        this.updateInfo();
        this.updateFilters();
        this.updateStatistics();
      });
  }

  _onChangeView() {
    this._views.forEach((activateView) => activateView());
  }

  _onCancel() {
    this._addEventController = null;
    unrender(this._addEventContainer);
  }

}
