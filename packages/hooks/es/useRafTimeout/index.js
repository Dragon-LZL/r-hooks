import { useEffect } from 'react';
import useLatest from '../useLatest';

var setRafTimeout = function setRafTimeout(callback, delay) {
  if (delay === void 0) {
    delay = 0;
  }

  if (typeof requestAnimationFrame === typeof undefined) {
    return {
      id: setTimeout(callback, delay)
    };
  }

  var handle = {
    id: 0
  };
  var startTime = new Date().getTime();

  var loop = function loop() {
    var current = new Date().getTime();

    if (current - startTime >= delay) {
      callback();
    } else {
      handle.id = requestAnimationFrame(loop);
    }
  };

  handle.id = requestAnimationFrame(loop);
  return handle;
};

function cancelAnimationFrameIsNotDefined(t) {
  return typeof cancelAnimationFrame === typeof undefined;
}

var clearRafTimeout = function clearRafTimeout(handle) {
  if (cancelAnimationFrameIsNotDefined(handle.id)) {
    return clearTimeout(handle.id);
  }

  cancelAnimationFrame(handle.id);
};

function useRafTimeout(fn, delay) {
  var fnRef = useLatest(fn);
  useEffect(function () {
    if (typeof delay !== 'number' || delay < 0) return;
    var timer = setRafTimeout(function () {
      fnRef.current();
    }, delay);
    return function () {
      clearRafTimeout(timer);
    };
  }, [delay]);
}

export default useRafTimeout;