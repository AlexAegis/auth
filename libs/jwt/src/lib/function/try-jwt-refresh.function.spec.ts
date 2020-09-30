const mockDoJwtRefresh = jest.fn();
const mockCheckAgainstHttpErrorFilter = jest.fn();

jest.mock('./do-jwt-refresh.function', () => ({
	doJwtRefresh: mockDoJwtRefresh,
}));

jest.mock('./check-against-http-error-filter.function', () => ({
	checkAgainstHttpErrorFilter: mockCheckAgainstHttpErrorFilter,
}));

import { HttpErrorResponse, HttpHandler } from '@angular/common/http';
import { Observer, of } from 'rxjs';
import { JwtRefreshConfiguration } from '../model/auth-core-configuration.interface';
import { tryJwtRefresh } from './try-jwt-refresh.function';

describe('tryJwtRefresh', () => {
	const httpHandler = {} as HttpHandler;
	const error = {} as HttpErrorResponse;
	const strError = 'error';
	const body = 'body';
	const refreshResult = {};
	const onError = jest.fn();
	const originalAction = jest.fn();
	const createRefreshRequestBody: jest.Mock<string | undefined | null, []> = jest.fn(() => body);

	const jwtRefreshConfiguration = ({
		createRefreshRequestBody,
	} as unknown) as JwtRefreshConfiguration<unknown, unknown>;

	const mockObserver: Observer<unknown> = {
		next: jest.fn(),
		error: jest.fn(),
		complete: jest.fn(),
	};

	afterEach(() => jest.clearAllMocks());

	it('should just rethrow if the original error is not a string and the error filter does not allow the refresh', () => {
		mockCheckAgainstHttpErrorFilter.mockImplementationOnce(() => false);
		createRefreshRequestBody.mockImplementation(() => body);
		tryJwtRefresh(
			httpHandler,
			error,
			jwtRefreshConfiguration,
			onError,
			originalAction
		).subscribe(mockObserver);

		expect(mockDoJwtRefresh).toHaveBeenCalledTimes(0);
		expect(mockCheckAgainstHttpErrorFilter).toHaveBeenCalledTimes(1);
		expect(mockObserver.next).toHaveBeenCalledTimes(0);
		expect(mockObserver.error).toHaveBeenCalledTimes(1);
		expect(mockObserver.error).toHaveBeenCalledWith(error);
		expect(mockObserver.complete).toHaveBeenCalledTimes(0);
	});

	it('should just rethrow if the original error if the body is nullish', () => {
		mockCheckAgainstHttpErrorFilter.mockImplementationOnce(() => false);
		createRefreshRequestBody.mockImplementation(() => null);
		tryJwtRefresh(
			httpHandler,
			error,
			jwtRefreshConfiguration,
			onError,
			originalAction
		).subscribe(mockObserver);

		expect(mockDoJwtRefresh).toHaveBeenCalledTimes(0);
		expect(mockCheckAgainstHttpErrorFilter).toHaveBeenCalledTimes(1);
		expect(mockObserver.next).toHaveBeenCalledTimes(0);
		expect(mockObserver.error).toHaveBeenCalledTimes(1);
		expect(mockObserver.error).toHaveBeenCalledWith(error);
		expect(mockObserver.complete).toHaveBeenCalledTimes(0);
	});

	it('should call doRefresh if the original error is a string even when the error filter would not allow the refresh', () => {
		mockDoJwtRefresh.mockImplementationOnce(() => of(refreshResult));
		mockCheckAgainstHttpErrorFilter.mockImplementationOnce(() => false);
		createRefreshRequestBody.mockImplementation(() => body);
		tryJwtRefresh(
			httpHandler,
			strError,
			jwtRefreshConfiguration,
			onError,
			originalAction
		).subscribe(mockObserver);

		expect(mockDoJwtRefresh).toHaveBeenCalledTimes(1);
		expect(mockCheckAgainstHttpErrorFilter).toHaveBeenCalledTimes(0);
		expect(mockObserver.next).toHaveBeenCalledTimes(1);
		expect(mockObserver.next).toHaveBeenCalledWith(refreshResult);
		expect(mockObserver.error).toHaveBeenCalledTimes(0);
		expect(mockObserver.complete).toHaveBeenCalledTimes(1);
	});
});
