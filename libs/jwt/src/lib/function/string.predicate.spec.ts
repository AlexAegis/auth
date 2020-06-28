import { isString } from './string.predicate';

describe('isString', () => {
	it('can recognize an empty string', () => expect(isString('')).toBeTruthy());

	it('can recognize a non-empty string', () => expect(isString('foo')).toBeTruthy());

	it('can recognize a non-string', () => expect(isString(42)).toBeFalsy());
});
