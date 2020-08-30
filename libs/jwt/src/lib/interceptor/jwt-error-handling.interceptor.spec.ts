import { HttpClient, HttpClientModule, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observer } from 'rxjs';
import { JwtCouldntRefreshError, JwtError } from '../errors/jwt-error.class';
import {
	DEFAULT_JWT_CONFIG,
	DEFAULT_JWT_REFRESH_CONFIG,
	JwtConfiguration,
	JwtRefreshConfiguration,
} from '../model';
import {
	DEFAULT_JWT_CONFIGURATION_TOKEN,
	DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN,
	JWT_CONFIGURATION_TOKEN,
	JWT_REFRESH_CONFIGURATION_TOKEN,
} from '../token';
import { JwtErrorHandlingInterceptor } from './jwt-error-handling.interceptor';

describe('JwtErrorHandlingInterceptor', () => {
	const TEST_REQUEST_DOMAIN = 'domain';
	const TEST_REDIRECT = 'redirect';
	const FALSY_STRING = '';

	const normalOnFailureMock = jest.fn();
	const refreshOnFailureMock = jest.fn();

	const routerMock = {
		navigate: jest.fn(),
	};

	const nextMock = jest.fn();
	const errorMock = jest.fn();
	const completeMock = jest.fn();

	const requestObserverMock = {
		next: nextMock,
		error: errorMock,
		complete: completeMock,
	} as Observer<unknown>;

	/**
	 * The reason it's not in a beforeEach is because the config overrides has
	 * to be executed before injecting
	 */
	const injectCommon = () => {
		const httpClient = TestBed.inject(HttpClient);
		const httpTestingController = TestBed.inject(HttpTestingController);
		const interceptors = TestBed.inject(HTTP_INTERCEPTORS);
		const jwtErrorHandlingInterceptor = interceptors.find(
			(i) => i instanceof JwtErrorHandlingInterceptor
		);
		expect(jwtErrorHandlingInterceptor).toBeTruthy();
		if (!jwtErrorHandlingInterceptor) {
			throw new Error('Failed to inject refreshInterceptor');
		}
		const errorHandlingInterceptSpy = jest.spyOn(jwtErrorHandlingInterceptor, 'intercept');

		return { httpClient, httpTestingController, errorHandlingInterceptSpy };
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule, HttpClientTestingModule],
			providers: [
				{ provide: DEFAULT_JWT_CONFIGURATION_TOKEN, useValue: DEFAULT_JWT_CONFIG },
				{
					provide: DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN,
					useValue: DEFAULT_JWT_REFRESH_CONFIG,
				},
				{
					provide: HTTP_INTERCEPTORS,
					multi: true,
					useClass: JwtErrorHandlingInterceptor,
				},
				{
					provide: JWT_CONFIGURATION_TOKEN,
					useValue: {
						onFailure: normalOnFailureMock,
					} as Partial<JwtConfiguration>,
				},
				{
					provide: JWT_REFRESH_CONFIGURATION_TOKEN,
					useValue: {
						onFailure: refreshOnFailureMock,
					} as Partial<JwtRefreshConfiguration<unknown, unknown>>,
				},
				{
					provide: Router,
					useValue: routerMock,
				},
			],
		});
	});

	afterEach(() => jest.clearAllMocks());

	it('should be created', () => {
		const interceptors = TestBed.inject(HTTP_INTERCEPTORS);
		const jwtErrorHandlingInterceptor = interceptors.find(
			(i) => i instanceof JwtErrorHandlingInterceptor
		);
		expect(jwtErrorHandlingInterceptor).toBeTruthy();
	});

	it('should call the normal onFailure when its a function and a normal error happened', () => {
		const { httpClient, httpTestingController, errorHandlingInterceptSpy } = injectCommon();

		httpClient
			.get<unknown>(TEST_REQUEST_DOMAIN, { observe: 'body' })
			.subscribe(requestObserverMock);

		const mockRequest = httpTestingController.expectOne(TEST_REQUEST_DOMAIN);
		mockRequest.error(
			JwtError.createErrorEvent(new HttpRequest('GET', TEST_REQUEST_DOMAIN), '')
		);

		expect(errorHandlingInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(0); // Has the request returned something
		expect(errorMock).toBeCalledTimes(1); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(0); // Has the request returned completed

		expect(normalOnFailureMock).toBeCalledTimes(1);
		expect(refreshOnFailureMock).toBeCalledTimes(0);
		expect(routerMock.navigate).toBeCalledTimes(0);

		httpTestingController.verify();
	});

	it('should redirect to the normal onFailure when its a string and a normal error happened', () => {
		TestBed.overrideProvider(JWT_CONFIGURATION_TOKEN, {
			useValue: {
				onFailure: TEST_REDIRECT,
			} as Partial<JwtConfiguration>,
		});

		const { httpClient, httpTestingController, errorHandlingInterceptSpy } = injectCommon();

		httpClient
			.get<unknown>(TEST_REQUEST_DOMAIN, { observe: 'body' })
			.subscribe(requestObserverMock);

		const mockRequest = httpTestingController.expectOne(TEST_REQUEST_DOMAIN);
		mockRequest.error(
			JwtError.createErrorEvent(new HttpRequest('GET', TEST_REQUEST_DOMAIN), '')
		);

		expect(errorHandlingInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(0); // Has the request returned something
		expect(errorMock).toBeCalledTimes(1); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(0); // Has the request returned completed

		expect(normalOnFailureMock).toBeCalledTimes(0);
		expect(refreshOnFailureMock).toBeCalledTimes(0);
		expect(routerMock.navigate).toBeCalledTimes(1);
		expect(routerMock.navigate).toBeCalledWith([TEST_REDIRECT], { queryParams: undefined });
		httpTestingController.verify();
	});
	/*
	it('should still redirect when targeting an empty string', () => {
		TestBed.overrideProvider(JWT_CONFIGURATION_TOKEN, {
			useValue: {
				onFailure: FALSY_STRING,
			} as Partial<JwtConfiguration>,
		});

		const { httpClient, httpTestingController, errorHandlingInterceptSpy } = injectCommon();

		httpClient
			.get<unknown>(TEST_REQUEST_DOMAIN, { observe: 'body' })
			.subscribe(requestObserverMock);

		const mockRequest = httpTestingController.expectOne(TEST_REQUEST_DOMAIN);
		mockRequest.error(
			JwtError.createErrorEvent(new HttpRequest('GET', TEST_REQUEST_DOMAIN), '')
		);

		expect(errorHandlingInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(0); // Has the request returned something
		expect(errorMock).toBeCalledTimes(1); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(0); // Has the request returned completed

		expect(normalOnFailureMock).toBeCalledTimes(0);
		expect(refreshOnFailureMock).toBeCalledTimes(0);
		expect(routerMock.navigate).toBeCalledTimes(1);
		expect(routerMock.navigate).toBeCalledWith([FALSY_STRING], { queryParams: undefined });
		httpTestingController.verify();
	});*/

	it('should call the refresh onFailure when its a function and a refresh error happened', () => {
		const { httpClient, httpTestingController, errorHandlingInterceptSpy } = injectCommon();

		httpClient
			.get<unknown>(TEST_REQUEST_DOMAIN, { observe: 'body' })
			.subscribe(requestObserverMock);

		const mockRequest = httpTestingController.expectOne(TEST_REQUEST_DOMAIN);
		mockRequest.error(
			JwtCouldntRefreshError.createErrorEvent(new HttpRequest('GET', TEST_REQUEST_DOMAIN), '')
		);

		expect(errorHandlingInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(0); // Has the request returned something
		expect(errorMock).toBeCalledTimes(1); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(0); // Has the request returned completed

		expect(normalOnFailureMock).toBeCalledTimes(0);
		expect(refreshOnFailureMock).toBeCalledTimes(1);
		expect(routerMock.navigate).toBeCalledTimes(0);
		httpTestingController.verify();
	});

	afterEach(inject([HttpTestingController], (htc: HttpTestingController) => htc.verify()));
});
