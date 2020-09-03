import { Observer, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { intoObservable } from './into-observable.function';

describe('intoObservable', () => {
	const mockError = jest.fn();
	const mockComplete = jest.fn();

	const getMockObserver = <T>(mockNext: jest.Mock<void, [T]>): Observer<T> => ({
		next: mockNext,
		error: mockError,
		complete: mockComplete,
	});

	afterEach(() => jest.clearAllMocks());

	it('can just return an object as is', () => {
		const object = {};

		const mockNext = jest.fn<void, [unknown]>((next) => expect(next).toBe(object));

		intoObservable(object).subscribe(getMockObserver(mockNext));

		expect(mockNext).toBeCalledTimes(1);
		expect(mockError).toBeCalledTimes(0);
		expect(mockComplete).toBeCalledTimes(1);
	});

	it('can just return an observable as is', () => {
		const observable = of(null);
		expect(intoObservable(observable)).toBe(observable);
	});

	it('can make an observable from a function that returns what the function would have', () => {
		const result = 1;
		const fun = () => result;

		const mockNext = jest.fn<void, [unknown]>((next) => expect(next).toBe(result));

		intoObservable(fun).subscribe(getMockObserver(mockNext));

		expect(mockNext).toBeCalledTimes(1);
		expect(mockError).toBeCalledTimes(0);
		expect(mockComplete).toBeCalledTimes(1);
	});

	it('can make an observable from a promise and returns what the promise would have', () => {
		const result = 1;
		const promiseFactory = async () => result;

		// Promises are resolved on the next microTask queue after this
		// macrotask ends because of this, I would have to queue up the
		// assertions to the next macroTask cycle with a `setTimeout`.
		// Observables work in this test environment
		// because they are synchronous by default, see the following
		// rejected issue: https://github.com/ReactiveX/rxjs/issues/752
		expect.assertions(1);

		const mockNext = jest.fn<void, [number]>((next) => expect(next).toBe(result));

		intoObservable(promiseFactory()).subscribe(getMockObserver(mockNext));
	});

	it('makes cold observables, a function is re-evaluated on a second subscribe', () => {
		const value = 1;
		const fun = jest.fn(() => value);
		const obs = intoObservable(fun);

		const mockNext = jest.fn<void, [unknown]>((next) => expect(next).toBe(value));

		obs.subscribe(getMockObserver(mockNext));
		obs.subscribe(getMockObserver(mockNext));

		expect(fun).toBeCalledTimes(2);
		expect(mockNext).toBeCalledTimes(2);
		expect(mockError).toBeCalledTimes(0);
		expect(mockComplete).toBeCalledTimes(2);
	});

	it('make an observable out of an async function', () => {
		const fun = async function () {
			return 1;
		};
		intoObservable(fun)
			.pipe(tap((next) => expect(next).toBe(1)))
			.subscribe();
	});

	it('make an observable out of a function that returns an observable', () => {
		const fun = () => {
			return of(1);
		};
		intoObservable(fun)
			.pipe(tap((next) => expect(next).toBe(1)))
			.subscribe();
	});
});
