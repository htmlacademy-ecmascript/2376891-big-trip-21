const POINT_COUNT = 4;
const DESTINATION_COUNT = 9;

const DEFAULT_TYPE = 'flight';

const CITIES = [
  'Amsterdam',//
  'Chamonix',
  'Geneva',
  'Tokio',
  'Copenhagen',//
  'Paris',
  'Berlin',//
  'Oslo',
  'Helsinki',
];

const DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.';

const OfferTitle = {
  'taxi': ['Order Uber', 'Choose temperature'],
  'flight': ['Add luggage', 'Switch to comfort'],
  'drive': ['Rent a car'],
  'check-in': ['Add breakfast', 'Add dinner', 'Add lunch'],
  'bus': ['Book a seat', 'Add luggage'],
  'train': ['Buy a meal', 'Add luggage'],
  'ship': ['Buy a buffet&apos;s ticket'],
  'sightseeing': ['Add an excursion'],
  'restaurant': ['Book a table'],
};

const Picture = {
  MIN: 1,
  MAX: 6,
};

const OfferCount = {
  MIN: 1,
  MAX: 6,
};

const Price = {
  MIN: 10,
  MAX: 1000,
};

const Duration = {
  DAYS: {
    MIN: 0,
    MAX: 3,
  },
  HOURS: {
    MIN: 0,
    MAX: 10,
  },
  MINUTES: {
    MIN: 0,
    MAX: 59,
  },
};

const TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'sightseeing',
  'restaurant',
  'flight',
  'drive',
  'check-in',
];

const POINT_EMPTY = {
  type: DEFAULT_TYPE,
  destination: null,
  dateFrom: null,
  dateTo: null,
  basePrice: 0,
  isFavorite: false,
  offers: [],
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

export {POINT_COUNT, OfferCount, DESTINATION_COUNT, CITIES, DESCRIPTION, OfferTitle, Picture, Price, Duration, TYPES, POINT_EMPTY, FilterType, Mode, SortType};
