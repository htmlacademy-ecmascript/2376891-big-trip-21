import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {POINT_EMPTY} from '../mock/const.js';
import {getScheduleDate} from '../utils/date.js';
import {capitalize, changeToLowercase, getDestinationsById, getDestinationByName, getOffersByType} from '../utils/common.js';
import flatpickr from 'flatpickr';
import he from 'he';

import 'flatpickr/dist/flatpickr.min.css';

function createEventTypesTemplate(pointTypes, isDisabled) {
  if (pointTypes) {
    return pointTypes.map((type) => `
      <div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isDisabled ? 'disabled' : ''}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalize(type)}</label>
      </div>
  `).join('');
  }
  return '';
}

function createDestinationListTemplate(pointDestination, destinations, isDisabled) {
  let destinationListTemplate = `
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" list="destination-list-1" value="${pointDestination ? pointDestination.name : ''}" autocomplete="off" ${isDisabled ? 'disabled' : ''}>
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

function createEventOffersTemplate(pointOffers, pointCheckedOffers, isDisabled) {
  if (pointOffers.length === 0) {
    return '';
  }

  return pointOffers.map((offer) =>
    `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${changeToLowercase(offer.title)}-1" type="checkbox" name="event-offer-${changeToLowercase(offer.title)}" data-offer-id="${offer.id}" ${pointCheckedOffers.length > 0 && pointCheckedOffers.includes(offer.id) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
        <label class="event__offer-label" for="event-offer-${changeToLowercase(offer.title)}-1">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>

      `).join('');
}

function createDestinationTemplate({description, pictures}) {
  let destinationTemplate =
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description ? description : ''}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">`;

  if (pictures) {
    pictures.forEach((picture) => {
      destinationTemplate += `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
    });
  }

  destinationTemplate +=
        `</div>
      </div>
    </section>`;

  return destinationTemplate;
}

function createDeleteButtonTemplate(isEditForm, isDeleting) {
  if (isEditForm) {
    return `<button class="event__reset-btn" type="reset">${isDeleting ? 'Deleting...' : 'Delete'}</button>`;
  }
  return '<button class="event__reset-btn" type="reset">Cancel</button>';
}

function createPointEditTemplate(point, pointTypes, destinations, offers, isEditForm) {
  const {type, dateFrom, dateTo, basePrice, destination, newPointType, newDestination, isDisabled, isDeleting, isSaving} = point;
  const pointDestination = getDestinationsById(newDestination ? newDestination : destination, destinations);

  let pointOffers = [];

  if (offers.length !== 0) {
    pointOffers = getOffersByType(newPointType ? newPointType : point.type, offers);
  }

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

                ${createEventTypesTemplate(pointTypes, isDisabled)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${newPointType ? newPointType : type}
            </label>
              ${createDestinationListTemplate(pointDestination, destinations, isDisabled)}
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getScheduleDate(dateFrom)}" ${isDisabled ? 'disabled' : ''}>
            —
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getScheduleDate(dateTo)}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              €
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${he.encode(String(basePrice))}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
          ${createDeleteButtonTemplate(isEditForm, isDeleting)}
          ${isEditForm ? `<button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>` : ''}

        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${createEventOffersTemplate(pointOffers, point.offers, isDisabled)}
            </div>
          </section>

          ${createDestinationTemplate(pointDestination ? pointDestination : '')}
        </section>
      </form>
    </li>`);
}

export default class PointEditView extends AbstractStatefulView {
  #pointTypes = null;
  #destinations = null;
  #offers = null;
  #handleFormSubmit = null;
  #handleRollupClick = null;
  #handleDeleteClick = null;
  #handleCancelClick = null;
  #startDatepicker = null;
  #endDatepicker = null;

  constructor({point = POINT_EMPTY, pointTypes, destinations, offers, onFormSubmit, onRollupClick = null, onDeleteClick = null, onCancelClick = null}) {
    super();
    this.#destinations = point.destinations;
    this._setState(PointEditView.parsePointToState(point));
    this.#pointTypes = pointTypes;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupClick = onRollupClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleCancelClick = onCancelClick;

    this._restoreHandlers();
  }

  get template() {
    const isEditForm = this.#handleDeleteClick;

    return createPointEditTemplate(this._state, this.#pointTypes, this.#destinations, this.#offers, isEditForm);
  }

  removeElement() {
    super.removeElement();

    if (this.#startDatepicker) {
      this.#startDatepicker.destroy();
      this.#startDatepicker = null;
    }
    if (this.#endDatepicker) {
      this.#endDatepicker.destroy();
      this.#endDatepicker = null;
    }
  }

  reset(point) {
    this.updateElement(
      PointEditView.parsePointToState(point),
    );
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('#event-destination-1').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('#event-price-1').addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event__available-offers').addEventListener('click', this.#offerClickHandler);

    if (this.#handleDeleteClick) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
    } else {
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formCancelClickHandler);
    }

    this.#setDatepicker();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(PointEditView.parseStateToPoint(this._state));
  };

  #formCancelClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCancelClick(PointEditView.parseStateToPoint(this._state));
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      newPointType: evt.target.value,
    });
  };

  #offerClickHandler = (evt) => {
    evt.preventDefault();
    if (!evt.target.closest('.event__offer-selector')) {
      return;
    }
    evt.target.closest('.event__offer-selector').querySelector('input').toggleAttribute('checked');

    const clickedOffer = evt.target.closest('.event__offer-selector').querySelector('input');
    const clickedOfferId = clickedOffer.dataset.offerId;

    let selectedOffers = this._state.offers;

    if (clickedOffer.checked) {
      selectedOffers.push(clickedOfferId);
    } else {
      if (selectedOffers.length === 1) {
        selectedOffers = [];
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
      destination: '',
      newDestination: evt.target.value ? getDestinationByName(evt.target.value, this.#destinations).id : false,
    });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value,
    });
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate,
    });
    this.#endDatepicker.set('minDate', this._state.dateFrom);
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate,
    });
    this.#startDatepicker.set('maxDate', this._state.dateTo);
  };

  #setDatepicker() {
    this.#startDatepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        minDate: new Date(),
        enableTime: true,
        'time_24hr': true,
        minuteIncrement: 1,
        onClose: this.#dateFromChangeHandler,
      },
    );

    this.#endDatepicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        enableTime: true,
        'time_24hr': true,
        minuteIncrement: 1,
        onClose: this.#dateToChangeHandler,
      },
    );
  }

  static parsePointToState(point) {
    return {
      ...point,
      newPointType: false,
      newDestination: false,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    if (point.newPointType !== false) {
      point.type = point.newPointType;
    }

    if (point.newDestination !== false) {
      point.destination = point.newDestination;
    }

    delete point.newPointType;
    delete point.newDestination;
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}
