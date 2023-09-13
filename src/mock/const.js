const DEFAULT_TYPE = 'flight';

const CITIES = [
  'Amsterdam',
  'Chamonix',
  'Geneva',
  'Tokio',
  'Copenhagen',
  'Paris',
  'Berlin',
  'Oslo',
  'Helsinki',
];

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

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export {CITIES, TYPES, POINT_EMPTY, FilterType, Mode, SortType, UserAction, UpdateType};
