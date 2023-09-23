import PointEditView from '../view/point-edit-view.js';
import {remove, render, RenderPosition} from '../framework/render.js';
import {UserAction, UpdateType, TYPES} from '../const.js';
import {isEscape} from '../utils/common.js';

export default class NewPointPresenter {
  #pointListContainer = null;
  #destinationModel = null;
  #offersModel = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #handleEditFormClose = null;
  #pointEditComponent = null;

  constructor({pointListContainer, destinationModel, offersModel, onDataChange, onDestroy, onEditFormClose}) {
    this.#pointListContainer = pointListContainer;
    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#handleEditFormClose = onEditFormClose;
  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }
    this.#pointEditComponent = new PointEditView({
      pointTypes: TYPES,
      destinations: this.#destinationModel.destinations,
      offers: this.#offersModel.offers,
      onFormSubmit: this.#formSubmitHandler,
      onCancelClick: this.#cancelClickHandler,
    });

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;
    this.#handleEditFormClose();

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #formSubmitHandler = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #cancelClickHandler = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (isEscape(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
