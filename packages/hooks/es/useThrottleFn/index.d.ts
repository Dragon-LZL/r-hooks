/// <reference types="lodash" />
import type { ThrottleOptions } from '../useThrottle/throttleOptions';
declare type noop = (...args: any) => any;
declare function useThrottleFn<T extends noop>(fn: T, options?: ThrottleOptions): {
    run: import("lodash").DebouncedFunc<(...args: Parameters<T>) => ReturnType<T>>;
    cancel: () => void;
    flush: () => ReturnType<T> | undefined;
};
export default useThrottleFn;
