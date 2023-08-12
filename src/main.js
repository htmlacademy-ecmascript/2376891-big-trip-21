import TripInfoView from './view/trip-info-view.js';
import FilterView from './view/filter-view.js';
import AddButtonView from './view/add-button-view.js';
import {render, RenderPosition} from './render.js';
import BoardPresenter from './presenter/board-presenter.js';

const bodyElement = document.querySelector('.page-body');
const headerElement = bodyElement.querySelector('.page-header');
const briefElement = headerElement.querySelector('.trip-main');
const filtersElement = headerElement.querySelector('.trip-controls__filters');
const mainElement = bodyElement.querySelector('.page-main');
const eventListElement = mainElement.querySelector('.trip-events');
const boardPresenter = new BoardPresenter({container: eventListElement});

render(new TripInfoView(), briefElement, RenderPosition.AFTERBEGIN);
render(new FilterView(), filtersElement);
render(new AddButtonView(), briefElement);

boardPresenter.init();
