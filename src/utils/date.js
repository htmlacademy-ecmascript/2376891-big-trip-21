import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';

const MSEC_IN_SEC = 1000;
const SEC_IN_MIN = 60;
const MIN_IN_HOUR = 60;
const HOUR_IN_DAY = 24;

const SHORT_DATE_FORMAT = 'MMM DD';
const TIME_FORMAT = 'HH:mm';
const SCHEDULE_DATE_FORMAT = 'DD/MM/YY HH:mm';

const MSEC_IN_HOUR = MIN_IN_HOUR * SEC_IN_MIN * MSEC_IN_SEC;
const MSEC_IN_DAY = HOUR_IN_DAY * MSEC_IN_HOUR;

dayjs.extend(duration);
dayjs.extend(utc);

function getScheduleDate(data) {
  return data ? dayjs(data).format(SCHEDULE_DATE_FORMAT) : '';
}

function formatStringToShortDate(date) {
  return date ? dayjs(date).format(SHORT_DATE_FORMAT) : '';
}

function formatStringToTime(date) {
  return date ? dayjs(date).format(TIME_FORMAT) : '';
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

function isPointFuture(date) {
  return dayjs(date).diff(dayjs()) > 0;
}

function isPointPresent(dateFrom, dateTo) {
  return dayjs(dateFrom).diff(dayjs()) <= 0 && dayjs(dateTo).diff(dayjs()) >= 0;
}

function isPointPast(date) {
  return dayjs(date).diff(dayjs()) < 0;
}

function isDateEqual(dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
}

function sortPointsByDay(pointA, pointB) {
  return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

function sortPointsByTime(pointA, pointB) {
  const pointADuration = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const pointBDuration = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));

  return dayjs(pointBDuration).diff(dayjs(pointADuration));
}

function sortPointsByPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

export {formatStringToShortDate, formatStringToTime, getPointDuration, getScheduleDate, isPointFuture, isPointPresent, isPointPast, sortPointsByDay, sortPointsByTime, sortPointsByPrice, isDateEqual};
