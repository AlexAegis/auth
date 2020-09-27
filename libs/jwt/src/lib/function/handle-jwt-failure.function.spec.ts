import { Router } from '@angular/router';
import { handleJwtFailure } from './handle-jwt-failure.function';

describe('handleJwtFailure', () => {
	const error = {};
	const route = 'target';

	afterEach(() => jest.clearAllMocks());

	it('should call the supplied argument when it is a function with the error', () => {
		const mockCallback = jest.fn<void, [unknown]>();
		handleJwtFailure(mockCallback, error);

		expect(mockCallback).toBeCalledTimes(1);
		expect(mockCallback).lastCalledWith(error);
	});

	it('should throw an error when it tries to navigate without a router', () => {
		expect(() => handleJwtFailure(route, error)).toThrowError();
	});

	it('should call the navigate function on the router passed with the arguments', () => {
		const router = ({
			navigate: jest.fn<void, [string[], { queryParams?: Record<string, unknown> }]>(),
		} as unknown) as Router;

		const redirectParameters = {};

		handleJwtFailure(route, error, router, redirectParameters);

		expect(router.navigate).toBeCalledTimes(1);
		expect(router.navigate).toHaveBeenLastCalledWith([route], {
			queryParams: redirectParameters,
		});
	});
});
