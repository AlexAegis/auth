const mockHandleJwtFailure = jest.fn();

jest.mock('./handle-jwt-failure.function', () => ({
	handleJwtFailure: mockHandleJwtFailure,
}));

import { HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observer } from 'rxjs';
import { JwtCannotRefreshError, JwtCouldntRefreshError, JwtError } from '../errors/jwt-error.class';
import {
	JwtConfiguration,
	JwtRefreshConfiguration,
} from '../model/auth-core-configuration.interface';
import { handleJwtError } from './handle-jwt-error.function';

describe('handleJwtError', () => {
	const request = new HttpRequest('GET', '');
	const error = {};
	const wrappedJwtError = JwtError.createErrorResponse(request, error);
	const jwtError = wrappedJwtError.error.error;
	const wrappedJwtCannotRefreshError = JwtCannotRefreshError.createErrorResponse(request, error);
	const jwtCannotRefreshError = wrappedJwtCannotRefreshError.error.error;
	const wrappedJwtCouldntRefreshError = JwtCouldntRefreshError.createErrorResponse(
		request,
		error,
	);
	const jwtCouldntRefreshError = wrappedJwtCouldntRefreshError.error.error;
	const router = {} as Router;
	const jwtConfig = {
		onFailure: 'target',
		onFailureRedirectParameters: {},
	} as unknown as JwtConfiguration;
	const jwtRefreshConfig = {
		onFailure: 'refreshTarget',
		onFailureRedirectParameters: {},
	} as unknown as JwtRefreshConfiguration<unknown, unknown>;

	const mockObserver: Observer<unknown> = {
		next: jest.fn(),
		error: jest.fn(),
		complete: jest.fn(),
	};

	afterEach(() => jest.clearAllMocks());

	it('should just rethrow the error in an observable and not call handleJwtFailure if it is not a JwtError', () => {
		const wrappedError = { error: undefined };
		handleJwtError(wrappedError, jwtConfig).subscribe(mockObserver);

		expect(mockHandleJwtFailure).toBeCalledTimes(0);
		expect(mockObserver.next).toBeCalledTimes(0);
		expect(mockObserver.error).toBeCalledTimes(1);
		expect(mockObserver.error).toBeCalledWith(wrappedError);
		expect(mockObserver.complete).toBeCalledTimes(0);
	});

	it('should call handleJwtError with the values from the base jwtConfig using a JwtError and rethrow the unwrapped error', () => {
		handleJwtError(wrappedJwtError, jwtConfig, jwtRefreshConfig, router).subscribe(
			mockObserver,
		);

		expect(mockHandleJwtFailure).toBeCalledTimes(1);
		expect(mockHandleJwtFailure).toBeCalledWith(
			jwtConfig.onFailure,
			jwtError,
			router,
			jwtConfig.onFailureRedirectParameters,
		);
		expect(mockObserver.next).toBeCalledTimes(0);
		expect(mockObserver.error).toBeCalledTimes(1);
		expect(mockObserver.error).toBeCalledWith(jwtError);
		expect(mockObserver.complete).toBeCalledTimes(0);
	});

	it('should call handleJwtError with the values from the jwtRefreshConfig\
	using a JwtCannotRefreshError and rethrow the unwrapped error', () => {
		handleJwtError(wrappedJwtCannotRefreshError, jwtConfig, jwtRefreshConfig, router).subscribe(
			mockObserver,
		);

		expect(mockHandleJwtFailure).toBeCalledTimes(1);
		expect(mockHandleJwtFailure).toBeCalledWith(
			jwtRefreshConfig.onFailure,
			jwtCannotRefreshError,
			router,
			jwtRefreshConfig.onFailureRedirectParameters,
		);
		expect(mockObserver.next).toBeCalledTimes(0);
		expect(mockObserver.error).toBeCalledTimes(1);
		expect(mockObserver.error).toBeCalledWith(jwtCannotRefreshError);
		expect(mockObserver.complete).toBeCalledTimes(0);
	});

	it('should call handleJwtError with the values from the jwtRefreshConfig\
	using a JwtCouldntRefreshError and rethrow the unwrapped error', () => {
		handleJwtError(
			wrappedJwtCouldntRefreshError,
			jwtConfig,
			jwtRefreshConfig,
			router,
		).subscribe(mockObserver);

		expect(mockHandleJwtFailure).toBeCalledTimes(1);
		expect(mockHandleJwtFailure).toBeCalledWith(
			jwtRefreshConfig.onFailure,
			jwtCouldntRefreshError,
			router,
			jwtRefreshConfig.onFailureRedirectParameters,
		);
		expect(mockObserver.next).toBeCalledTimes(0);
		expect(mockObserver.error).toBeCalledTimes(1);
		expect(mockObserver.error).toBeCalledWith(jwtCouldntRefreshError);
		expect(mockObserver.complete).toBeCalledTimes(0);
	});

	it('should not call handleJwtError even when using a JwtCouldntRefreshError when there is no refreshConfig', () => {
		handleJwtError(wrappedJwtCouldntRefreshError, jwtConfig).subscribe(mockObserver);

		expect(mockHandleJwtFailure).toBeCalledTimes(0);
		expect(mockObserver.next).toBeCalledTimes(0);
		expect(mockObserver.error).toBeCalledTimes(1);
		expect(mockObserver.error).toBeCalledWith(jwtCouldntRefreshError);
		expect(mockObserver.complete).toBeCalledTimes(0);
	});
	it('should not call handleJwtError even when using a JwtCouldntRefreshError when there is no onFailure on refreshConfig', () => {
		handleJwtError(
			wrappedJwtCouldntRefreshError,
			jwtConfig,
			{} as JwtRefreshConfiguration<unknown, unknown>,
		).subscribe(mockObserver);

		expect(mockHandleJwtFailure).toBeCalledTimes(0);
		expect(mockObserver.next).toBeCalledTimes(0);
		expect(mockObserver.error).toBeCalledTimes(1);
		expect(mockObserver.error).toBeCalledWith(jwtCouldntRefreshError);
		expect(mockObserver.complete).toBeCalledTimes(0);
	});

	it('should not call handleJwtError even when using a JwtError when there is no onFailure on jwtConfig', () => {
		handleJwtError(wrappedJwtError, {} as JwtConfiguration).subscribe(mockObserver);

		expect(mockHandleJwtFailure).toBeCalledTimes(0);
		expect(mockObserver.next).toBeCalledTimes(0);
		expect(mockObserver.error).toBeCalledTimes(1);
		expect(mockObserver.error).toBeCalledWith(jwtError);
		expect(mockObserver.complete).toBeCalledTimes(0);
	});
});
