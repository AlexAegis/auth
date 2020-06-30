import { callWhenFunction } from './call-when-function.function';

describe('callWhenFunction', () => {
	const RESULT = 'result';
	it('calls the function that is supplied', () => {
		const fun = jest.fn(() => RESULT);
		const result = callWhenFunction(fun);
		expect(fun).toBeCalled();
		expect(result).toEqual(RESULT);
	});

	it('returns the argument if it is not a function', () => {
		const result = callWhenFunction(RESULT);
		expect(result).toEqual(RESULT);
	});
});
