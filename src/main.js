import NewPointButtonView from './view/new-point-button-view.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import BoardPresenter from './presenter/board-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import DataService from './service/data-service.js';
import PointsApiService from './service/points-api-service.js';
import {render} from './framework/render.js';

const AUTHORIZATION = 'Basic jL5cdM98bdm4md6m';
const END_POINT = 'https://21.objects.pages.academy/big-trip';

const bodyElement = document.querySelector('.page-body');
const headerElement = bodyElement.querySelector('.page-header');
const tripInfoElement = headerElement.querySelector('.trip-main');
const mainElement = bodyElement.querySelector('.page-main');
const eventListElement = mainElement.querySelector('.trip-events');

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);
const dataService = new DataService({pointsApiService});
const destinationsModel = new DestinationsModel(dataService);
const offersModel = new OffersModel(dataService);
const pointsModel = new PointsModel(dataService);
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter({
  container: eventListElement,
  destinationsModel,
  offersModel,
  pointsModel,
  dataService,
  filterModel,
  onNewPointButtonDisable: handleNewPointButtonDisable,
  onNewPointButtonUnblock: handleNewPointButtonUnlock,
});

const newPointButtonComponent = new NewPointButtonView({
  onNewPointButtonClick: handleNewPointButtonClick
});

new TripInfoPresenter({
  tripInfoContainer: tripInfoElement,
  offersModel,
  destinationsModel,
  pointsModel,
  dataService: dataService,
});

function handleNewPointButtonClick() {
  boardPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

function handleNewPointButtonDisable() {
  newPointButtonComponent.element.disabled = true;
}

function handleNewPointButtonUnlock() {
  newPointButtonComponent.element.disabled = false;
}

boardPresenter.init();
render(newPointButtonComponent, tripInfoElement);
dataService.init();
