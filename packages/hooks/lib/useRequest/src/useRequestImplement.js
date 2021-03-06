"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __rest = this && this.__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

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

var __spread = this && this.__spread || function () {
  for (var ar = [], i = 0; i < arguments.length; i++) {
    ar = ar.concat(__read(arguments[i]));
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

var useCreation_1 = __importDefault(require("../../useCreation"));

var useLatest_1 = __importDefault(require("../../useLatest"));

var useMemoizedFn_1 = __importDefault(require("../../useMemoizedFn"));

var useMount_1 = __importDefault(require("../../useMount"));

var useUnmount_1 = __importDefault(require("../../useUnmount"));

var useUpdate_1 = __importDefault(require("../../useUpdate"));

var Fetch_1 = __importDefault(require("./Fetch"));

function useRequestImplement(service, options, plugins) {
  if (options === void 0) {
    options = {};
  }

  if (plugins === void 0) {
    plugins = [];
  }

  var _a = options.manual,
      manual = _a === void 0 ? false : _a,
      rest = __rest(options, ["manual"]);

  var fetchOptions = __assign({
    manual: manual
  }, rest);

  var serviceRef = useLatest_1["default"](service);
  var update = useUpdate_1["default"]();
  var fetchInstance = useCreation_1["default"](function () {
    var initState = plugins.map(function (p) {
      var _a;

      return (_a = p === null || p === void 0 ? void 0 : p.onInit) === null || _a === void 0 ? void 0 : _a.call(p, fetchOptions);
    }).filter(Boolean);
    return new Fetch_1["default"](serviceRef, fetchOptions, update, Object.assign.apply(Object, __spread([{}], initState)));
  }, []);
  fetchInstance.options = fetchOptions; // run all plugins hooks

  fetchInstance.pluginImpls = plugins.map(function (p) {
    return p(fetchInstance, fetchOptions);
  });
  useMount_1["default"](function () {
    if (!manual) {
      // useCachePlugin can set fetchInstance.state.params from cache when init
      var params = fetchInstance.state.params || options.defaultParams || []; // @ts-ignore

      fetchInstance.run.apply(fetchInstance, __spread(params));
    }
  });
  useUnmount_1["default"](function () {
    fetchInstance.cancel();
  });
  return {
    loading: fetchInstance.state.loading,
    data: fetchInstance.state.data,
    error: fetchInstance.state.error,
    params: fetchInstance.state.params || [],
    cancel: useMemoizedFn_1["default"](fetchInstance.cancel.bind(fetchInstance)),
    refresh: useMemoizedFn_1["default"](fetchInstance.refresh.bind(fetchInstance)),
    refreshAsync: useMemoizedFn_1["default"](fetchInstance.refreshAsync.bind(fetchInstance)),
    run: useMemoizedFn_1["default"](fetchInstance.run.bind(fetchInstance)),
    runAsync: useMemoizedFn_1["default"](fetchInstance.runAsync.bind(fetchInstance)),
    mutate: useMemoizedFn_1["default"](fetchInstance.mutate.bind(fetchInstance))
  };
}

exports["default"] = useRequestImplement;