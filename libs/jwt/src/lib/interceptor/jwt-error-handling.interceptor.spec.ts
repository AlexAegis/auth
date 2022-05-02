import {
	HttpClient,
	HttpClientModule,
	HttpErrorResponse,
	HttpParams,
	HttpRequest,
	HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observer } from 'rxjs';
import { JwtCannotRefreshError, JwtCouldntRefreshError, JwtError } from '../errors/jwt-error.class';
import {
	DEFAULT_JWT_CONFIG,
	DEFAULT_JWT_REFRESH_CONFIG,
	JwtConfiguration,
	JwtRefreshConfiguration,
} from '../model/auth-core-configuration.interface';
import {
	DEFAULT_JWT_CONFIGURATION_TOKEN,
	DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN,
	JWT_CONFIGURATION_TOKEN,
	JWT_REFRESH_CONFIGURATION_TOKEN,
} from '../token/jwt-configuration.token';
import { JwtErrorHandlingInterceptor } from './jwt-error-handling.interceptor';

describe('JwtErrorHandlingInterceptor', () => {
	const TEST_REQUEST_DOMAIN = 'domain';
	const TEST_REDIRECT = 'redirect';
	const FALSY_STRING = '';
	const FOO = 'FOO';
	const BAR = 'BAR';
	const TEST_QUERY_PARAMS = new HttpParams().append(FOO, BAR);
	const TEST_REQUEST = new HttpRequest('GET', TEST_REQUEST_DOMAIN);

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

	afterEach(inject([HttpTestingController], (htc: HttpTestingController) => htc.verify()));

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
		mockRequest.error(JwtError.createErrorEvent(TEST_REQUEST, ''));

		expect(errorHandlingInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(0); // Has the request returned something
		expect(errorMock).toBeCalledTimes(1); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(0); // Has the request returned completed

		expect(normalOnFailureMock).toBeCalledTimes(1);
		expect(refreshOnFailureMock).toBeCalledTimes(0);
		expect(routerMock.navigate).toBeCalledTimes(0);
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
		mockRequest.error(JwtError.createErrorEvent(TEST_REQUEST, ''));

		expect(errorHandlingInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(0); // Has the request returned something
		expect(errorMock).toBeCalledTimes(1); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(0); // Has the request returned completed

		expect(normalOnFailureMock).toBeCalledTimes(0);
		expect(refreshOnFailureMock).toBeCalledTimes(0);
		expect(routerMock.navigate).toBeCalledTimes(1);
		expect(routerMock.navigate).toBeCalledWith([TEST_REDIRECT], { queryParams: undefined });
	});

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
		mockRequest.error(JwtError.createErrorEvent(TEST_REQUEST, ''));

		expect(errorHandlingInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(0); // Has the request returned something
		expect(errorMock).toBeCalledTimes(1); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(0); // Has the request returned completed

		expect(normalOnFailureMock).toBeCalledTimes(0);
		expect(refreshOnFailureMock).toBeCalledTimes(0);
		expect(routerMock.navigate).toBeCalledTimes(1);
		expect(routerMock.navigate).toBeCalledWith([FALSY_STRING], { queryParams: undefined });
	});

	it('should call the refresh onFailure when its a function and a refresh error happened', () => {
		const { httpClient, httpTestingController, errorHandlingInterceptSpy } = injectCommon();

		httpClient
			.get<unknown>(TEST_REQUEST_DOMAIN, { observe: 'body' })
			.subscribe(requestObserverMock);

		const mockRequest = httpTestingController.expectOne(TEST_REQUEST_DOMAIN);
		mockRequest.error(JwtCouldntRefreshError.createErrorEvent(TEST_REQUEST, ''));

		expect(errorHandlingInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(0); // Has the request returned something
		expect(errorMock).toBeCalledTimes(1); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(0); // Has the request returned completed

		expect(normalOnFailureMock).toBeCalledTimes(0);
		expect(refreshOnFailureMock).toBeCalledTimes(1);
		expect(routerMock.navigate).toBeCalledTimes(0);
	});

	it('should redirect to the one configured for the refresh, when a refresh\
	error happens, and the redirectparameters called with the correct error', () => {
		TestBed.overrideProvider(JWT_CONFIGURATION_TOKEN, {
			useValue: {
				onFailure: FALSY_STRING,
			} as Partial<JwtConfiguration>,
		});

		const onFailureRedirectParametersMock = jest.fn<HttpParams, [JwtCannotRefreshError]>(
			(error) => {
				expect(error).toBeInstanceOf(JwtCannotRefreshError);
				return TEST_QUERY_PARAMS;
			}
		);

		TestBed.overrideProvider(JWT_REFRESH_CONFIGURATION_TOKEN, {
			useValue: {
				onFailure: TEST_REDIRECT,
				onFailureRedirectParameters: onFailureRedirectParametersMock,
			} as Partial<JwtConfiguration>,
		});

		const { httpClient, httpTestingController, errorHandlingInterceptSpy } = injectCommon();

		httpClient
			.get<unknown>(TEST_REQUEST_DOMAIN, { observe: 'body' })
			.subscribe(requestObserverMock);
		const mockRequest = httpTestingController.expectOne(TEST_REQUEST_DOMAIN);
		mockRequest.error(JwtCannotRefreshError.createErrorEvent(TEST_REQUEST, ''));

		expect(errorHandlingInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(0); // Has the request returned something
		expect(errorMock).toBeCalledTimes(1); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(0); // Has the request returned completed

		expect(normalOnFailureMock).toBeCalledTimes(0);
		expect(refreshOnFailureMock).toBeCalledTimes(0);
		expect(onFailureRedirectParametersMock).toBeCalledTimes(1);
		expect(routerMock.navigate).toBeCalledTimes(1);
		expect(routerMock.navigate).toBeCalledWith([TEST_REDIRECT], {
			queryParams: TEST_QUERY_PARAMS,
		});
	});

	it('should not do anything and forward the error as is if its not jwt related', () => {
		const { httpClient, httpTestingController, errorHandlingInterceptSpy } = injectCommon();

		const specificErrorMock = jest.fn<void, [HttpErrorResponse]>((error) => {
			expect(error).toBeInstanceOf(HttpErrorResponse);
			expect(error.error).toBeInstanceOf(ErrorEvent);
			expect((error.error as ErrorEvent).type).toEqual(FOO);
		});

		httpClient.get<unknown>(TEST_REQUEST_DOMAIN, { observe: 'body' }).subscribe({
			next: nextMock,
			error: specificErrorMock,
			complete: completeMock,
		});
		const errorEvent = new ErrorEvent(FOO);
		const mockRequest = httpTestingController.expectOne(TEST_REQUEST_DOMAIN);
		mockRequest.error(errorEvent);

		expect(errorHandlingInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(0); // Has the request returned something
		expect(specificErrorMock).toBeCalledTimes(1);
		expect(completeMock).toBeCalledTimes(0); // Has the request returned completed

		expect(normalOnFailureMock).toBeCalledTimes(0);
		expect(refreshOnFailureMock).toBeCalledTimes(0);
		expect(routerMock.navigate).toBeCalledTimes(0);
	});

	it('should panic when it has to navigate, but the router is not available', () => {
		TestBed.overrideProvider(JWT_CONFIGURATION_TOKEN, {
			useValue: {
				onFailure: FALSY_STRING,
			} as Partial<JwtConfiguration>,
		});

		TestBed.overrideProvider(Router, {
			useValue: null,
		});

		const specificErrorMock = jest.fn<void, [HttpErrorResponse]>((error) => {
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toContain('Is @angular/router installed');
		});

		const { httpClient, httpTestingController, errorHandlingInterceptSpy } = injectCommon();

		httpClient.get<unknown>(TEST_REQUEST_DOMAIN, { observe: 'body' }).subscribe({
			next: nextMock,
			error: specificErrorMock,
			complete: completeMock,
		});
		const mockRequest = httpTestingController.expectOne(TEST_REQUEST_DOMAIN);
		mockRequest.error(JwtError.createErrorEvent(TEST_REQUEST, ''));

		expect(errorHandlingInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(0); // Has the request returned something
		expect(specificErrorMock).toBeCalledTimes(1); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(0); // Has the request returned completed

		expect(normalOnFailureMock).toBeCalledTimes(0);
		expect(refreshOnFailureMock).toBeCalledTimes(0);
		expect(routerMock.navigate).toBeCalledTimes(0);
	});

	it('should not do anything and forward the error even when the error is not defined', () => {
		const { httpClient, httpTestingController, errorHandlingInterceptSpy } = injectCommon();

		const specificErrorMock = jest.fn<void, [HttpErrorResponse]>((error) => {
			expect(error).toBeInstanceOf(HttpErrorResponse);
			expect(error.error).toBeUndefined();
		});

		httpClient.get<unknown>(TEST_REQUEST_DOMAIN, { observe: 'body' }).subscribe({
			next: nextMock,
			error: specificErrorMock,
			complete: completeMock,
		});

		const mockRequest = httpTestingController.expectOne(TEST_REQUEST_DOMAIN);
		mockRequest.error(undefined as unknown as ErrorEvent);

		expect(errorHandlingInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(0); // Has the request returned something
		expect(specificErrorMock).toBeCalledTimes(1);
		expect(completeMock).toBeCalledTimes(0); // Has the request returned completed

		expect(normalOnFailureMock).toBeCalledTimes(0);
		expect(refreshOnFailureMock).toBeCalledTimes(0);
		expect(routerMock.navigate).toBeCalledTimes(0);
	});

	it('should not do anything when the normal onFailure is not defined and just forward the errors', () => {
		TestBed.overrideProvider(JWT_CONFIGURATION_TOKEN, {
			useValue: {
				onFailure: undefined,
			} as Partial<JwtConfiguration>,
		});

		const { httpClient, httpTestingController, errorHandlingInterceptSpy } = injectCommon();

		const specificErrorMock = jest.fn<void, [HttpErrorResponse]>((error) => {
			expect(error).toBeInstanceOf(HttpErrorResponse);
			expect(error.error).toBeInstanceOf(ErrorEvent);
			expect((error.error as ErrorEvent).error).toBeInstanceOf(JwtError);
		});

		httpClient.get<unknown>(TEST_REQUEST_DOMAIN, { observe: 'body' }).subscribe({
			next: nextMock,
			error: specificErrorMock,
			complete: completeMock,
		});

		const mockRequest = httpTestingController.expectOne(TEST_REQUEST_DOMAIN);
		mockRequest.error(JwtError.createErrorEvent(TEST_REQUEST, ''));

		expect(errorHandlingInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(0); // Has the request returned something
		expect(specificErrorMock).toBeCalledTimes(1); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(0); // Has the request returned completed

		expect(normalOnFailureMock).toBeCalledTimes(0);
		expect(refreshOnFailureMock).toBeCalledTimes(0);
		expect(routerMock.navigate).toBeCalledTimes(0);
	});

	it('should not do anything when the refresh onFailure is not defined and just forward the errors', () => {
		TestBed.overrideProvider(JWT_REFRESH_CONFIGURATION_TOKEN, {
			useValue: {
				onFailure: undefined,
			} as Partial<JwtConfiguration>,
		});

		const { httpClient, httpTestingController, errorHandlingInterceptSpy } = injectCommon();

		const specificErrorMock = jest.fn<void, [HttpErrorResponse]>((error) => {
			expect(error).toBeInstanceOf(HttpErrorResponse);
			expect(error.error).toBeInstanceOf(ErrorEvent);
			expect((error.error as ErrorEvent).error).toBeInstanceOf(JwtCannotRefreshError);
		});

		httpClient.get<unknown>(TEST_REQUEST_DOMAIN, { observe: 'body' }).subscribe({
			next: nextMock,
			error: specificErrorMock,
			complete: completeMock,
		});

		const mockRequest = httpTestingController.expectOne(TEST_REQUEST_DOMAIN);
		mockRequest.error(JwtCannotRefreshError.createErrorEvent(TEST_REQUEST, ''));

		expect(errorHandlingInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(0); // Has the request returned something
		expect(specificErrorMock).toBeCalledTimes(1); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(0); // Has the request returned completed

		expect(normalOnFailureMock).toBeCalledTimes(0);
		expect(refreshOnFailureMock).toBeCalledTimes(0);
		expect(routerMock.navigate).toBeCalledTimes(0);
	});
});
