import {render, replace, remove, RenderPosition} from '../framework/render.js';
import {getDestinationsById, getOffersByType, getCheckedOffers} from '../utils/common.js';
import {Filter} from '../utils/filter.js';
import {FilterType} from '../mock/const.js';
import dayjs from 'dayjs';

import TripInfoView from '../view/trip-info-view.js';

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
    const points = Filter[FilterType.EVERYTHING](this.#pointsModel.points);
    if (!points) {
      return '';
    }
    const tripDates = `${dayjs(points[0].dateFrom).format('MMM DD')} — ${dayjs(points[points.length - 1].dateTo).format('DD')}`;

    this.#tripInfoComponent = new TripInfoView(this.#getTripRoute(), tripDates, this.#getTotalTripCost());

    if (prevTripInfoComponent === null) {
      render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  #getTripRoute() {
    const points = this.#pointsModel.points;
    const destinations = this.#destinationsModel.destinations;
    const firstDestination = getDestinationsById(points[0].destination, destinations).name;
    const secondDestination = points.length === 3 ? getDestinationsById(points[1].destination, destinations).name : '...';
    const thirdDestination = getDestinationsById(points[points.length - 1].destination, destinations).name;

    return `${firstDestination} — ${secondDestination} — ${thirdDestination}`;
  }

  #getTotalTripCost() {
    let offers = null;
    let price = 0; let offersPrice = 0;

    this.#pointsModel.points.forEach((point) => {
      offers = getCheckedOffers(point.offers, getOffersByType(point.type, this.#offersModel.offers));
      offers.forEach((offer) => {
        offersPrice += offer.price;
      });
      price += point.basePrice;
    });
    price += offersPrice;

    return price;
  }

  #handleModelEvent = () => {
    this.init();
  };
}

