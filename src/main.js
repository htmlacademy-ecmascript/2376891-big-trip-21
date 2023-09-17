import NewPointButtonView from './view/new-point-button-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';

import MockService from './service/mock-service.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './service/points-api-service.js';

import {render} from './framework/render.js';

const AUTHORIZATION = 'Basic jL5cdM98bdm4md6m';
const END_POINT = 'https://21.objects.pages.academy/big-trip';

const bodyElement = document.querySelector('.page-body');
const headerElement = bodyElement.querySelector('.page-header');

/**
 * @type {HTMLElement}
 */
const tripInfoElement = headerElement.querySelector('.trip-main');
/**
 * @type {HTMLElement}
 */
const filtersElement = headerElement.querySelector('.trip-controls__filters');
const mainElement = bodyElement.querySelector('.page-main');
const eventListElement = mainElement.querySelector('.trip-events');

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);
const mockService = new MockService({pointsApiService});

const destinationsModel = new DestinationsModel(mockService);
const offersModel = new OffersModel(mockService);
const pointsModel = new PointsModel(mockService);
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter({
  container: eventListElement,
  destinationsModel,
  offersModel,
  pointsModel,
  mockService,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose,
});

const filterPresenter = new FilterPresenter({
  filterContainer: filtersElement,
  filterModel,
  pointsModel,
});

const tripInfoPresenter = new TripInfoPresenter({
  tripInfoContainer: tripInfoElement,
  offersModel,
  destinationsModel,
  pointsModel,
  mockService,
});

/**
 * @type any
 */
const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  boardPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

boardPresenter.init();
mockService.init().finally(() => {
  tripInfoPresenter.init();
  filterPresenter.init();
  render(newPointButtonComponent, tripInfoElement);
});
