import { isPromise } from './promise.predicate';

describe('isPromise', () => {
	it('can recognize a promise', () => expect(isPromise(new Promise(() => null))).toBeTruthy());

	it('can recognize a non-promise', () => expect(isPromise(42)).toBeFalsy());
	it('can recognize a falsy value', () => expect(isPromise(null)).toBeFalsy());
});
