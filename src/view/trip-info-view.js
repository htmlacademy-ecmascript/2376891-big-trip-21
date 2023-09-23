import AbstractView from '../framework/view/abstract-view.js';

function createTripInfoTemplate(destinations, date, price) {
  if (destinations === '' && date === '' && price === '') {
    return '<div></div>';
  }

  return (
    /*html*/`<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${destinations}</h1>

        <p class="trip-info__dates">${date}</p>
      </div>

      <p class="trip-info__cost">
        Total: €&nbsp;<span class="trip-info__cost-value">${price}</span>
      </p>
    </section>`);
}

export default class TripInfoView extends AbstractView {
  #tripInfoDestinations = null;
  #tripInfoDate = null;
  #price = null;

  constructor(tripInfoDestinations = '', tripInfoDate = '', price = '') {
    super();
    this.#tripInfoDestinations = tripInfoDestinations;
    this.#tripInfoDate = tripInfoDate;
    this.#price = price;
  }

  get template() {
    return createTripInfoTemplate(this.#tripInfoDestinations, this.#tripInfoDate, this.#price);
  }
}
