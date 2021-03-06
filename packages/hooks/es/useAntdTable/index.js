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

import { useEffect, useRef, useState } from 'react';
import useMemoizedFn from '../useMemoizedFn';
import usePagination from '../usePagination';
import useUpdateEffect from '../useUpdateEffect';

var useAntdTable = function useAntdTable(service, options) {
  var _a;

  if (options === void 0) {
    options = {};
  }

  var form = options.form,
      _b = options.defaultType,
      defaultType = _b === void 0 ? 'simple' : _b,
      defaultParams = options.defaultParams,
      _c = options.manual,
      manual = _c === void 0 ? false : _c,
      _d = options.refreshDeps,
      refreshDeps = _d === void 0 ? [] : _d,
      _e = options.ready,
      ready = _e === void 0 ? true : _e,
      rest = __rest(options, ["form", "defaultType", "defaultParams", "manual", "refreshDeps", "ready"]);

  var result = usePagination(service, __assign({
    manual: true
  }, rest));
  var _f = result.params,
      params = _f === void 0 ? [] : _f,
      run = result.run;
  var cacheFormTableData = params[2] || {};

  var _g = __read(useState((cacheFormTableData === null || cacheFormTableData === void 0 ? void 0 : cacheFormTableData.type) || defaultType), 2),
      type = _g[0],
      setType = _g[1];

  var allFormDataRef = useRef({});
  var isAntdV4 = !!(form === null || form === void 0 ? void 0 : form.getInternalHooks); // get current active field values

  var getActivetFieldValues = function getActivetFieldValues() {
    if (!form) {
      return {};
    } // antd 4


    if (isAntdV4) {
      return form.getFieldsValue(null, function () {
        return true;
      });
    } // antd 3


    var allFieldsValue = form.getFieldsValue();
    var activeFieldsValue = {};
    Object.keys(allFieldsValue).forEach(function (key) {
      if (form.getFieldInstance ? form.getFieldInstance(key) : true) {
        activeFieldsValue[key] = allFieldsValue[key];
      }
    });
    return activeFieldsValue;
  };

  var validateFields = function validateFields() {
    if (!form) {
      return Promise.resolve({});
    }

    var activeFieldsValue = getActivetFieldValues();
    var fields = Object.keys(activeFieldsValue); // antd 4

    if (isAntdV4) {
      return form.validateFields(fields);
    } // antd 3


    return new Promise(function (resolve, reject) {
      form.validateFields(fields, function (errors, values) {
        if (errors) {
          reject(errors);
        } else {
          resolve(values);
        }
      });
    });
  };

  var restoreForm = function restoreForm() {
    if (!form) {
      return;
    } // antd v4


    if (isAntdV4) {
      return form.setFieldsValue(allFormDataRef.current);
    } // antd v3


    var activeFieldsValue = {};
    Object.keys(allFormDataRef.current).forEach(function (key) {
      if (form.getFieldInstance ? form.getFieldInstance(key) : true) {
        activeFieldsValue[key] = allFormDataRef.current[key];
      }
    });
    form.setFieldsValue(activeFieldsValue);
  };

  var changeType = function changeType() {
    var activeFieldsValue = getActivetFieldValues();
    allFormDataRef.current = __assign(__assign({}, allFormDataRef.current), activeFieldsValue);
    setType(function (t) {
      return t === 'simple' ? 'advance' : 'simple';
    });
  };

  var _submit = function _submit(initPagination) {
    if (!ready) {
      return;
    }

    setTimeout(function () {
      validateFields().then(function (values) {
        if (values === void 0) {
          values = {};
        }

        var pagination = initPagination || __assign(__assign({
          pageSize: options.defaultPageSize || 10
        }, (params === null || params === void 0 ? void 0 : params[0]) || {}), {
          current: 1
        });

        if (!form) {
          // @ts-ignore
          run(pagination);
          return;
        } // record all form data


        allFormDataRef.current = __assign(__assign({}, allFormDataRef.current), values); // @ts-ignore

        run(pagination, values, {
          allFormData: allFormDataRef.current,
          type: type
        });
      })["catch"](function (err) {
        return err;
      });
    });
  };

  var reset = function reset() {
    if (form) {
      form.resetFields();
    }

    _submit();
  };

  var submit = function submit(e) {
    var _a;

    (_a = e === null || e === void 0 ? void 0 : e.preventDefault) === null || _a === void 0 ? void 0 : _a.call(e);

    _submit();
  };

  var onTableChange = function onTableChange(pagination, filters, sorter) {
    var _a = __read(params || []),
        oldPaginationParams = _a[0],
        restParams = _a.slice(1);

    run.apply(void 0, __spread([__assign(__assign({}, oldPaginationParams), {
      current: pagination.current,
      pageSize: pagination.pageSize,
      filters: filters,
      sorter: sorter
    })], restParams));
  }; // init


  useEffect(function () {
    // if has cache, use cached params. ignore manual and ready.
    if (params.length > 0) {
      allFormDataRef.current = (cacheFormTableData === null || cacheFormTableData === void 0 ? void 0 : cacheFormTableData.allFormData) || {};
      restoreForm(); // @ts-ignore

      run.apply(void 0, __spread(params));
      return;
    }

    if (!manual && ready) {
      allFormDataRef.current = (defaultParams === null || defaultParams === void 0 ? void 0 : defaultParams[1]) || {};
      restoreForm();

      _submit(defaultParams === null || defaultParams === void 0 ? void 0 : defaultParams[0]);
    }
  }, []); // change search type, restore form data

  useUpdateEffect(function () {
    if (!ready) {
      return;
    }

    restoreForm();
  }, [type]); // refresh & ready change on the same time

  var hasAutoRun = useRef(false);
  hasAutoRun.current = false;
  useUpdateEffect(function () {
    if (!manual && ready) {
      hasAutoRun.current = true;

      if (form) {
        form.resetFields();
      }

      allFormDataRef.current = (defaultParams === null || defaultParams === void 0 ? void 0 : defaultParams[1]) || {};
      restoreForm();

      _submit(defaultParams === null || defaultParams === void 0 ? void 0 : defaultParams[0]);
    }
  }, [ready]);
  useUpdateEffect(function () {
    if (hasAutoRun.current) {
      return;
    }

    if (!ready) {
      return;
    }

    if (!manual) {
      hasAutoRun.current = true;
      result.pagination.changeCurrent(1);
    }
  }, __spread(refreshDeps));
  return __assign(__assign({}, result), {
    tableProps: {
      dataSource: ((_a = result.data) === null || _a === void 0 ? void 0 : _a.list) || [],
      loading: result.loading,
      onChange: useMemoizedFn(onTableChange),
      pagination: {
        current: result.pagination.current,
        pageSize: result.pagination.pageSize,
        total: result.pagination.total
      }
    },
    search: {
      submit: useMemoizedFn(submit),
      type: type,
      changeType: useMemoizedFn(changeType),
      reset: useMemoizedFn(reset)
    }
  });
};

export default useAntdTable;