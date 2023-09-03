import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {POINT_EMPTY} from '../mock/const.js';
import {getScheduleDate} from '../utils/date.js';
import { capitalize, changeToLowercase } from '../utils/common.js';

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
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" list="destination-list-1" value="${name}" autocomplete="off">
    <datalist id="destination-list-1">
    `;

  destinations.forEach((destination) => {
    destinationListTemplate +=
      `  <option value="${destination.name}"></option>
    `;
  });
  destinationListTemplate += '</datalist>';

  return destinationListTemplate;
}

function createEventOffersTemplate(pointOffers, pointCheckedOffers) {
  let eventOffersTemplate = '';

  if (pointOffers) {
    eventOffersTemplate += pointOffers.map((offer) =>
      `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${changeToLowercase(offer.title)}-1" type="checkbox" name="event-offer-${changeToLowercase(offer.title)}" data-offer-id="${offer.id}" ${pointCheckedOffers !== null && pointCheckedOffers.includes(offer.id) ? 'checked' : ''}>
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

function createPointEditTemplate({point, pointTypes}) {
  const {type, dateTo, dateFrom, basePrice, newPointType, pointOffers, offers, pointDestination, destinations} = point;

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${newPointType ? newPointType : type}.png" alt="Event type icon">
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
              ${newPointType ? newPointType : type}
            </label>
              ${createDestinationListTemplate(pointDestination.name, destinations)}
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
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${createEventOffersTemplate(pointOffers, offers)}
            </div>
          </section>

          ${createDestinationTemplate(pointDestination)}
        </section>
      </form>
    </li>`);
}

export default class PointEditView extends AbstractStatefulView {
  #destinations = null;
  #pointTypes = null;
  #handleFormSubmit = null;
  #handleRollupClick = null;
  #handleTypeChange = null;

  constructor({point = POINT_EMPTY, pointTypes, onFormSubmit, onRollupClick, onTypeChange}) {
    super();
    this.#destinations = point.destinations;
    this._setState(PointEditView.parsePointToState(point));
    this.#pointTypes = pointTypes;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupClick = onRollupClick;
    this.#handleTypeChange = onTypeChange;

    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate({
      point: this._state,
      pointTypes: this.#pointTypes,
    });
  }

  reset(point) {
    this.updateElement(
      PointEditView.parsePointToState(point),
    );
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('#event-destination-1').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('#event-price-1').addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event__available-offers').addEventListener('click', this.#offerClickHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      newPointType: evt.target.value,
      pointOffers: this.#handleTypeChange(evt.target.value),
    });
  };

  #offerClickHandler = (evt) => {
    evt.preventDefault();
    evt.target.closest('.event__offer-selector').querySelector('input').toggleAttribute('checked');

    const clickedOffer = evt.target.closest('.event__offer-selector').querySelector('input');
    const clickedOfferId = clickedOffer.dataset.offerId;

    let selectedOffers = this._state.offers;

    if (clickedOffer.hasAttribute('checked')) {
      selectedOffers.push(clickedOfferId);
    } else {
      if (selectedOffers.length === 1) {
        selectedOffers = null;
      } else {
        selectedOffers = selectedOffers.filter((id) => id !== clickedOfferId);
      }
    }

    this.updateElement({
      offers: selectedOffers,
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      destination: this.#destinations.find((destination) => destination.name === evt.target.value).id,
      pointDestination: this.#destinations.find((destination) => destination.name === evt.target.value),
      newDestination: this.#destinations.find((destination) => destination.name === evt.target.value),
    });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value,
    });
  };

  static parsePointToState(point) {
    return {
      ...point,
      newPointType: false,
      newDestination: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    if (point.newPointType !== false) {
      point.type = point.newPointType;
    }

    if (point.newDestination !== false) {
      this.pointDestination = point.newDestination;
    }

    delete point.newPointType;
    delete point.newDestination;

    return point;
  }
}
