import {getRandomInteger} from '../utils.js';
import {Price} from './const.js';
import {getDate} from './utils.js';

function generatePoint(type, destinationId, offerIds) {
  return {
    id: crypto.randomUUID(),
    type,
    dateFrom: getDate({next: false}),
    dateTo: getDate({next: true}),
    destination: destinationId,
    basePrice: getRandomInteger(Price.MIN, Price.MAX),
    isFavorite: !getRandomInteger(),
    offers: offerIds,
  };
}

export {generatePoint};
