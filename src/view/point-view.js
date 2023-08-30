import AbstractView from '../framework/view/abstract-view.js';
import {formatStringToShortDate, formatStringToTime, getPointDuration} from '../utils/date.js';

function createEventOffersTemplate(pointOffers) {
  let eventOffersTemplate = '';

  if (pointOffers.length > 0) {
    pointOffers.forEach((offer) => {
      const {title, price} = offer;

      eventOffersTemplate += `
        <li class="event__offer">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </li>`;
    });
  }

  return eventOffersTemplate;
}

function createPointTemplate({point, pointDestination, pointOffers}) {
  const {dateFrom, dateTo, type, basePrice, isFavorite} = point;

  return (
    `<li class="trip-events__item">
      <div class="event">
      <time class="event__date" datetime="${dateFrom}">${formatStringToShortDate(dateFrom)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${pointDestination ? pointDestination.name : ''}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom} ">${formatStringToTime(dateFrom)}</time>
            —
            <time class="event__end-time" datetime="${dateTo}">${formatStringToTime(dateTo)}</time>
          </p>
          <p class="event__duration">${getPointDuration(dateTo, dateFrom)}</p>
        </div>
        <p class="event__price">
          €&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createEventOffersTemplate(pointOffers)}
        </ul>
        <button class="event__favorite-btn${isFavorite ? ' event__favorite-btn--active' : ''}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`);
}

export default class PointView extends AbstractView {
  #point = null;
  #pointDestination = null;
  #pointOffers = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({pointDestination, pointOffers, point, onEditClick, onFavoriteClick}) {
    super();
    this.#pointDestination = pointDestination;
    this.#pointOffers = pointOffers;
    this.#point = point;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createPointTemplate({
      pointDestination: this.#pointDestination,
      pointOffers: this.#pointOffers,
      point: this.#point,
    });
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
