import moment from 'moment';

export const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const TIME_FORMAT = `HH:mm`;
export const DATE_FORMAT = `DD.MM.YYYY`;

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const render = (container, element, place = Position.BEFOREEND) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
  }
};

export const unrender = (Component) => {
  if (Component.getElement()) {
    Component.getElement().remove();
    Component.removeElement();
  }
};

export const makeFirstSymUp = (string) => `${string.length > 0 ? `${string[0].toUpperCase()}${string.slice(1)}` : ``}`;

const getDiffDuration = (diff) => {
  const result = {};
  const partTime = {
    day: 86400,
    hour: 3600,
    minute: 60
  };
  Object.keys(partTime).forEach((key) => {
    result[key] = Math.floor(diff / partTime[key]);
    diff -= result[key] * partTime[key];
  });
  return Object.keys(result).map((cur) => result[cur] > 0 ? `${result[cur]} ${cur[0].toUpperCase()} ` : ``).join(` `);
};

export const calcDuration = (timeStart, timeEnd) => {
  return getDiffDuration(moment(timeEnd).diff(timeStart, `second`));
};

export const calcPrice = (events) => events.reduce((res, event) => {
  res += event ? Number(event.price) + event.offers.reduce((acc, offer) => {
    acc += offer && offer.accepted ? Number(offer.price) : 0;
    return acc;
  }, 0) : 0;
  return res;
}, 0);

export const toKebab = (string) => string.split(` `).join(`-`).toLowerCase();
