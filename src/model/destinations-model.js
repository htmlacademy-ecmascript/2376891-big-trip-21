import Observable from '../framework/observable';

export default class DestinationsModel extends Observable {
  #service = null;

  constructor(service) {
    super();
    this.#service = service;
  }

  get destinations() {
    return this.#service.destinations;
  }
}

