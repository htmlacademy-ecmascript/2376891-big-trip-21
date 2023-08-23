import {generateDestination} from '../mock/destination.js';
import {generateOffer} from '../mock/offer.js';
import {generatePoint} from '../mock/point.js';

import {DESTINATION_COUNT, OfferCount, POINT_COUNT, TYPES} from '../mock/const.js';
import {getRandomInteger, getRandomValue} from '../utils.js';

export default class MockService {
  destinations = [];
  offers = [];
  points = [];

  constructor() {
    this.destinations = this.generateDestinations();
    this.offers = this.generateOffers();
    this.points = this.generatePoints();
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }

  getPoints() {
    return this.points;
  }

  generateDestinations() {
    return Array.from({length: DESTINATION_COUNT}, () => generateDestination());
  }

  generateOffers() {
    return TYPES.map((type) => ({
      type,
      offers: Array.from({length: getRandomInteger(OfferCount.MIN, OfferCount.MAX)}, () => generateOffer(type)),
    }));
  }

  generatePoints() {
    return Array.from({length: POINT_COUNT}, () => {
      const type = getRandomValue(TYPES);
      const destination = getRandomValue(this.destinations);
      const hasOffers = getRandomInteger(0, 1);
      const offersByType = this.offers.find((offerByType) => offerByType.type === type).offers;
      const offerIds = (hasOffers) ? offersByType.slice(0, getRandomInteger(OfferCount.MIN, OfferCount.MAX / 2)).map((offer) => offer.id) : [];

      return generatePoint(type, destination.id, offerIds);
    });
  }
}
