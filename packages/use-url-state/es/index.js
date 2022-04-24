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

import { useMemoizedFn, useUpdate } from 'ahooks';
import { parse, stringify } from 'query-string';
import { useMemo, useRef } from 'react';
import * as tmp from 'react-router'; // ignore waring `"export 'useNavigate' (imported as 'rc') was not found in 'react-router'`

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
  var update = useUpdate();
  var initialStateRef = useRef(typeof initialState === 'function' ? initialState() : initialState || {});
  var queryFromUrl = useMemo(function () {
    return parse(location.search, mergedParseOptions);
  }, [location.search]);
  var targetQuery = useMemo(function () {
    return __assign(__assign({}, initialStateRef.current), queryFromUrl);
  }, [queryFromUrl]);

  var setState = function setState(s) {
    var newQuery = typeof s === 'function' ? s(targetQuery) : s; // 1. 如果 setState 后，search 没变化，就需要 update 来触发一次更新。比如 demo1 直接点击 clear，就需要 update 来触发更新。
    // 2. update 和 history 的更新会合并，不会造成多次更新

    update();

    if (history) {
      history[navigateMode]({
        hash: location.hash,
        search: stringify(__assign(__assign({}, queryFromUrl), newQuery), mergedStringifyOptions) || '?'
      });
    }

    if (navigate) {
      navigate({
        hash: location.hash,
        search: stringify(__assign(__assign({}, queryFromUrl), newQuery), mergedStringifyOptions) || '?'
      }, {
        replace: navigateMode === 'replace'
      });
    }
  };

  return [targetQuery, useMemoizedFn(setState)];
};

export default useUrlState;