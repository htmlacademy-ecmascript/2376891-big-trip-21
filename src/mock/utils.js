import dayjs from 'dayjs';
import {getRandomInteger} from '../utils';
import {Duration} from './const';

let date = dayjs().subtract(getRandomInteger(Duration.DAYS.MIN, Duration.DAYS.MAX), 'day').toDate();

function getDate({next}) {
  const minsGap = getRandomInteger(Duration.MINUTES.MIN, Duration.MINUTES.MAX);
  const hoursGap = getRandomInteger(Duration.HOURS.MIN, Duration.HOURS.MAX);
  const daysGap = getRandomInteger(Duration.DAYS.MIN, Duration.DAYS.MAX);

  if (next) {
    date = dayjs(date).add(minsGap, 'minute').add(hoursGap, 'hour').add(daysGap, 'day').toDate();
  }

  return date;
}

export {getDate};
