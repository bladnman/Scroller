export function scrollTo({
  element,
  toPoint,
  durationMs = 200,
  fps = 60,
  easeFn = Scroller.EASE.easeOutCuaic,
  onComplete,
  onCancel
}) {
  if (!element) return null;
  if (!toPoint) return null;
  return new Scroller({
    element,
    toPoint,
    durationMs,
    fps,
    easeFn,
    onComplete,
    onCancel
  });
}

export default class Scroller {
  static EASE = {
    easeOutCuaic,
    linearTween,
    easeInQuad,
    easeOutQuad,
    easeInOutQuad,
    easeInCuaic,
    easeInOutCuaic,
    easeInQuart,
    easeOutQuart,
    easeInOutQuart,
    easeInQuint,
    easeOutQuint,
    easeInOutQuint,
    easeInSine,
    easeOutSine,
    easeInOutSine,
    easeInExpo,
    easeOutExpo,
    easeInOutExpo,
    easeInCirc,
    easeOutCirc,
    easeInOutCirc
  };
  constructor({
    element,
    toPoint,
    durationMs = 0,
    onDone,
    fps = 60,
    easeFn,
    onComplete,
    onCancel
  }) {
    this.element = element;
    this.durationMs = durationMs;
    this.onDone = onDone;
    this.fps = fps;
    this.startPoint = getScrollPointForElement(element);
    this.toPoint = Object.assign({}, this.startPoint, toPoint);
    this.startTimeMs = Date.now();
    this.canceled = false;

    // already there
    if (
      this.startPoint.x === this.toPoint.x &&
      this.startPoint.y === this.toPoint.y
    ) {
      onComplete && setTimeout(onComplete, 1); // call 'done'
    }

    // SCROLL BABY!
    else {
      _scrollTo({
        element: this.element,
        fromPoint: this.startPoint,
        toPoint: this.toPoint,
        durationMs: this.durationMs,
        fps: this.fps,
        scrollerRef: this,
        easeFn,
        onComplete,
        onCancel
      });
    }
  }
  cancel() {
    this.canceled = true;
  }
}

// Element to move, element or px from, element or px to, time in ms to animate
function _scrollTo({
  element,
  fromPoint,
  toPoint,
  durationMs = 0,
  fps = 60,
  easeFn = easeOutCuaic,
  scrollerRef,
  onComplete,
  onCancel
}) {
  if (durationMs <= 0) return;
  return _doScroll({
    element,
    fromPoint,
    toPoint,
    speedModifier: 1 / durationMs,
    stepMs: 1000 / fps,
    easeFn,
    scrollerRef,
    onComplete,
    onCancel
  });
}

function _doScroll({
  element,
  fromPoint,
  toPoint,
  t01 = 0,
  speedModifier,
  stepMs,
  easeFn = easeOutCuaic,
  scrollerRef,
  onComplete,
  onCancel
}) {
  // bail - canceled
  if (scrollerRef && scrollerRef.canceled) {
    onCancel && onCancel();
    return;
  }

  if (t01 < 0 || t01 > 1 || speedModifier <= 0) {
    element.scrollTo(toPoint.x, toPoint.y);
    onComplete && onComplete();
    return;
  }
  const nextPoint = {
    x: toPoint.x,
    y: fromPoint.y - (fromPoint.y - toPoint.y) * easeFn(t01)
  };
  element.scrollTo(nextPoint.x, nextPoint.y);
  t01 += speedModifier * stepMs;

  return setTimeout(function() {
    return _doScroll({
      element,
      fromPoint,
      toPoint,
      t01,
      speedModifier,
      stepMs,
      easeFn,
      scrollerRef,
      onComplete,
      onCancel
    });
  }, stepMs);
}
function getScrollPointForElement(element) {
  if (!element) return null;
  /**
   * Scroll positions
   *
   * We are trying to find out where the scroll position of this element
   * is. This is complicated by the fact that `Window` does not have the
   * same interface as other elements.
   */

  // standard element
  if ("scrollLeft" in element) {
    return {
      x: ~~element.scrollLeft,
      y: ~~element.scrollTop
    };
  }

  // window
  if ("pageYOffset" in element) {
    return {
      x: ~~element.pageXOffset,
      y: ~~element.pageYOffset
    };
  }
}

function linearTween(t) {
  return t;
}
function easeInQuad(t) {
  return t * t;
}
function easeOutQuad(t) {
  return -t * (t - 2);
}
function easeInOutQuad(t) {
  t /= 0.5;
  if (t < 1) return (t * t) / 2;
  t--;
  return (t * (t - 2) - 1) / 2;
}
function easeInCuaic(t) {
  return t * t * t;
}
function easeOutCuaic(t) {
  t--;
  return t * t * t + 1;
}
function easeInOutCuaic(t) {
  t /= 0.5;
  if (t < 1) return (t * t * t) / 2;
  t -= 2;
  return (t * t * t + 2) / 2;
}
function easeInQuart(t) {
  return t * t * t * t;
}
function easeOutQuart(t) {
  t--;
  return -(t * t * t * t - 1);
}
function easeInOutQuart(t) {
  t /= 0.5;
  if (t < 1) return 0.5 * t * t * t * t;
  t -= 2;
  return -(t * t * t * t - 2) / 2;
}
function easeInQuint(t) {
  return t * t * t * t * t;
}
function easeOutQuint(t) {
  t--;
  return t * t * t * t * t + 1;
}
function easeInOutQuint(t) {
  t /= 0.5;
  if (t < 1) return (t * t * t * t * t) / 2;
  t -= 2;
  return (t * t * t * t * t + 2) / 2;
}
function easeInSine(t) {
  return -Math.cos(t / (Math.PI / 2)) + 1;
}
function easeOutSine(t) {
  return Math.sin(t / (Math.PI / 2));
}
function easeInOutSine(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}
function easeInExpo(t) {
  return Math.pow(2, 10 * (t - 1));
}
function easeOutExpo(t) {
  return -Math.pow(2, -10 * t) + 1;
}
function easeInOutExpo(t) {
  t /= 0.5;
  if (t < 1) return Math.pow(2, 10 * (t - 1)) / 2;
  t--;
  return (-Math.pow(2, -10 * t) + 2) / 2;
}
function easeInCirc(t) {
  return -Math.sqrt(1 - t * t) - 1;
}
function easeOutCirc(t) {
  t--;
  return Math.sqrt(1 - t * t);
}
function easeInOutCirc(t) {
  t /= 0.5;
  if (t < 1) return -(Math.sqrt(1 - t * t) - 1) / 2;
  t -= 2;
  return (Math.sqrt(1 - t * t) + 1) / 2;
}
