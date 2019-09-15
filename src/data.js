import {Api} from './api';
const api = new Api({endPoint: `https://htmlacademy-es-9.appspot.com/big-trip`, authorization: `Basic test84848`});

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
  {title: `flight`, type: `transfer`, emoji: `️✈️`},
  {title: `train`, type: `transfer`, emoji: `🚂`},
  {title: `ship`, type: `transfer`, emoji: `🛳`},
  {title: `drive`, type: `transfer`, emoji: `🚗`},
  {title: `transport`, type: `transfer`, emoji: `🚊`},
  {title: `bus`, type: `transfer`, emoji: `🚌`},
  {title: `taxi`, type: `transfer`, emoji: `🚕`},
  {title: `check-in`, type: `activity`, emoji: `🏨`},
  {title: `sightseeing`, type: `activity`, emoji: `🏛`},
  {title: `restaurant`, type: `activity`, emoji: `🍴`}
];

api.getOffers().then((offersLoad)=> {
  eventTypes.map((type) => {
    const offer = offersLoad.find((off) => {
      return off.type === type.title;
    });
    type.offers = [...offer.offers];
  });
});

export let destinations = [];

api.getDestinations().then((data) => {
  destinations = data;
});

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

