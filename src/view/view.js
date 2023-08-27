import AbstractView from '../framework/view/abstract-view';

function createBriefTemplate() {
  return (
    ``);
}

export default class BriefView extends AbstractView {
  get template() {
    return createBriefTemplate();
  }
}
