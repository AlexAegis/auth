import { isFunction } from './function.predicate';

describe('isFunction', () => {
	it('can recognize a function', () => {
		const functionOrValue: () => unknown | unknown = () => undefined;
		const result = isFunction(functionOrValue);
		expect(result).toBeTruthy();
	});

	it('can recognize a non-function', () => {
		const result = isFunction(undefined);
		expect(result).toBeFalsy();
	});
});
