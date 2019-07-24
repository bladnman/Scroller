import getPoint from './getPoint';

export default function getScrollPointForElement(element) {
  if (!element) return null;
  /**
   * Scroll positions
   *
   * We are trying to find out where the scroll position of this element
   * is. This is complicated by the fact that `Window` does not have the
   * same interface as other elements.
   */

  // standard element
  if ('scrollLeft' in element) {
    return getPoint({
      x: ~~element.scrollLeft,
      y: ~~element.scrollTop,
    });
  }

  // window
  if ('pageYOffset' in element) {
    return getPoint({
      x: ~~element.pageXOffset,
      y: ~~element.pageYOffset,
    });
  }
}
