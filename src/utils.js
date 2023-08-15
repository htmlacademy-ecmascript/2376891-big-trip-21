import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const MSEC_IN_SEC = 1000;
const SEC_IN_MIN = 60;
const MIN_IN_HOUR = 60;
const HOUR_IN_DAY = 24;

const MSEC_IN_HOUR = MIN_IN_HOUR * SEC_IN_MIN * MSEC_IN_SEC;
const MSEC_IN_DAY = HOUR_IN_DAY * MSEC_IN_HOUR;

const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
const SHORT_DATE_FORMAT = 'MMM DD';
const TIME_FORMAT = 'HH:mm';
const DATE_FORMAT = 'YYYY-MM-DD';
const SCHEDULE_DATE_FORMAT = 'DD/MM/YY HH:mm';

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

function formatStringToDateTime(date) {
  return dayjs(date).format(DATE_TIME_FORMAT);
}

function formatStringToShortDate(date) {
  return date ? dayjs(date).format(SHORT_DATE_FORMAT) : '';
}

function formatStringToTime(date) {
  return date ? dayjs(date).format(TIME_FORMAT) : '';
}

function formatStringToDate(date) {
  return date ? dayjs(date).format(DATE_FORMAT) : '';
}

function getPointDuration(dateTo, dateFrom) {
  const timeDiff = dayjs(dateTo).diff(dayjs(dateFrom));

  let pointDuration = '';

  switch (true) {
    case (timeDiff >= MSEC_IN_DAY):
      pointDuration = dayjs.duration(timeDiff).format('DD[D] HH[H] mm[M]');
      break;
    case (timeDiff >= MSEC_IN_HOUR):
      pointDuration = dayjs.duration(timeDiff).format('HH[H] mm[M]');
      break;
    case (timeDiff < MSEC_IN_HOUR):
      pointDuration = dayjs.duration(timeDiff).format('mm[M]');
      break;
  }
  return pointDuration;
}

function getScheduleDate(data) {
  return data ? dayjs(data).format(SCHEDULE_DATE_FORMAT) : '';
}

function capitalize(string) {
  return `${string[0].toUpperCase()}${string.slice(1)}`;
}

function changeToLowercase(string) {
  return string.split(' ').join('').toLowerCase();
}

export {getRandomInteger, getRandomValue, formatStringToDateTime, formatStringToShortDate, formatStringToTime, formatStringToDate, getPointDuration, getScheduleDate, capitalize, changeToLowercase};
