import { countInString } from './count-in-string.function';

describe('count', () => {
	it('can count', () => {
		const result = countInString('hello world', 'o');

		expect(result).toEqual(2);
	});
});
