import { countInString } from './count-in-string.function';

describe('countInString', () => {
	it('can count', () => {
		const result = countInString('hello world', 'o');
		expect(result).toEqual(2);
	});

	it('can count when nothing matches', () => {
		const result = countInString('hello world', 'x');
		expect(result).toEqual(0);
	});
});
