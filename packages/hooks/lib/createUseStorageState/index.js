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
exports.createUseStorageState = void 0;
/* eslint-disable no-empty */

var react_1 = require("react");

var useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));

var useUpdateEffect_1 = __importDefault(require("../useUpdateEffect"));

var utils_1 = require("../utils");

function createUseStorageState(getStorage) {
  function useStorageState(key, options) {
    var storage; // https://github.com/alibaba/hooks/issues/800

    try {
      storage = getStorage();
    } catch (err) {
      console.error(err);
    }

    var serializer = function serializer(value) {
      if (options === null || options === void 0 ? void 0 : options.serializer) {
        return options === null || options === void 0 ? void 0 : options.serializer(value);
      }

      return JSON.stringify(value);
    };

    var deserializer = function deserializer(value) {
      if (options === null || options === void 0 ? void 0 : options.deserializer) {
        return options === null || options === void 0 ? void 0 : options.deserializer(value);
      }

      return JSON.parse(value);
    };

    function getStoredValue() {
      try {
        var raw = storage === null || storage === void 0 ? void 0 : storage.getItem(key);

        if (raw) {
          return deserializer(raw);
        }
      } catch (e) {
        console.error(e);
      }

      if (utils_1.isFunction(options === null || options === void 0 ? void 0 : options.defaultValue)) {
        return options === null || options === void 0 ? void 0 : options.defaultValue();
      }

      return options === null || options === void 0 ? void 0 : options.defaultValue;
    }

    var _a = __read(react_1.useState(function () {
      return getStoredValue();
    }), 2),
        state = _a[0],
        setState = _a[1];

    useUpdateEffect_1["default"](function () {
      setState(getStoredValue());
    }, [key]);

    var updateState = function updateState(value) {
      if (typeof value === 'undefined') {
        setState(undefined);
        storage === null || storage === void 0 ? void 0 : storage.removeItem(key);
      } else if (utils_1.isFunction(value)) {
        var currentState = value(state);

        try {
          setState(currentState);
          storage === null || storage === void 0 ? void 0 : storage.setItem(key, serializer(currentState));
        } catch (e) {
          console.error(e);
        }
      } else {
        try {
          setState(value);
          storage === null || storage === void 0 ? void 0 : storage.setItem(key, serializer(value));
        } catch (e) {
          console.error(e);
        }
      }
    };

    return [state, useMemoizedFn_1["default"](updateState)];
  }

  return useStorageState;
}

exports.createUseStorageState = createUseStorageState;