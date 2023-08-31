import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import {render, replace, remove} from '../framework/render.js';
import {Mode} from '../mock/const.js';
import { isEscape } from '../utils/common.js';

export default class PointPresenter {
  #pointListContainer = null;

  #destinationsModel = null;
  #offersModel = null;

  #pointComponent = null;
  #pointEditComponent = null;
  #point = null;
  #pointTypes = null;
  #pointDestination = null;
  #pointOffers = null;
  #pointCheckedOffers = null;
  #mode = Mode.DEFAULT;

  #handleDataChange = null;
  #handleModeChange = null;

  constructor({pointListContainer, destinationsModel, offersModel, pointTypes, onDataChange, onModeChange}) {
    this.#pointListContainer = pointListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointTypes = pointTypes;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    this.#pointDestination = this.#destinationsModel.getDestinationsById(point.destination);
    this.#pointOffers = this.#offersModel.getOffersByType(point.type);
    this.#pointCheckedOffers = point.offers.map((IdOffer) => this.#pointOffers.find((offer) => offer.id === IdOffer));

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      pointDestination: this.#pointDestination,
      pointOffers: this.#pointCheckedOffers,
      point: this.#point,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });
    this.#pointEditComponent = new PointEditView({
      destinations: this.#destinationsModel.destinations,
      pointDestination: this.#pointDestination,
      pointOffers: this.#pointOffers,
      pointCheckedOffers: this.#pointCheckedOffers.map((offer) => offer.id),
      point: this.#point,
      pointTypes: this.#pointTypes,
      onFormSubmit: this.#handleFormSubmit,
      onRollupClick: this.#handleRollupClick,
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  #escKeyDownHandler = (evt) => {
    if (isEscape(evt)) {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #replacePointToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange(point);
    this.#replaceFormToPoint();
  };

  #handleRollupClick = () => {
    this.#replaceFormToPoint();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };
}
