import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { DEFAULT_JWT_CONFIG, JwtConfiguration } from '../model';
import { DEFAULT_JWT_CONFIGURATION_TOKEN, JWT_CONFIGURATION_TOKEN } from '../token';
import { JwtInjectorInterceptor } from './jwt-injector.interceptor';

describe('TokenInjectorInterceptor', () => {
	const TEST_AUTH_HEADER = 'TestAuthHeader';
	const TEST_AUTH_HEADER_VALUE = 'token';
	const TEST_AUTH_SCHEME_VALUE = 'Prefix ';
	const TEST_REQUEST_DOMAIN = 'test';
	const TEST_REQUEST_PATH = 'path';

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule, HttpClientTestingModule],
			providers: [
				{ provide: DEFAULT_JWT_CONFIGURATION_TOKEN, useValue: DEFAULT_JWT_CONFIG },
				{
					provide: HTTP_INTERCEPTORS,
					multi: true,
					useClass: JwtInjectorInterceptor,
				},
				{
					provide: JWT_CONFIGURATION_TOKEN,
					useValue: {},
				},
			],
		});
	});

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

		const httpClient = TestBed.inject(HttpClient);
		const httpTestingController = TestBed.inject(HttpTestingController);

		httpClient.get<unknown>('test').subscribe();

		const mockResult = httpTestingController.expectOne(
			(request) =>
				request.headers.has(TEST_AUTH_HEADER) &&
				request.headers.get(TEST_AUTH_HEADER) === TEST_AUTH_HEADER_VALUE
		);
		mockResult.flush({ result: 'okay' });
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

		const httpClient = TestBed.inject(HttpClient);
		const httpTestingController = TestBed.inject(HttpTestingController);

		httpClient.get<unknown>('test').subscribe();

		const mockResult = httpTestingController.expectOne(
			(request) =>
				request.headers.has(TEST_AUTH_HEADER) &&
				request.headers.get(TEST_AUTH_HEADER) ===
					TEST_AUTH_SCHEME_VALUE + TEST_AUTH_HEADER_VALUE
		);
		mockResult.flush({ result: 'okay' });
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

		const httpClient = TestBed.inject(HttpClient);
		const httpTestingController = TestBed.inject(HttpTestingController);

		httpClient.get<unknown>(TEST_REQUEST_DOMAIN).subscribe();

		const mockResult = httpTestingController.expectOne(
			(request) =>
				request.url === TEST_REQUEST_DOMAIN && !request.headers.has(TEST_AUTH_HEADER)
		);
		mockResult.flush({ result: 'okay' });
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

		const httpClient = TestBed.inject(HttpClient);
		const httpTestingController = TestBed.inject(HttpTestingController);

		const path = `${TEST_REQUEST_DOMAIN}/${TEST_REQUEST_PATH}`;

		httpClient.get<unknown>(path).subscribe();

		const mockResult = httpTestingController.expectOne(
			(request) => request.url === path && !request.headers.has(TEST_AUTH_HEADER)
		);

		mockResult.flush({ result: 'okay' });
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

		const httpClient = TestBed.inject(HttpClient);
		const httpTestingController = TestBed.inject(HttpTestingController);

		const path = `${TEST_REQUEST_DOMAIN}/${TEST_REQUEST_PATH}`;

		httpClient.get<unknown>(path).subscribe();

		const mockResult = httpTestingController.expectOne(
			(request) => request.url === path && !request.headers.has(TEST_AUTH_HEADER)
		);
		mockResult.flush({ result: 'okay' });
		expect(mockResult).toBeTruthy();
	});

	afterEach(inject([HttpTestingController], (htc: HttpTestingController) => htc.verify()));
});
