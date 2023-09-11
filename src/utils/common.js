function getRandomInteger(a = 0, b = 1) {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
}

function getRandomValue(items) {
  if (items.length > 1) {
    return items[getRandomInteger(0, items.length - 1)];
  }
  return items[0];
}

function capitalize(string) {
  return `${string[0].toUpperCase()}${string.slice(1)}`;
}

function changeToLowercase(string) {
  return string.split(' ').join('').toLowerCase();
}

function isEscape(evt) {
  return evt.key === 'Escape';
}

function getDestinationsById(id, destinations) {
  if (id) {
    return destinations.find((destination) => destination.id === id);
  }
  return '';
}

function getDestinationByName(name, destinations) {
  if (destinations.some((destination) => destination.name === name)) {
    return destinations.find((destination) => destination.name === name);
  }
  return '';
}

function getOffersByType(type, offers) {
  return offers.find((offer) => offer.type === type).offers;
}

function getCheckedOffers(checkedOffersId, pointOffers) {
  return checkedOffersId.map((IdOffer) => pointOffers.find((offer) => offer.id === IdOffer));
}

export {getRandomInteger, getRandomValue, capitalize, changeToLowercase, isEscape, getDestinationsById, getDestinationByName, getOffersByType, getCheckedOffers};
