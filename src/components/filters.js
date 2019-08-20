export const filtersTemplate = (filters) => `<form class="trip-filters" action="#" method="get">
${filters.map(({title}) => `<div class="trip-filters__filter">
<input id="filter-${title.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${title.toLowerCase()}" ${title === `Everything` ? `checked` : ``}>
<label class="trip-filters__filter-label" for="filter-${title.toLowerCase()}">${title}</label>
</div>`).join(``)}
<button class="visually-hidden" type="submit">Accept filter</button>
</form>`;
