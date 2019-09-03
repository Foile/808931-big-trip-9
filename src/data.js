const eventTitles = [
  [`flight`, `transfer`],
  [`train`, `transfer`],
  [`ship`, `transfer`],
  [`drive`, `transfer`],
  [`transport`, `transfer`],
  [`bus`, `transfer`],
  [`taxi`, `transfer`],
  [`check-in`, `activity`],
  [`sightseeing`, `activity`],
  [`restaurant`, `activity`]
];

export const eventTypeGroups = eventTitles.reduce(
    (groups, [name, type]) =>
      Object.assign(groups, {
        [type]: groups[type] ? [...groups[type], name] : [name]
      }),
    {}
);

export const eventTypes = [
  {title: `flight`, type: `transfer`},
  {title: `train`, type: `transfer`},
  {title: `ship`, type: `transfer`},
  {title: `drive`, type: `transfer`},
  {title: `transport`, type: `transfer`},
  {title: `bus`, type: `transfer`},
  {title: `taxi`, type: `transfer`},
  {title: `check-in`, type: `activity`},
  {title: `sightseeing`, type: `activity`},
  {title: `restaurant`, type: `activity`}
];

export const offers = [
  {title: `Add luggage`, name: `luggage`, price: 30},
  {title: `Switch to comfort class`, name: `comfort`, price: 100},
  {title: `Add meal`, name: `meal`, price: 15},
  {title: `Choose seats`, name: `seats`, price: 5},
  {title: `Travel by train`, name: `train`, price: 40}
];

export const destinations = [
  {name: `Amsterdam`, description: `Amsterdam is the largest city in the Netherlands. It is the commercial, banking, and industrial center of the country and the official capital, although the actual seat of government is The Hague.`},
  {name: `Vienna`, description: `Vienna continues to attract visitors with its many great historic sights, fabled collections of art, glittering palaces, and exceptional musical heritage that's still carried on in concert halls and one of the world's great opera houses.`},
  {name: `Geneva`, description: `Geneva is the second-most populous city in Switzerland (after Zürich) and the most populous city of Romandy, the French-speaking part of Switzerland.`},
  {name: `Oslo`, description: `Captivating landmarks like the Opera House, the Astrup Fearnley Museum and Barcode are changing the face of the city, and Oslo maintains its refreshing closeness to nature that few other capitals can match.`},
  {name: `London`, description: `London is the capital of Great Britain`},
  {name: `Praha`, description: `Prague is one of the most beautiful cities in Europe in terms of its setting on both banks of the Vltava River, its townscape of burgher houses and palaces punctuated by towers, and its individual buildings.`},
];

destinations.map((destination) => {
  destination.photo = Array(Math.floor(Math.random() * 10)).fill().map(() => `http://picsum.photos/300/150?r=${Math.random()}`);
});


const getArrayRandom = (array, maxCount) => {
  let result = new Set();
  for (let i = 0; i < maxCount; i++) {
    const rnd = Boolean(Math.round(Math.random()));
    if (rnd) {
      result.add(array[Math.floor(Math.random() * array.length)]);
    }
  }
  return Array.from(result);
};

export const getEvent = () => {
  return {
    type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
    destination: destinations[Math.floor(Math.random() * destinations.length)],
    timeStart: Date.now() + 1 + Math.ceil(Math.random() * 3600) * 1000 * 24 * 7,
    timeEnd: Date.now() + 1 + Math.ceil(Math.random() * 3600) * 1000 * 24 * 7,
    price: Math.floor(Math.random() * 100 + 1),
    offers: getArrayRandom(offers, 2),
  };
};

export const getFilters = () => [
  {title: `Everything`, callback: () => true},
  {title: `Future`, callback: ({timeStart}) => timeStart > Date.now()},
  {title: `Past`, callback: ({timeEnd}) => timeEnd < Date.now()}
];

export const calcFilters = (events) => {
  let result = [];
  for (const fil of getFilters()) {
    result.push({
      title: fil.title,
      count: events.filter((arg) => fil.callback(arg)).length
    });
  }
  return result;
};

