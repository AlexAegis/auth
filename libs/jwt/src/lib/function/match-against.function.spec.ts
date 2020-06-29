import { matchAgainst } from './match-against.function';

describe('matchAgainst', () => {
	const FOO = 'foo';
	const BAR = 'bar';
	const FOO_REGEX = /foo/;
	const BAR_REGEX = /bar/;

	const fooMatcher = matchAgainst(FOO);
	it('can match itself', () => expect(fooMatcher(FOO)).toBeTruthy());
	it('can match against a regex', () => expect(fooMatcher(FOO_REGEX)).toBeTruthy());
	it('cannot match against a different regex', () => expect(fooMatcher(BAR_REGEX)).toBeFalsy());
	it('cannot match against a different string', () => expect(fooMatcher(BAR)).toBeFalsy());
});
