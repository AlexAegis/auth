import {
	HttpClient,
	HttpClientModule,
	HttpErrorResponse,
	HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { Observer } from 'rxjs';
import { JwtError } from '../errors/jwt-error.class';
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
import { JwtInjectorInterceptor } from './jwt-injector.interceptor';
import {
	mockJwtTokenCreation,
	TEST_EXPIRED_TOKEN,
	TEST_VALID_TOKEN,
} from './jwt-refresh.interceptor.spec';

describe('JwtInjectorInterceptor', () => {
	const TEST_AUTH_HEADER = 'TestAuthHeader';
	const TEST_AUTH_HEADER_VALUE = TEST_VALID_TOKEN;
	const TEST_AUTH_SCHEME_VALUE = 'Prefix ';
	const TEST_REQUEST_DOMAIN = 'test';
	const TEST_REQUEST_PATH = 'path';

	mockJwtTokenCreation();

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
		const jwtInjectorInterceptor = interceptors.find(
			(i) => i instanceof JwtInjectorInterceptor
		);
		expect(jwtInjectorInterceptor).toBeTruthy();
		if (!jwtInjectorInterceptor) {
			throw new Error('Failed to inject refreshInterceptor');
		}
		const jwtInjectorInterceptSpy = jest.spyOn(jwtInjectorInterceptor, 'intercept');

		return { httpClient, httpTestingController, jwtInjectorInterceptSpy };
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
					useClass: JwtInjectorInterceptor,
				},
				{
					provide: JWT_CONFIGURATION_TOKEN,
					useValue: {},
				},
				{
					provide: JWT_REFRESH_CONFIGURATION_TOKEN,
					useValue: undefined,
				},
			],
		});
	});

	afterEach(() => jest.clearAllMocks());
	afterEach(inject([HttpTestingController], (htc: HttpTestingController) => htc.verify()));

	it('should be created', () => {
		const interceptors = TestBed.inject(HTTP_INTERCEPTORS);
		const jwtInterceptor = interceptors.find((i) => i instanceof JwtInjectorInterceptor);
		expect(jwtInterceptor).toBeTruthy();
	});

	it('should have made a request that has a header injected by the interceptor', () => {
		TestBed.overrideProvider(JWT_CONFIGURATION_TOKEN, {
			useValue: {
				getToken: () => TEST_AUTH_HEADER_VALUE,
				header: TEST_AUTH_HEADER,
				scheme: undefined,
				handleWithCredentials: false,
			} as JwtConfiguration,
		});

		const { httpClient, httpTestingController, jwtInjectorInterceptSpy } = injectCommon();

		httpClient.get<unknown>('test').subscribe(requestObserverMock);

		const mockResult = httpTestingController.expectOne(
			(request) =>
				request.headers.has(TEST_AUTH_HEADER) &&
				request.headers.get(TEST_AUTH_HEADER) === TEST_AUTH_HEADER_VALUE
		);
		mockResult.flush({ result: 'okay' });

		expect(jwtInjectorInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(1); // Has the request returned something
		expect(errorMock).toBeCalledTimes(0); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(1); // Has the request returned completed

		expect(mockResult).toBeTruthy();
	});

	it('should have made a request that has a header injected by the interceptor with a prefix', () => {
		TestBed.overrideProvider(JWT_CONFIGURATION_TOKEN, {
			useValue: {
				getToken: () => TEST_AUTH_HEADER_VALUE,
				header: TEST_AUTH_HEADER,
				scheme: TEST_AUTH_SCHEME_VALUE,
			} as JwtConfiguration,
		});

		const { httpClient, httpTestingController, jwtInjectorInterceptSpy } = injectCommon();

		httpClient.get<unknown>('test').subscribe(requestObserverMock);

		const mockResult = httpTestingController.expectOne(
			(request) =>
				request.headers.has(TEST_AUTH_HEADER) &&
				request.headers.get(TEST_AUTH_HEADER) ===
					TEST_AUTH_SCHEME_VALUE + TEST_AUTH_HEADER_VALUE
		);
		mockResult.flush({ result: 'okay' });

		expect(jwtInjectorInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(1); // Has the request returned something
		expect(errorMock).toBeCalledTimes(0); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(1); // Has the request returned completed

		expect(mockResult).toBeTruthy();
	});

	it('should have made a request that did not have a header injected by the interceptor because its blacklisted', () => {
		TestBed.overrideProvider(JWT_CONFIGURATION_TOKEN, {
			useValue: {
				getToken: () => TEST_AUTH_HEADER_VALUE,
				header: TEST_AUTH_HEADER,
				scheme: TEST_AUTH_SCHEME_VALUE,
				domainBlacklist: [TEST_REQUEST_DOMAIN],
			} as JwtConfiguration,
		});

		const { httpClient, httpTestingController, jwtInjectorInterceptSpy } = injectCommon();

		httpClient.get<unknown>(TEST_REQUEST_DOMAIN).subscribe(requestObserverMock);

		const mockResult = httpTestingController.expectOne(
			(request) =>
				request.url === TEST_REQUEST_DOMAIN && !request.headers.has(TEST_AUTH_HEADER)
		);
		mockResult.flush({ result: 'okay' });

		expect(jwtInjectorInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(1); // Has the request returned something
		expect(errorMock).toBeCalledTimes(0); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(1); // Has the request returned completed

		expect(mockResult).toBeTruthy();
	});

	it('should have made a request that did not have a header injected by the interceptor because its path is blacklisted', () => {
		TestBed.overrideProvider(JWT_CONFIGURATION_TOKEN, {
			useValue: {
				getToken: () => TEST_AUTH_HEADER_VALUE,
				header: TEST_AUTH_HEADER,
				scheme: TEST_AUTH_SCHEME_VALUE,
				pathBlacklist: [TEST_REQUEST_PATH],
			} as JwtConfiguration,
		});

		const { httpClient, httpTestingController, jwtInjectorInterceptSpy } = injectCommon();

		const path = `${TEST_REQUEST_DOMAIN}/${TEST_REQUEST_PATH}`;

		httpClient.get<unknown>(path).subscribe(requestObserverMock);

		const mockResult = httpTestingController.expectOne(
			(request) => request.url === path && !request.headers.has(TEST_AUTH_HEADER)
		);

		mockResult.flush({ result: 'okay' });

		expect(jwtInjectorInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(1); // Has the request returned something
		expect(errorMock).toBeCalledTimes(0); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(1); // Has the request returned completed

		expect(mockResult).toBeTruthy();
	});

	it('should have made a request that did not have a header injected by the interceptor because its path is not whitelisted', () => {
		TestBed.overrideProvider(JWT_CONFIGURATION_TOKEN, {
			useValue: {
				getToken: () => TEST_AUTH_HEADER_VALUE,
				header: TEST_AUTH_HEADER,
				scheme: TEST_AUTH_SCHEME_VALUE,
				pathWhitelist: ['foo'],
			} as JwtConfiguration,
		});

		const { httpClient, httpTestingController, jwtInjectorInterceptSpy } = injectCommon();

		const path = `${TEST_REQUEST_DOMAIN}/${TEST_REQUEST_PATH}`;

		httpClient.get<unknown>(path).subscribe(requestObserverMock);

		const mockResult = httpTestingController.expectOne(
			(request) => request.url === path && !request.headers.has(TEST_AUTH_HEADER)
		);
		mockResult.flush({ result: 'okay' });

		expect(jwtInjectorInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(1); // Has the request returned something
		expect(errorMock).toBeCalledTimes(0); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(1); // Has the request returned completed

		expect(mockResult).toBeTruthy();
	});

	it('should throw a JwtError when there is no RefreshConfiguration and the token is invalid', () => {
		TestBed.overrideProvider(JWT_CONFIGURATION_TOKEN, {
			useValue: {
				getToken: () => TEST_EXPIRED_TOKEN,
				header: TEST_AUTH_HEADER,
				scheme: TEST_AUTH_SCHEME_VALUE,
			} as JwtConfiguration,
		});

		const { httpClient, httpTestingController, jwtInjectorInterceptSpy } = injectCommon();

		const path = `${TEST_REQUEST_DOMAIN}/${TEST_REQUEST_PATH}`;

		const specificErrorMock = jest.fn<void, [HttpErrorResponse]>((error) => {
			expect(error).toBeInstanceOf(HttpErrorResponse);
			expect(error.error).toBeInstanceOf(ErrorEvent);
			expect((error.error as ErrorEvent).error).toBeInstanceOf(JwtError);
		});

		httpClient.get<unknown>(path).subscribe({
			next: nextMock,
			error: specificErrorMock,
			complete: completeMock,
		});

		httpTestingController.expectNone(
			(request) => request.url === path && !request.headers.has(TEST_AUTH_HEADER)
		);

		expect(jwtInjectorInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(0); // Has the request returned something
		expect(specificErrorMock).toBeCalledTimes(1); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(0); // Has the request returned completed
	});

	it('should not throw a JwtError when there is RefreshConfiguration and the token is invalid', () => {
		TestBed.overrideProvider(JWT_CONFIGURATION_TOKEN, {
			useValue: {
				getToken: () => TEST_EXPIRED_TOKEN,
				header: TEST_AUTH_HEADER,
			} as JwtConfiguration,
		});

		TestBed.overrideProvider(JWT_REFRESH_CONFIGURATION_TOKEN, {
			useValue: {} as JwtRefreshConfiguration<unknown, unknown>,
		});

		const { httpClient, httpTestingController, jwtInjectorInterceptSpy } = injectCommon();

		const path = `${TEST_REQUEST_DOMAIN}/${TEST_REQUEST_PATH}`;

		httpClient.get<unknown>(path).subscribe(requestObserverMock);

		const mockRequest = httpTestingController.expectOne(path);

		mockRequest.flush({ response: 'okay' });

		expect(jwtInjectorInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(1); // Has the request returned something
		expect(errorMock).toBeCalledTimes(0); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(1); // Has the request returned completed

		expect(mockRequest).toBeTruthy();
	});
});
