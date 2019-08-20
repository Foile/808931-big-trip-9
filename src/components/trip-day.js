export const tripDayItem = (counter, date) =>`<li class="trip-days__item  day" id = "day-${counter}">
<div class="day__info">
  <span class="day__counter">${counter}</span>
  <time class="day__date" datetime="${date}">${new Date(date).toLocaleDateString(`en-GB`, {
  day: `numeric`, month: `short`, year: `numeric`
})}</time>
</div></li>`;
