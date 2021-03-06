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

import { useMemo } from 'react';
import useMemoizedFn from '../useMemoizedFn';
import useRequest from '../useRequest';

var usePagination = function usePagination(service, options) {
  var _a;

  if (options === void 0) {
    options = {};
  }

  var _b = options.defaultPageSize,
      defaultPageSize = _b === void 0 ? 10 : _b,
      rest = __rest(options, ["defaultPageSize"]);

  var result = useRequest(service, __assign({
    defaultParams: [{
      current: 1,
      pageSize: defaultPageSize
    }],
    refreshDepsAction: function refreshDepsAction() {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      changeCurrent(1);
    }
  }, rest));

  var _c = result.params[0] || {},
      _d = _c.current,
      current = _d === void 0 ? 1 : _d,
      _e = _c.pageSize,
      pageSize = _e === void 0 ? defaultPageSize : _e;

  var total = ((_a = result.data) === null || _a === void 0 ? void 0 : _a.total) || 0;
  var totalPage = useMemo(function () {
    return Math.ceil(total / pageSize);
  }, [pageSize, total]);

  var onChange = function onChange(c, p) {
    var toCurrent = c <= 0 ? 1 : c;
    var toPageSize = p <= 0 ? 1 : p;
    var tempTotalPage = Math.ceil(total / toPageSize);

    if (toCurrent > tempTotalPage) {
      toCurrent = Math.max(1, tempTotalPage);
    }

    var _a = __read(result.params || []),
        _b = _a[0],
        oldPaginationParams = _b === void 0 ? {} : _b,
        restParams = _a.slice(1);

    result.run.apply(result, __spread([__assign(__assign({}, oldPaginationParams), {
      current: toCurrent,
      pageSize: toPageSize
    })], restParams));
  };

  var changeCurrent = function changeCurrent(c) {
    onChange(c, pageSize);
  };

  var changePageSize = function changePageSize(p) {
    onChange(current, p);
  };

  return __assign(__assign({}, result), {
    pagination: {
      current: current,
      pageSize: pageSize,
      total: total,
      totalPage: totalPage,
      onChange: useMemoizedFn(onChange),
      changeCurrent: useMemoizedFn(changeCurrent),
      changePageSize: useMemoizedFn(changePageSize)
    }
  });
};

export default usePagination;