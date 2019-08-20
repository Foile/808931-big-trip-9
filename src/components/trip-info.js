
export const tripInfo = (trip) => {
  const destinations = [];
  trip.map(({destination})=> destinations[destinations.length - 1] && destinations[destinations.length - 1] === destination.name ? {} : destinations.push(destination.name));
  return `<div class="trip-info__main">
  <h1 class="trip-info__title">${destinations.length <= 3 ? destinations.join(`-`) : destinations[0] + `-...-` + destinations[destinations.length - 1]}</h1>
  <p class="trip-info__dates">${new Date(trip[0].timeStart).toDateString()} - ${new Date(trip[trip.length - 1].timeEnd).toDateString()}</p>
  </div>`;
};
