import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

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

dayjs.extend(duration);
dayjs.extend(relativeTime);

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

function getPointDuration(dateFrom, dateTo) {
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

function isPointFuture(date) {
  return dayjs(date) >= dayjs();
}

function isPointPresent(dateFrom, dateTo) {
  return dateFrom <= dayjs() && dateTo >= dayjs();
}

function isPointPast(date) {
  return dayjs(date) < dayjs();
}

function isDateEqual(dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
}

function sortPointsByDay(pointA, pointB) {
  return pointA.dateFrom - pointB.dateFrom;
}

function sortPointsByTime(pointA, pointB) {
  const pointADuration = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const pointBDuration = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return dayjs(pointBDuration).diff(dayjs(pointADuration));
}

function sortPointsByPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

export {formatStringToDateTime, formatStringToShortDate, formatStringToTime, formatStringToDate, getPointDuration, getScheduleDate, isPointFuture, isPointPresent, isPointPast, sortPointsByDay, sortPointsByTime, sortPointsByPrice, isDateEqual};

