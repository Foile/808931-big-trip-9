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
  if (Component._element) {
    Component._element.remove();
    Component.removeElement();
  }
};
export const makeFirstSymUp = (string) => `${string.length > 0 ? string[0].toUpperCase() + string.slice(1) : ``}`;

export const calcDuration = (timeStart, timeEnd) => {
  let diff = Math.abs(timeEnd - timeStart) / 1000;
  let result = {};
  let partTime = {
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

export const calcPrice = (events) => {
  let totalAmount = 0;
  // тут тоже forEach, а лучше вообще reduce
  events.map(((event) => {
    totalAmount += event ? Number(event.price) : 0;
    event.offers.map((offer) => {
      totalAmount += offer ? Number(offer.price) : 0;
    });
  }));
  return totalAmount;
};
export const toKebab = (string) => string.split(` `).join(`-`).toLowerCase();
