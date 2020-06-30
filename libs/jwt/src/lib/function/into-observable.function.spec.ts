import { of } from 'rxjs';
import { switchMapTo, tap } from 'rxjs/operators';
import { intoObservable } from './into-observable.function';

describe('intoObservable', () => {
	it('can just return an observable as is', () => {
		const observable = of(null);
		expect(intoObservable(observable)).toBe(observable);
	});

	it('can make an observable from a function that returns what the function would have', () => {
		const fun = () => 1;
		intoObservable(fun)
			.pipe(tap((next) => expect(next).toBe(1)))
			.subscribe();
	});

	it('makes cold observables, a function is re-evaluated on a second subscribe', () => {
		let value = 1;
		const fun = () => value;
		const obs = intoObservable(fun);
		obs.pipe(
			tap((next) => {
				expect(next).toBe(1);
				value = 2;
			}),
			switchMapTo(obs),
			tap((next) => expect(next).toBe(2))
		).subscribe();
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
