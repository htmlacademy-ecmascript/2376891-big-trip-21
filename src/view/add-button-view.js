import AbstractView from '../framework/view/abstract-view';

function createAddButtonTemplate() {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" disabled="">New event</button>';
}

export default class AddButtonView extends AbstractView {
  get template() {
    return createAddButtonTemplate();
  }
}
