export const tripDayItem = (counter, date, dateCaption) =>`<li class="trip-days__item  day">
<div class="day__info">
  <span class="day__counter">${counter}</span>
  <time class="day__date" datetime="${date}">${dateCaption}</time>
</div></li>`;
