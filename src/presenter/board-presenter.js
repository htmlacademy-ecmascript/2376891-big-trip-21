import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import NoPointView from '../view/no-point-view.js';
import LoadingView from '../view/loading-view.js';
import FilterPresenter from '../presenter/filter-presenter.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import {render, remove, replace} from '../framework/render.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';
import {sortPointsByDay, sortPointsByTime, sortPointsByPrice} from '../utils/date.js';
import {Filter} from '../utils/filter.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class BoardPresenter {
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #filterModel = null;
  #dataService = null;
  #sortComponent = null;
  #noPointComponent = null;
  #eventListComponent = new EventListView();
  #loadingComponent = new LoadingView();
  #newPointPresenter = null;
  #newFilterPresenter = null;
  #pointPresenters = new Map();
  #container = null;
  #handleNewPointButtonDisable = null;
  #handleNewPointButtonUnlock = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isServerAvailable = true;
  _isMessageRemoved = false;
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });

  constructor({container, destinationsModel, offersModel, pointsModel, dataService, filterModel, onNewPointButtonDisable, onNewPointButtonUnblock}) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#dataService = dataService;
    this.#handleNewPointButtonDisable = onNewPointButtonDisable;
    this.#handleNewPointButtonUnlock = onNewPointButtonUnblock;

    const filtersElement = document.querySelector('.trip-controls__filters');

    render(this.#eventListComponent, this.#container);

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#eventListComponent.element,
      destinationModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#viewActionHandler,
      onDestroy: this.#handleNewPointButtonUnlock,
      onEditFormClose: this._editFormCloseHandler,
    });

    this.#newFilterPresenter = new FilterPresenter({
      filterContainer: filtersElement,
      filterModel,
      pointsModel,
    });

    this.#dataService.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  get points() {
    const points = this.#pointsModel.points;
    this.#filterType = this.#filterModel.filter;

    if (!points) {
      return null;
    }

    const filteredPoints = Filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortPointsByDay);
      case SortType.TIME:
        return filteredPoints.sort(sortPointsByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortPointsByPrice);
    }

    return filteredPoints;
  }

  init() {
    this.#renderBoard();
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
    if (this.#noPointComponent) {
      this._isMessageRemoved = true;
      remove(this.#noPointComponent);
    }
  }

  _editFormCloseHandler = () => {
    if (this._isMessageRemoved) {
      this.#renderNoPoints(true);
      this._isMessageRemoved = false;
    }
  };

  #renderSort() {
    const prevSortComponent = this.#sortComponent;

    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#sortTypeChangeHandler,
    });

    if (prevSortComponent === null) {
      render(this.#sortComponent, this.#container);
      return;
    }

    replace(this.#sortComponent, prevSortComponent);
  }

  #renderPointsList() {
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#container);
  }

  #renderNoPoints(isServerAvailable) {
    this.#noPointComponent = new NoPointView({
      filterType: this.#filterType,
      isServerAvailable
    });
    if (!isServerAvailable) {
      this.#handleNewPointButtonDisable();
    }
    render(this.#noPointComponent, this.#container);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#eventListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#viewActionHandler,
      onModeChange: this.#modeChangeHandler,
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderBoard() {
    this.#isServerAvailable = Boolean(this.points);
    this.#newFilterPresenter.init();

    if (this.#isLoading) {
      this.#renderLoading();
      this.#handleNewPointButtonDisable();
      return;
    }

    if (!this.#isServerAvailable || this.points.length === 0) {
      this.#handleNewPointButtonUnlock();
      this.#renderNoPoints(this.#isServerAvailable);
      return;
    }

    this.#handleNewPointButtonUnlock();
    this.#renderSort();
    render(this.#eventListComponent, this.#container);

    this.#renderPointsList();
  }

  #clearBoard({resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#loadingComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #viewActionHandler = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #modeChangeHandler = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderSort();
    this.#renderBoard();
  };
}
