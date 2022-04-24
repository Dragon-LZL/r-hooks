import type { ParseOptions, StringifyOptions } from 'query-string';
import type * as React from 'react';
export interface Options {
    navigateMode?: 'push' | 'replace';
    parseOptions?: ParseOptions;
    stringifyOptions?: StringifyOptions;
}
declare const useUrlState: <S extends Record<string, any> = Record<string, any>>(initialState?: S | (() => S) | undefined, options?: Options | undefined) => readonly [Partial<{ [key in keyof S]: any; }>, (this: unknown, s: React.SetStateAction<Partial<{ [key in keyof S]: any; }>>) => void];
export default useUrlState;
