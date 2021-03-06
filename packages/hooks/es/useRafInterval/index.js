import { useEffect } from 'react';
import useLatest from '../useLatest';

var setRafInterval = function setRafInterval(callback, delay) {
  if (delay === void 0) {
    delay = 0;
  }

  if (typeof requestAnimationFrame === typeof undefined) {
    return {
      id: setInterval(callback, delay)
    };
  }

  var start = new Date().getTime();
  var handle = {
    id: 0
  };

  var loop = function loop() {
    var current = new Date().getTime();

    if (current - start >= delay) {
      callback();
      start = new Date().getTime();
    }

    handle.id = requestAnimationFrame(loop);
  };

  handle.id = requestAnimationFrame(loop);
  return handle;
};

function cancelAnimationFrameIsNotDefined(t) {
  return typeof cancelAnimationFrame === typeof undefined;
}

var clearRafInterval = function clearRafInterval(handle) {
  if (cancelAnimationFrameIsNotDefined(handle.id)) {
    return clearInterval(handle.id);
  }

  cancelAnimationFrame(handle.id);
};

function useRafInterval(fn, delay, options) {
  var immediate = options === null || options === void 0 ? void 0 : options.immediate;
  var fnRef = useLatest(fn);
  useEffect(function () {
    if (typeof delay !== 'number' || delay < 0) return;

    if (immediate) {
      fnRef.current();
    }

    var timer = setRafInterval(function () {
      fnRef.current();
    }, delay);
    return function () {
      clearRafInterval(timer);
    };
  }, [delay]);
}

export default useRafInterval;