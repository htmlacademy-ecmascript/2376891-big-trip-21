import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../const.js';

function createSortTemplate(sortType) {
  let sortTemplate = '<form class="trip-events__trip-sort  trip-sort" action="#" method="get">';

  Object.values(SortType).forEach((type) => {
    sortTemplate += `
      <div class="trip-sort__item  trip-sort__item--${type}">
        <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type}" data-sort-type="${type}" ${type === sortType ? 'checked' : ''} ${type === SortType.EVENT || type === SortType.OFFERS ? 'disabled' : ''}>
        <label class="trip-sort__btn" for="sort-${type}">${type}</label>
      </div>
      `;
  });

  sortTemplate += '</form>';

  return sortTemplate;
}

export default class SortView extends AbstractView {
  #handleSortTypeChange = null;
  #sortType = null;

  constructor({currentSortType, onSortTypeChange}) {
    super();
    this.#sortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#sortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
