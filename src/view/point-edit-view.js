import AbstractView from '../framework/view/abstract-view';
import {POINT_EMPTY} from '../mock/const';
import {getScheduleDate, capitalize, changeToLowercase} from '../utils';

function createEventTypesTemplate(pointTypes) {
  if (pointTypes) {
    return pointTypes.map((type) => `
      <div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalize(type)}</label>
      </div>
  `).join('');
  }
  return '';
}

function createDestinationListTemplate(name, destinations) {
  let destinationListTemplate = `
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">
    <datalist id="destination-list-1">`;

  destinations.forEach((pointDestination) => {
    destinationListTemplate +=
      `<option value="${pointDestination.name}"></option>
      `;
  });
  return destinationListTemplate;
}

function createEventOffersTemplate(pointOffersByType) {
  let eventOffersTemplate = '';

  if (pointOffersByType) {
    eventOffersTemplate += pointOffersByType.map((offer) =>
      `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${changeToLowercase(offer.title)}-1" type="checkbox" name="event-offer-${changeToLowercase(offer.title)}" checked>
          <label class="event__offer-label" for="event-offer-${changeToLowercase(offer.title)}-1">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>

        `).join('');
  }
  return eventOffersTemplate;
}

function createDestinationTemplate({description, pictures}) {
  let destinationTemplate =
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">`;

  pictures.forEach((picture) => {
    destinationTemplate += `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
  });

  destinationTemplate +=
        `</div>
      </div>
    </section>`;

  return destinationTemplate;
}

function createPointEditTemplate({destinations, pointOffersByType, point, pointDestination, pointTypes}) {
  const {type, dateTo, dateFrom, basePrice} = point;

  return (
    /*html*/`<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                ${createEventTypesTemplate(pointTypes)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
              ${createDestinationListTemplate(pointDestination.name, destinations)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getScheduleDate(dateFrom)}">
            —
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getScheduleDate(dateTo)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              €
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${createEventOffersTemplate(pointOffersByType)}
            </div>
          </section>

          ${createDestinationTemplate(pointDestination)}
        </section>
      </form>
    </li>`);
}

export default class PointEditView extends AbstractView {
  #point = null;
  #destinations = null;
  #pointDestination = null;
  #pointOffersByType = null;
  #pointTypes = null;
  #handleFormSubmit = null;

  constructor({destinations, pointDestination, pointOffersByType, point = POINT_EMPTY, pointTypes, onFormSubmit}) {
    super();
    this.#destinations = destinations;
    this.#pointDestination = pointDestination;
    this.#pointOffersByType = pointOffersByType;
    this.#point = point;
    this.#pointTypes = pointTypes;
    this.#handleFormSubmit = onFormSubmit;

    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  }

  get template() {
    return createPointEditTemplate({
      destinations: this.#destinations,
      pointOffersByType: this.#pointOffersByType,
      point: this.#point,
      pointDestination: this.#pointDestination,
      pointTypes: this.#pointTypes,
    });
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };
}
