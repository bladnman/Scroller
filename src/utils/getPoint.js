import getFirstNotUndefined from './getFirstNotUndefined';

export default function getPoint({ x, y, left = 0, top = 0 }) {
  return {
    x: getFirstNotUndefined(x, left),
    left: getFirstNotUndefined(x, left),
    y: getFirstNotUndefined(y, top),
    top: getFirstNotUndefined(y, top),
  };
}
