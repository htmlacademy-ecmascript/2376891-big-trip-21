import TripInfoView from './view/trip-info-view.js';
import FilterView from './view/filter-view.js';
import AddButtonView from './view/add-button-view.js';
import BoardPresenter from './presenter/board-presenter.js';

import MockService from './service/mock-service.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';

import {render, RenderPosition} from './framework/render.js';
import { generateFilter } from './mock/filter.js';

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

const mockService = new MockService();

const destinationsModel = new DestinationsModel(mockService);
const offersModel = new OffersModel(mockService);
const pointsModel = new PointsModel(mockService);

const filters = generateFilter(pointsModel.points);

const boardPresenter = new BoardPresenter({
  container: eventListElement,
  destinationsModel,
  offersModel,
  pointsModel,
});

render(new TripInfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);
render(new FilterView({filters}), filtersElement);
render(new AddButtonView(), tripInfoElement);

boardPresenter.init();
