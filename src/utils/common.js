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

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

function isEscape(evt) {
  return evt.key === 'Escape';
}

function getDestinationsById(id, destinations) {
  return destinations.find((destination) => destination.id === id);
}

function getDestinationByName(name, destinations) {
  return destinations.find((destination) => destination.name === name);
}

function getOffersByType(type, offers) {
  return offers.find((offer) => offer.type === type).offers;
}

function getCheckedOffers(checkedOffersId, pointOffers) {
  return checkedOffersId.map((IdOffer) => pointOffers.find((offer) => offer.id === IdOffer));
}

export {getRandomInteger, getRandomValue, capitalize, changeToLowercase, updateItem, isEscape, getDestinationsById, getDestinationByName, getOffersByType, getCheckedOffers};
