export default class DestinationsModel {
  constructor(service) {
    this.service = service;
    this.destinations = this.service.getDestinations();
  }

  getDestinations() {
    return this.destinations;
  }

  getDestinationsById(id) {
    return this.destinations.find((destination) => destination.id === id);
  }
}

