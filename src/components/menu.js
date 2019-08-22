export const menu = (tabs) => `<nav class="trip-controls__trip-tabs  trip-tabs">
${tabs.map(({name, link, active})=>`<a class="trip-tabs__btn  ${active ? `trip-tabs__btn--active` : ``}" href="${link}">${name}</a>`)}
</nav>`;
