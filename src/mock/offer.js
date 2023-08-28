import { getRandomInteger, getRandomValue } from '../utils/common.js';
import {Price, OfferTitle} from './const.js';

function generateOffer(type) {
  return {
    id: crypto.randomUUID(),
    title: getRandomValue(OfferTitle[type]),
    price: getRandomInteger(Price.MIN, Price.MAX),
  };
}

export {generateOffer};
