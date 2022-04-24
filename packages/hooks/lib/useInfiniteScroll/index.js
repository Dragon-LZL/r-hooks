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

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
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

var react_1 = require("react");

var useEventListener_1 = __importDefault(require("../useEventListener"));

var useMemoizedFn_1 = __importDefault(require("../useMemoizedFn"));

var useRequest_1 = __importDefault(require("../useRequest"));

var useUpdateEffect_1 = __importDefault(require("../useUpdateEffect"));

var domTarget_1 = require("../utils/domTarget");

var rect_1 = require("../utils/rect");

var useInfiniteScroll = function useInfiniteScroll(service, options) {
  if (options === void 0) {
    options = {};
  }

  var target = options.target,
      isNoMore = options.isNoMore,
      _a = options.threshold,
      threshold = _a === void 0 ? 100 : _a,
      _b = options.reloadDeps,
      reloadDeps = _b === void 0 ? [] : _b,
      manual = options.manual,
      _onBefore = options.onBefore,
      _onSuccess = options.onSuccess,
      _onError = options.onError,
      _onFinally = options.onFinally;

  var _c = __read(react_1.useState(), 2),
      finalData = _c[0],
      setFinalData = _c[1];

  var _d = __read(react_1.useState(false), 2),
      loadingMore = _d[0],
      setLoadingMore = _d[1];

  var noMore = react_1.useMemo(function () {
    if (!isNoMore) return false;
    return isNoMore(finalData);
  }, [finalData]);

  var _e = useRequest_1["default"](function (lastData) {
    return __awaiter(void 0, void 0, void 0, function () {
      var currentData;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , service(lastData)];

          case 1:
            currentData = _a.sent();

            if (!lastData) {
              setFinalData(currentData);
            } else {
              setFinalData(__assign(__assign({}, currentData), {
                // @ts-ignore
                list: __spread(lastData.list, currentData.list)
              }));
            }

            return [2
            /*return*/
            , currentData];
        }
      });
    });
  }, {
    manual: manual,
    onFinally: function onFinally(_, d, e) {
      setLoadingMore(false);
      _onFinally === null || _onFinally === void 0 ? void 0 : _onFinally(d, e);
    },
    onBefore: function onBefore() {
      return _onBefore === null || _onBefore === void 0 ? void 0 : _onBefore();
    },
    onSuccess: function onSuccess(d) {
      setTimeout(function () {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        scrollMethod();
      });
      _onSuccess === null || _onSuccess === void 0 ? void 0 : _onSuccess(d);
    },
    onError: function onError(e) {
      return _onError === null || _onError === void 0 ? void 0 : _onError(e);
    }
  }),
      loading = _e.loading,
      run = _e.run,
      runAsync = _e.runAsync,
      cancel = _e.cancel;

  var loadMore = function loadMore() {
    if (noMore) return;
    setLoadingMore(true);
    run(finalData);
  };

  var loadMoreAsync = function loadMoreAsync() {
    if (noMore) return;
    setLoadingMore(true);
    return runAsync(finalData);
  };

  var reload = function reload() {
    return run();
  };

  var reloadAsync = function reloadAsync() {
    return runAsync();
  };

  var scrollMethod = function scrollMethod() {
    var el = domTarget_1.getTargetElement(target);

    if (!el) {
      return;
    }

    var scrollTop = rect_1.getScrollTop(el);
    var scrollHeight = rect_1.getScrollHeight(el);
    var clientHeight = rect_1.getClientHeight(el);

    if (scrollHeight - scrollTop <= clientHeight + threshold) {
      loadMore();
    }
  };

  useEventListener_1["default"]('scroll', function () {
    if (loading || loadingMore) {
      return;
    }

    scrollMethod();
  }, {
    target: target
  });
  useUpdateEffect_1["default"](function () {
    run();
  }, __spread(reloadDeps));
  return {
    data: finalData,
    loading: !loadingMore && loading,
    loadingMore: loadingMore,
    noMore: noMore,
    loadMore: useMemoizedFn_1["default"](loadMore),
    loadMoreAsync: useMemoizedFn_1["default"](loadMoreAsync),
    reload: useMemoizedFn_1["default"](reload),
    reloadAsync: useMemoizedFn_1["default"](reloadAsync),
    mutate: setFinalData,
    cancel: cancel
  };
};

exports["default"] = useInfiniteScroll;