import { isFunction } from './function.predicate';

export function callIfFunction<T = unknown>(funlike: (() => T) | T): T {
	let result;
	if (isFunction<T>(funlike)) {
		result = funlike();
	} else {
		result = funlike;
	}
	return result;
}
