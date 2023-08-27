import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import {render, replace} from '../framework/render.js';
import NoPointView from '../view/no-point-view.js';

export default class BoardPresenter {
  #container = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;

  #eventListComponent = new EventListView();

  #boardPoints = [];
  #pointTypes = null;

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

  #renderPoint(point) {
    this.destinationById = this.#destinationsModel.getDestinationsById(point.destination);
    this.pointOffersByType = this.#offersModel.getOffersByType(point.type);
    this.pointOffers = point.offers.map((IdOffer) => this.pointOffersByType.find((offer) => offer.id === IdOffer));

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointView({
      pointDestination: this.destinationById,
      pointOffers: this.pointOffers,
      point: point,
      onEditClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const pointEditComponent = new PointEditView({
      destinations: this.#destinationsModel.destinations,
      pointDestination: this.destinationById,
      pointOffersByType: this.pointOffersByType,
      point: point,
      pointTypes: this.#pointTypes,
      onFormSubmit: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replacePointToForm() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceFormToPoint() {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#eventListComponent.element);
  }

  #renderBoard() {
    render(new SortView(), this.#container);
    render(this.#eventListComponent, this.#container);

    if (this.#boardPoints.length === 0) {
      render(new NoPointView(), this.#eventListComponent.element);
      return;
    }

    for (let i = 0; i < this.#boardPoints.length; i++) {
      this.#renderPoint(this.#boardPoints[i]);
    }
  }
}
