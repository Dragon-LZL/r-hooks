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

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function get() {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  }

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ahooks_1 = require("ahooks");

var query_string_1 = require("query-string");

var react_1 = require("react");

var tmp = __importStar(require("react-router")); // ignore waring `"export 'useNavigate' (imported as 'rc') was not found in 'react-router'`


var rc = tmp;
var baseParseConfig = {
  parseNumbers: false,
  parseBooleans: false
};
var baseStringifyConfig = {
  skipNull: false,
  skipEmptyString: false
};

var useUrlState = function useUrlState(initialState, options) {
  var _a, _b;

  var _c = options || {},
      _d = _c.navigateMode,
      navigateMode = _d === void 0 ? 'push' : _d,
      parseOptions = _c.parseOptions,
      stringifyOptions = _c.stringifyOptions;

  var mergedParseOptions = __assign(__assign({}, baseParseConfig), parseOptions);

  var mergedStringifyOptions = __assign(__assign({}, baseStringifyConfig), stringifyOptions);

  var location = rc.useLocation(); // react-router v5

  var history = (_a = rc.useHistory) === null || _a === void 0 ? void 0 : _a.call(rc); // react-router v6

  var navigate = (_b = rc.useNavigate) === null || _b === void 0 ? void 0 : _b.call(rc);
  var update = ahooks_1.useUpdate();
  var initialStateRef = react_1.useRef(typeof initialState === 'function' ? initialState() : initialState || {});
  var queryFromUrl = react_1.useMemo(function () {
    return query_string_1.parse(location.search, mergedParseOptions);
  }, [location.search]);
  var targetQuery = react_1.useMemo(function () {
    return __assign(__assign({}, initialStateRef.current), queryFromUrl);
  }, [queryFromUrl]);

  var setState = function setState(s) {
    var newQuery = typeof s === 'function' ? s(targetQuery) : s; // 1. 如果 setState 后，search 没变化，就需要 update 来触发一次更新。比如 demo1 直接点击 clear，就需要 update 来触发更新。
    // 2. update 和 history 的更新会合并，不会造成多次更新

    update();

    if (history) {
      history[navigateMode]({
        hash: location.hash,
        search: query_string_1.stringify(__assign(__assign({}, queryFromUrl), newQuery), mergedStringifyOptions) || '?'
      });
    }

    if (navigate) {
      navigate({
        hash: location.hash,
        search: query_string_1.stringify(__assign(__assign({}, queryFromUrl), newQuery), mergedStringifyOptions) || '?'
      }, {
        replace: navigateMode === 'replace'
      });
    }
  };

  return [targetQuery, ahooks_1.useMemoizedFn(setState)];
};

exports["default"] = useUrlState;