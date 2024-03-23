import { from, isObservable, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { isFunction } from './function.predicate';
import { isPromise } from './promise.predicate';

/**
 * Returns a cold observable from a function, or returns an observable if
 * one is directly passed to it
 */
export const intoObservable = <T>(
	getValue: T | Observable<T> | Promise<T> | (() => T | Promise<T> | Observable<T>),
): Observable<T> => {
	if (isObservable(getValue)) {
		return getValue;
	} else if (isFunction(getValue)) {
		return of(null).pipe(
			switchMap(() => {
				const result = getValue();
				if (isObservable(result)) {
					return result;
				}
				if (isPromise(result)) {
					return from(result);
				} else {
					return of(result);
				}
			}),
		);
	} else if (isPromise(getValue)) {
		return from(getValue);
	} else {
		return of(getValue);
	}
};
