function capitalize(name) {
  return `${name[0].toUpperCase()}${name.slice(1)}`;
}

function changeToLowercase(name) {
  return name.split(' ').join('').toLowerCase();
}

function isEscape(evt) {
  return evt.key === 'Escape' || evt.key === 'Esc';
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

export {capitalize, changeToLowercase, isEscape, getDestinationsById, getDestinationByName, getOffersByType, getCheckedOffers};
