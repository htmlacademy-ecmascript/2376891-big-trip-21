import {render, replace, remove, RenderPosition} from '../framework/render.js';
import {filter} from '../utils/filter.js';
import {FilterType} from '../mock/const.js';
import {getDestinationsById, getOffersByType, getCheckedOffers} from '../utils/common.js';
import dayjs from 'dayjs';

import TripInfoView from '../view/trip-info-view.js';

const MIN_DESTINATIONS_AMOUNT = 3;

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #offersModel = null;
  #destinationsModel = null;
  #pointsModel = null;
  #mockService = null;

  #tripInfoComponent = null;

  constructor({tripInfoContainer, offersModel, destinationsModel, pointsModel, mockService}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#pointsModel = pointsModel;
    this.#mockService = mockService;

    this.#mockService.addObserver(this.#handleModelEvent);
  }

  init() {
    const prevTripInfoComponent = this.#tripInfoComponent;
    const points = filter[FilterType.EVERYTHING](this.#pointsModel.points);
    const destinations = this.#destinationsModel.destinations;
    const tripInfoDate = `${dayjs(points[0].dateFrom).format('MMM DD')} — ${dayjs(points[points.length - 1].dateTo).format('DD')}`;

    let offers = null;
    let price = 0; let offersPrice = 0;
    let tripInfoDestinations = '';

    if (points.length > MIN_DESTINATIONS_AMOUNT) {
      tripInfoDestinations += `${getDestinationsById(points[0].destination, destinations).name} — ... — ${getDestinationsById(points[points.length - 1].destination, destinations).name}`;
    }
    if (points.length === MIN_DESTINATIONS_AMOUNT) {
      for (let i = 0; i < points.length; i++) {
        tripInfoDestinations += `${getDestinationsById(points[i].destination, destinations).name}${i !== 3 ? ' — ' : ''}`;
      }
    }

    points.forEach((point) => {
      offers = getCheckedOffers(point.offers, getOffersByType(point.type, this.#offersModel.offers));
      offers.forEach((offer) => {
        offersPrice += offer.price;
      });
      price += point.basePrice;
    });
    price += offersPrice;

    this.#tripInfoComponent = new TripInfoView(tripInfoDestinations, tripInfoDate, price);

    if (prevTripInfoComponent === null) {
      render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };
}

