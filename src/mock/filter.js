import {filter} from '../utils/filter';

function generateFilter(points) {
  return Object.entries(filter).map(([FilterType, filterPoints]) => ({
    type: FilterType,
    count: filterPoints(points).length,
    filterPoints: filterPoints(points),
  }),
  );
}

export {generateFilter};
