import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import {render} from '../framework/render.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/common.js';

export default class BoardPresenter {
  #container = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;

  #eventListComponent = new EventListView();
  #sortComponent = new SortView();
  #noPointComponent = new NoPointView();

  #boardPoints = [];
  #pointTypes = null;
  #pointPresenters = new Map();

  constructor({container, destinationsModel, offersModel, pointsModel}) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.points];
    this.#pointTypes = this.#boardPoints.map((point) => point.type);

    this.#renderBoard();
  }

  #renderSort() {
    render(this.#sortComponent, this.#container);
  }

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#eventListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      pointTypes: this.#pointTypes,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints() {
    this.#boardPoints.forEach((point) => this.#renderPoint(point));
  }

  #renderNoPoints() {
    render(this.#noPointComponent, this.#eventListComponent.element);
  }

  #renderBoard() {
    this.#renderSort();
    render(this.#eventListComponent, this.#container);

    if (this.#boardPoints.length === 0) {
      this.#renderNoPoints();
      return;
    }
    this.#renderPoints();
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }
}
