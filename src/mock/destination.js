import { getRandomInteger, getRandomValue } from '../utils/common.js';
import {CITIES, DESCRIPTION, Picture} from './const.js';

function generateDestination() {
  const city = getRandomValue(CITIES);

  return {
    id: crypto.randomUUID(),
    name: city,
    description: DESCRIPTION,
    pictures: Array.from({length: getRandomInteger(Picture.MIN, Picture.MAX)}, () => ({
      'src': `https://loremflickr.com/248/152?random=${crypto.randomUUID()}`,
      'description': `${city} description`,
    })),
  };
}

export {generateDestination};
