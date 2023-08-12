import BriefView from './view/brief-view';
import {render} from './render';

const siteMainElement = document.querySelector('.page-body');
const siteHeaderElement = siteMainElement.querySelector('.trip-main');

render(new BriefView(), siteHeaderElement);
