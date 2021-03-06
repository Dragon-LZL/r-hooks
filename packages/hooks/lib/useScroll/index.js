"use strict";

var __read = this && this.__read || function (o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) {
      ar.push(r.value);
    }
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var useRafState_1 = __importDefault(require("../useRafState"));

var useLatest_1 = __importDefault(require("../useLatest"));

var domTarget_1 = require("../utils/domTarget");

var useEffectWithTarget_1 = __importDefault(require("../utils/useEffectWithTarget"));

function useScroll(target, shouldUpdate) {
  if (shouldUpdate === void 0) {
    shouldUpdate = function shouldUpdate() {
      return true;
    };
  }

  var _a = __read(useRafState_1["default"](), 2),
      position = _a[0],
      setPosition = _a[1];

  var shouldUpdateRef = useLatest_1["default"](shouldUpdate);
  useEffectWithTarget_1["default"](function () {
    var el = domTarget_1.getTargetElement(target, document);

    if (!el) {
      return;
    }

    var updatePosition = function updatePosition() {
      var newPosition;

      if (el === document) {
        if (document.scrollingElement) {
          newPosition = {
            left: document.scrollingElement.scrollLeft,
            top: document.scrollingElement.scrollTop
          };
        } else {
          // When in quirks mode, the scrollingElement attribute returns the HTML body element if it exists and is potentially scrollable, otherwise it returns null.
          // https://developer.mozilla.org/zh-CN/docs/Web/API/Document/scrollingElement
          // https://stackoverflow.com/questions/28633221/document-body-scrolltop-firefox-returns-0-only-js
          newPosition = {
            left: Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop),
            top: Math.max(window.pageXOffset, document.documentElement.scrollLeft, document.body.scrollLeft)
          };
        }
      } else {
        newPosition = {
          left: el.scrollLeft,
          top: el.scrollTop
        };
      }

      if (shouldUpdateRef.current(newPosition)) {
        setPosition(newPosition);
      }
    };

    updatePosition();
    el.addEventListener('scroll', updatePosition);
    return function () {
      el.removeEventListener('scroll', updatePosition);
    };
  }, [], target);
  return position;
}

exports["default"] = useScroll;