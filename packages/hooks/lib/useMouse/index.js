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

var useEventListener_1 = __importDefault(require("../useEventListener"));

var domTarget_1 = require("../utils/domTarget");

var initState = {
  screenX: NaN,
  screenY: NaN,
  clientX: NaN,
  clientY: NaN,
  pageX: NaN,
  pageY: NaN,
  elementX: NaN,
  elementY: NaN,
  elementH: NaN,
  elementW: NaN,
  elementPosX: NaN,
  elementPosY: NaN
};

exports["default"] = function (target) {
  var _a = __read(useRafState_1["default"](initState), 2),
      state = _a[0],
      setState = _a[1];

  useEventListener_1["default"]('mousemove', function (event) {
    var screenX = event.screenX,
        screenY = event.screenY,
        clientX = event.clientX,
        clientY = event.clientY,
        pageX = event.pageX,
        pageY = event.pageY;
    var newState = {
      screenX: screenX,
      screenY: screenY,
      clientX: clientX,
      clientY: clientY,
      pageX: pageX,
      pageY: pageY,
      elementX: NaN,
      elementY: NaN,
      elementH: NaN,
      elementW: NaN,
      elementPosX: NaN,
      elementPosY: NaN
    };
    var targetElement = domTarget_1.getTargetElement(target);

    if (targetElement) {
      var _a = targetElement.getBoundingClientRect(),
          left = _a.left,
          top_1 = _a.top,
          width = _a.width,
          height = _a.height;

      newState.elementPosX = left + window.pageXOffset;
      newState.elementPosY = top_1 + window.pageYOffset;
      newState.elementX = pageX - newState.elementPosX;
      newState.elementY = pageY - newState.elementPosY;
      newState.elementW = width;
      newState.elementH = height;
    }

    setState(newState);
  }, {
    target: document
  });
  return state;
};