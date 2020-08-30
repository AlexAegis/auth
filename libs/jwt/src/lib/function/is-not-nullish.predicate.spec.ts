import { isNotNullish } from './is-not-nullish.predicate';

describe('isNotNullish', () => {
	it('can detect a null as nullish', () => expect(isNotNullish(null)).toBeFalsy());

	it('can detect undefined as nullish', () => expect(isNotNullish(undefined)).toBeFalsy());

	it('can detect an empty string as non-nullish', () => expect(isNotNullish('')).toBeTruthy());

	it('can detect 0 as non-nullish', () => expect(isNotNullish(0)).toBeTruthy());

	it('can detect 1 as non-nullish', () => expect(isNotNullish(1)).toBeTruthy());

	it('can detect a non empty string as non-nullish', () =>
		expect(isNotNullish('foo')).toBeTruthy());
});
