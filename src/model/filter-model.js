import Observable from '../framework/observable';
import { FilterType } from '../mock/const';

export default class FilterModel extends Observable {
  #filter = FilterType.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  setFilter(updateType, filter) {
    this.#filter = filter;
    // console.log(updateType);
    // console.log(filter);
    this._notify(updateType, filter);
  }
}
