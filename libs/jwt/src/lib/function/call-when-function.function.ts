import { isFunction } from './function.predicate';

export const callWhenFunction = <T = unknown>(functionLike: (() => T) | T): T => {
	let result;
	if (isFunction<T>(functionLike)) {
		result = functionLike();
	} else {
		result = functionLike;
	}
	return result;
};
