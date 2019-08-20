const calcDuration = (timeStart, timeEnd) =>{
  let d = Math.abs(timeEnd - timeStart) / 1000;
  let r = {};
  let s = {
    day: 86400,
    hour: 3600,
    minute: 60
  };

  Object.keys(s).forEach((key) => {
    r[key] = Math.floor(d / s[key]);
    d -= r[key] * s[key];
  });

  return Object.keys(r).map((cur) => r[cur] > 0 ? `${r[cur]}${cur[0].toUpperCase()}` : ``).join(` `);
};

export const tripEventItem = ({type, destination, timeStart, timeEnd, price, offers}) => `<li class="trip-events__item">
<div class="event">
  <div class="event__type">
    <img class="event__type-icon" width="42" height="42" src="img/icons/${type.title}.png" alt="Event type icon">
  </div>
  <h3 class="event__title">${type.title[0].toUpperCase()}${type.title.slice(1)} ${type.type === `activity` ? `in` : `to`} ${destination.name}</h3>

  <div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime="${new Date(timeStart).toDateString()}">${new Date(timeStart).toLocaleTimeString()}</time>
      &mdash;
      <time class="event__end-time" datetime="${new Date(timeEnd).toDateString()}">${new Date(timeEnd).toLocaleTimeString()}</time>
    </p>
    <p class="event__duration">${calcDuration(timeStart, timeEnd)}</p>
  </div>

  <p class="event__price">
    &euro;&nbsp;<span class="event__price-value">${price}</span>
  </p>

  <h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
  ${(offers.length > 0) ? Array.from(offers).map(({title, price: offerPrice}) => `<li class="event__offer">
  <span class="event__offer-title">${title[0].toUpperCase()}${title.slice(1)}</span>
  &plus;
  &euro;&nbsp;<span class="event__offer-price">${offerPrice}</span>
 </li>`).join(``) : ``}
  </ul>

  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>
</div>
</li>`;
