import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import { render } from '../render.js';

export default class BoardPresenter {
  eventListComponent = new EventListView();

  constructor({container, destinationsModel, offersModel, pointsModel}) {
    this.container = container;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
    this.pointsModel = pointsModel;
  }

  init() {
    this.boardPoints = [...this.pointsModel.getPoints()];

    this.destinationById = this.destinationsModel.getDestinationsById(this.boardPoints[0].destination);
    this.pointOffersByType = this.offersModel.getOffersByType(this.boardPoints[0].type);
    this.pointTypes = this.boardPoints.map((point) => point.type);

    render(new SortView(), this.container);
    render(this.eventListComponent, this.container);
    render(new PointEditView({
      pointDestinations: this.destinationsModel.getDestinations(),
      pointOffersByType: this.pointOffersByType,
      point: this.boardPoints[0],
      destinationById: this.destinationById,
      pointTypes: this.pointTypes,
    }), this.eventListComponent.getElement());

    for (let i = 1; i < this.boardPoints.length; i++) {
      this.pointOffersByType = this.offersModel.getOffersByType(this.boardPoints[i].type);
      this.pointOffers = this.boardPoints[i].offers.map((IdOffer) => this.pointOffersByType.find((offer) => offer.id === IdOffer));

      render(new PointView({
        pointDestination: this.destinationsModel.getDestinationsById(this.boardPoints[i].destination),
        pointOffers: this.pointOffers,
        point: this.boardPoints[i],
      }), this.eventListComponent.getElement());
    }
  }
}
