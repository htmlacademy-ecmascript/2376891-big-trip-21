import {createElement} from '../render';

function createBriefTemplate() {
  return (
    ``);
}

export default class BriefView {
  getTemplate() {
    return createBriefTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

