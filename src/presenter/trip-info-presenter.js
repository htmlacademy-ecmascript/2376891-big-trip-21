import TripInfoView from '../view/trip-info-view.js';
import {render, replace, remove, RenderPosition} from '../framework/render.js';
import {getDestinationsById, getOffersByType, getCheckedOffers} from '../utils/common.js';
import {sortPointsByDay} from '../utils/date.js';
import dayjs from 'dayjs';

const DESTINATION_ITEMS_LENGTH = 3;

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #offersModel = null;
  #destinationsModel = null;
  #pointsModel = null;
  #dataService = null;
  #tripInfoComponent = null;
  #sortedPoints = null;

  constructor({tripInfoContainer, offersModel, destinationsModel, pointsModel, dataService}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#pointsModel = pointsModel;
    this.#dataService = dataService;

    this.#dataService.addObserver(this.#modelEventHandler);
  }

  init() {
    const prevTripInfoComponent = this.#tripInfoComponent;

    if (this.#pointsModel.points && this.#pointsModel.points.length !== 0) {
      this.#sortedPoints = this.#pointsModel.points.sort(sortPointsByDay);
      this.#tripInfoComponent = new TripInfoView(this.#getTripTitle(), this.#getTripDuration(), this.#getTotalTripCost());

      if (prevTripInfoComponent === null) {
        render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
        return;
      }

      replace(this.#tripInfoComponent, prevTripInfoComponent);
      remove(prevTripInfoComponent);
    } else {
      this.#tripInfoComponent = new TripInfoView();
      render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
      remove(prevTripInfoComponent);
    }
  }

  #getTripTitle() {
    const destinations = this.#destinationsModel.destinations;
    const destinationNames = this.#sortedPoints.map((point) => getDestinationsById(point.destination, destinations).name);

    return destinationNames.length <= DESTINATION_ITEMS_LENGTH ? destinationNames.join('&nbsp;&mdash;&nbsp;') : `${destinationNames.at(0)}&nbsp;&mdash;&nbsp;...&nbsp;&mdash;&nbsp;${destinationNames.at(-1)}`;
  }

  #getTripDuration() {
    return `${(dayjs(this.#sortedPoints.at(0).dateFrom).format('DD MMM')).toString()}&nbsp;&mdash;&nbsp;${(dayjs(this.#sortedPoints.at(-1).dateTo).format('DD MMM')).toString()}`;//падают тесты EXTRA при формате "DD MMM - DD"
  }

  #getTotalTripCost() {
    let offers = null;
    let price = 0;
    let offersPrice = 0;

    this.#sortedPoints.forEach((point) => {
      offers = getCheckedOffers(point.offers, getOffersByType(point.type, this.#offersModel.offers));
      offers.forEach((offer) => {
        offersPrice += offer.price;
      });
      price += point.basePrice;
    });
    price += offersPrice;

    return price.toString();
  }

  #modelEventHandler = () => {
    this.init();
  };
}
