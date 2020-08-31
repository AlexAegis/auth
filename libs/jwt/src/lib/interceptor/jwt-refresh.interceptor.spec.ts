import {
	HttpClient,
	HttpClientModule,
	HttpErrorResponse,
	HttpHeaders,
	HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { Observer } from 'rxjs';
import { JwtCannotRefreshError, JwtCouldntRefreshError } from '../errors';
import {
	DEFAULT_JWT_CONFIG,
	DEFAULT_JWT_REFRESH_CONFIG,
	JwtConfiguration,
	JwtRefreshConfiguration,
	JwtToken,
} from '../model';
import {
	DEFAULT_JWT_CONFIGURATION_TOKEN,
	DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN,
	JWT_CONFIGURATION_TOKEN,
	JWT_REFRESH_CONFIGURATION_TOKEN,
} from '../token';
import { JwtRefreshInterceptor } from './jwt-refresh.interceptor';

export const TEST_VALID_TOKEN = 'token';
export const TEST_EXPIRED_TOKEN = 'expiredToken';
export const TEST_INVALID_TOKEN = 'invalidToken';
export const TEST_MALFORMED_TOKEN = 'malformedToken';

export const mockJwtTokenCreation = (): void => {
	const getCurrentUnixTimestamp = () => new Date().getTime() / 1000;
	const getValidUnixTimestamp = () => getCurrentUnixTimestamp() + 10000;
	const getInvalidUnixTimestamp = () => getCurrentUnixTimestamp() - 10000;

	jest.spyOn(JwtToken, 'from').mockImplementation((token) => {
		switch (token) {
			case TEST_VALID_TOKEN:
				return new JwtToken(
					{ alg: '', typ: '' },
					{ exp: getValidUnixTimestamp(), iat: getCurrentUnixTimestamp() },
					''
				);
			case TEST_EXPIRED_TOKEN:
				return new JwtToken(
					{ alg: '', typ: '' },
					{ exp: getInvalidUnixTimestamp(), iat: getCurrentUnixTimestamp() },
					''
				);
			case TEST_INVALID_TOKEN:
				return new JwtToken(
					{ alg: '', typ: '' },
					{ exp: getValidUnixTimestamp(), iat: getCurrentUnixTimestamp() },
					'invalid'
				);
			case TEST_MALFORMED_TOKEN:
			default:
				return null;
		}
	});
};
interface TestRefreshRequest {
	refreshToken: string;
}

interface TestRefreshResponse {
	accessToken: string;
}
describe('JwtRefreshInterceptor', () => {
	const TEST_REFRESH_URL = 'refresh';
	const TEST_AUTH_HEADER = 'TestAuthHeader';

	const TEST_REQUEST_DOMAIN = 'test';

	const validHeaders = new HttpHeaders().append(TEST_AUTH_HEADER, TEST_VALID_TOKEN);
	const expiredHeaders = new HttpHeaders().append(TEST_AUTH_HEADER, TEST_EXPIRED_TOKEN);
	const invalidHeaders = new HttpHeaders().append(TEST_AUTH_HEADER, TEST_INVALID_TOKEN);

	const malformedHeaders = new HttpHeaders().append(TEST_AUTH_HEADER, TEST_MALFORMED_TOKEN);

	mockJwtTokenCreation();

	const setRefreshedTokensMock = jest.fn();

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
		const jwtRefreshInterceptor = interceptors.find((i) => i instanceof JwtRefreshInterceptor);
		expect(jwtRefreshInterceptor).toBeTruthy();
		if (!jwtRefreshInterceptor) {
			throw new Error('Failed to inject refreshInterceptor');
		}
		const refreshInterceptSpy = jest.spyOn(jwtRefreshInterceptor, 'intercept');

		return { httpClient, httpTestingController, refreshInterceptSpy };
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
					useClass: JwtRefreshInterceptor,
				},
				{
					provide: JWT_CONFIGURATION_TOKEN,
					useValue: {
						getToken: () => TEST_EXPIRED_TOKEN,
						header: TEST_AUTH_HEADER,
						scheme: '',
					} as JwtConfiguration,
				},
				{
					provide: JWT_REFRESH_CONFIGURATION_TOKEN,
					useValue: {},
				},
			],
		});
	});

	afterEach(() => jest.clearAllMocks());
	afterEach(inject([HttpTestingController], (htc: HttpTestingController) => htc.verify()));

	it('should be created', () => {
		const interceptors = TestBed.inject(HTTP_INTERCEPTORS);
		const jwtRefreshInterceptor = interceptors.find((i) => i instanceof JwtRefreshInterceptor);
		expect(jwtRefreshInterceptor).toBeTruthy();
	});

	it('should not refresh with a valid token', () => {
		TestBed.overrideProvider(JWT_REFRESH_CONFIGURATION_TOKEN, {
			useValue: {
				createRefreshRequestBody: () => {
					return {
						refreshToken: 'refTok',
					};
				},
				refreshUrl: TEST_REFRESH_URL,
				setRefreshedTokens: setRefreshedTokensMock,
				transformRefreshResponse: (response) => {
					return response;
				},
			} as JwtRefreshConfiguration<TestRefreshRequest, TestRefreshResponse>,
		});

		const { httpClient, httpTestingController, refreshInterceptSpy } = injectCommon();

		httpClient
			.get<unknown>(TEST_REQUEST_DOMAIN, { observe: 'body', headers: validHeaders })
			.subscribe(requestObserverMock);

		const mockRequest = httpTestingController.expectOne(TEST_REQUEST_DOMAIN);

		mockRequest.flush({ result: 'okay' });
		expect(refreshInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(1); // Has the request returned something
		expect(errorMock).toBeCalledTimes(0); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(1); // Has the request returned completed
		expect(setRefreshedTokensMock).toBeCalledTimes(0); // Has actual refresh happened

		httpTestingController.verify();
	});

	it('should refresh with an expired token, without first trying', () => {
		TestBed.overrideProvider(JWT_REFRESH_CONFIGURATION_TOKEN, {
			useValue: {
				createRefreshRequestBody: () => {
					return {
						refreshToken: 'token',
					};
				},
				refreshUrl: TEST_REFRESH_URL,
				setRefreshedTokens: setRefreshedTokensMock,
				transformRefreshResponse: (response) => {
					return response;
				},
			} as JwtRefreshConfiguration<TestRefreshRequest, TestRefreshResponse>,
		});

		const { httpClient, httpTestingController, refreshInterceptSpy } = injectCommon();

		httpClient
			.get<unknown>(TEST_REQUEST_DOMAIN, { observe: 'body', headers: expiredHeaders })
			.subscribe(requestObserverMock);

		const mockRefreshRequest = httpTestingController.expectOne(TEST_REFRESH_URL);
		mockRefreshRequest.flush({ accessToken: 'token' } as TestRefreshResponse, {});
		const mockRequest = httpTestingController.expectOne(TEST_REQUEST_DOMAIN);
		mockRequest.flush({ result: 'okay' });

		expect(refreshInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(1); // Has the request returned something
		expect(errorMock).toBeCalledTimes(0); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(1); // Has the request returned completed
		expect(setRefreshedTokensMock).toBeCalledTimes(1); // Has actual refresh happened

		httpTestingController.verify();
	});

	it('should refresh with a non-expired but invalid token, with first trying', () => {
		TestBed.overrideProvider(JWT_REFRESH_CONFIGURATION_TOKEN, {
			useValue: {
				createRefreshRequestBody: () => {
					return {
						refreshToken: 'token',
					};
				},
				refreshUrl: TEST_REFRESH_URL,
				setRefreshedTokens: setRefreshedTokensMock,
				errorCodeWhitelist: undefined,
				transformRefreshResponse: (response) => {
					return response;
				},
			} as JwtRefreshConfiguration<TestRefreshRequest, TestRefreshResponse>,
		});

		const { httpClient, httpTestingController, refreshInterceptSpy } = injectCommon();

		httpClient
			.get<unknown>(TEST_REQUEST_DOMAIN, { observe: 'body', headers: invalidHeaders })
			.subscribe(requestObserverMock);

		const mockErrorRequest = httpTestingController.expectOne(TEST_REQUEST_DOMAIN);
		mockErrorRequest.error(new ErrorEvent('Invalid token'));
		const mockRefreshRequest = httpTestingController.expectOne(TEST_REFRESH_URL);
		mockRefreshRequest.flush({ accessToken: 'token' } as TestRefreshResponse, {});
		const mockRequest = httpTestingController.expectOne(TEST_REQUEST_DOMAIN);
		mockRequest.flush({ result: 'okay' });

		expect(refreshInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(1); // Has the request returned something
		expect(errorMock).toBeCalledTimes(0); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(1); // Has the request returned completed
		expect(setRefreshedTokensMock).toBeCalledTimes(1); // Has actual refresh happened

		httpTestingController.verify();
	});

	it('should try to refresh with an invalid token, and fail, throwing a JwtCouldntRefreshError', () => {
		TestBed.overrideProvider(JWT_REFRESH_CONFIGURATION_TOKEN, {
			useValue: {
				getRefreshToken: () => TEST_INVALID_TOKEN,
				createRefreshRequestBody: () => {
					return {
						refreshToken: TEST_INVALID_TOKEN,
					};
				},
				refreshUrl: TEST_REFRESH_URL,
				setRefreshedTokens: setRefreshedTokensMock,
				errorCodeWhitelist: undefined,
				transformRefreshResponse: (response) => {
					return response;
				},
			} as JwtRefreshConfiguration<TestRefreshRequest, TestRefreshResponse>,
		});

		const { httpClient, httpTestingController, refreshInterceptSpy } = injectCommon();

		const instanceCheckingErrorMock = jest.fn<void, [HttpErrorResponse]>((error) => {
			expect(error).toBeInstanceOf(JwtCouldntRefreshError);
		});

		httpClient
			.get<unknown>(TEST_REQUEST_DOMAIN, { observe: 'body', headers: invalidHeaders })
			.subscribe({
				next: nextMock,
				error: instanceCheckingErrorMock,
				complete: completeMock,
			});

		const mockErrorRequest = httpTestingController.expectOne(TEST_REQUEST_DOMAIN);
		mockErrorRequest.error(new ErrorEvent('Invalid token'));
		const mockRefreshRequest = httpTestingController.expectOne(TEST_REFRESH_URL);
		mockRefreshRequest.error(new ErrorEvent('Invalid refresh token'));

		expect(refreshInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(0); // Has the request returned something
		expect(instanceCheckingErrorMock).toBeCalledTimes(1); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(0); // Has the request returned completed
		expect(setRefreshedTokensMock).toBeCalledTimes(0); // Has actual refresh happened

		httpTestingController.verify();
	});

	it('should not try to refresh with an expired refresh token, and fail, throwing a JwtCannotRefreshError', () => {
		TestBed.overrideProvider(JWT_REFRESH_CONFIGURATION_TOKEN, {
			useValue: {
				getRefreshToken: () => TEST_EXPIRED_TOKEN,
				createRefreshRequestBody: () => {
					return {
						refreshToken: TEST_EXPIRED_TOKEN,
					};
				},
				refreshUrl: TEST_REFRESH_URL,
				setRefreshedTokens: setRefreshedTokensMock,
				errorCodeWhitelist: undefined,
				transformRefreshResponse: (response) => {
					return response;
				},
			} as JwtRefreshConfiguration<TestRefreshRequest, TestRefreshResponse>,
		});

		const { httpClient, httpTestingController, refreshInterceptSpy } = injectCommon();

		const instanceCheckingErrorMock = jest.fn<void, [HttpErrorResponse]>((error) => {
			expect(error).toBeInstanceOf(JwtCannotRefreshError);
		});

		httpClient
			.get<unknown>(TEST_REQUEST_DOMAIN, { observe: 'body', headers: expiredHeaders })
			.subscribe({
				next: nextMock,
				error: instanceCheckingErrorMock,
				complete: completeMock,
			});

		httpTestingController.expectNone(TEST_REQUEST_DOMAIN);
		httpTestingController.expectNone(TEST_REFRESH_URL);

		expect(refreshInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(0); // Has the request returned something
		expect(instanceCheckingErrorMock).toBeCalledTimes(1); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(0); // Has the request returned completed
		expect(setRefreshedTokensMock).toBeCalledTimes(0); // Has actual refresh happened

		httpTestingController.verify();
	});

	it('should not try to refresh if the token was valid but the request failed, and fail', () => {
		TestBed.overrideProvider(JWT_REFRESH_CONFIGURATION_TOKEN, {
			useValue: {
				createRefreshRequestBody: () => {
					return {
						refreshToken: 'token',
					};
				},
				refreshUrl: TEST_REFRESH_URL,
				setRefreshedTokens: setRefreshedTokensMock,
				errorCodeWhitelist: [401],
				transformRefreshResponse: (response) => {
					return response;
				},
			} as JwtRefreshConfiguration<TestRefreshRequest, TestRefreshResponse>,
		});

		const { httpClient, httpTestingController, refreshInterceptSpy } = injectCommon();

		httpClient
			.get<unknown>(TEST_REQUEST_DOMAIN, { observe: 'body', headers: invalidHeaders })
			.subscribe(requestObserverMock);

		const mockErrorRequest = httpTestingController.expectOne(TEST_REQUEST_DOMAIN);
		mockErrorRequest.error(new ErrorEvent('Invalid token'), { status: 403 });
		httpTestingController.expectNone(TEST_REFRESH_URL);

		expect(refreshInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(0); // Has the request returned something
		expect(errorMock).toBeCalledTimes(1); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(0); // Has the request returned completed
		expect(setRefreshedTokensMock).toBeCalledTimes(0); // Has actual refresh happened

		httpTestingController.verify();
	});

	it('should try a refresh on a custom error code if its whitelisted', () => {
		TestBed.overrideProvider(JWT_REFRESH_CONFIGURATION_TOKEN, {
			useValue: {
				createRefreshRequestBody: () => {
					return {
						refreshToken: 'token',
					};
				},
				refreshUrl: TEST_REFRESH_URL,
				setRefreshedTokens: setRefreshedTokensMock,
				errorCodeWhitelist: [500],
				transformRefreshResponse: (response) => {
					return response;
				},
			} as JwtRefreshConfiguration<TestRefreshRequest, TestRefreshResponse>,
		});

		const { httpClient, httpTestingController, refreshInterceptSpy } = injectCommon();

		httpClient
			.get<unknown>(TEST_REQUEST_DOMAIN, { observe: 'body', headers: invalidHeaders })
			.subscribe(requestObserverMock);

		const mockErrorRequest = httpTestingController.expectOne(TEST_REQUEST_DOMAIN);
		mockErrorRequest.error(new ErrorEvent('Invalid token'), { status: 500 });
		const mockRefreshRequest = httpTestingController.expectOne(TEST_REFRESH_URL);
		mockRefreshRequest.flush({ accessToken: 'token' } as TestRefreshResponse);
		const mockRequest = httpTestingController.expectOne(TEST_REQUEST_DOMAIN);
		mockRequest.flush({ result: 'okay' });

		expect(refreshInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(1); // Has the request returned something
		expect(errorMock).toBeCalledTimes(0); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(1); // Has the request returned completed
		expect(setRefreshedTokensMock).toBeCalledTimes(1); // Has actual refresh happened

		httpTestingController.verify();
	});

	it('should not try to refresh if the endpoint is not allowed to be refreshed on even with an expired token', () => {
		TestBed.overrideProvider(JWT_REFRESH_CONFIGURATION_TOKEN, {
			useValue: {
				createRefreshRequestBody: () => {
					return {
						refreshToken: 'token',
					};
				},
				refreshUrl: TEST_REFRESH_URL,
				domainBlacklist: [TEST_REQUEST_DOMAIN],
				setRefreshedTokens: setRefreshedTokensMock,
				errorCodeWhitelist: [401],
				transformRefreshResponse: (response) => {
					return response;
				},
			} as JwtRefreshConfiguration<TestRefreshRequest, TestRefreshResponse>,
		});

		const { httpClient, httpTestingController, refreshInterceptSpy } = injectCommon();

		httpClient
			.get<unknown>(TEST_REQUEST_DOMAIN, { observe: 'body', headers: invalidHeaders })
			.subscribe(requestObserverMock);

		const mockErrorRequest = httpTestingController.expectOne(TEST_REQUEST_DOMAIN);
		mockErrorRequest.error(new ErrorEvent('Invalid token'), { status: 403 });
		httpTestingController.expectNone(TEST_REFRESH_URL);

		expect(refreshInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(0); // Has the request returned something
		expect(errorMock).toBeCalledTimes(1); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(0); // Has the request returned completed
		expect(setRefreshedTokensMock).toBeCalledTimes(0); // Has actual refresh happened

		httpTestingController.verify();
	});

	it('should just fail if it fails again after a successful refresh', () => {
		TestBed.overrideProvider(JWT_REFRESH_CONFIGURATION_TOKEN, {
			useValue: {
				createRefreshRequestBody: () => {
					return {
						refreshToken: 'token',
					};
				},
				refreshUrl: TEST_REFRESH_URL,
				setRefreshedTokens: setRefreshedTokensMock,
				errorCodeWhitelist: undefined,
				transformRefreshResponse: (response) => {
					return response;
				},
			} as JwtRefreshConfiguration<TestRefreshRequest, TestRefreshResponse>,
		});

		const { httpClient, httpTestingController, refreshInterceptSpy } = injectCommon();

		httpClient
			.get<unknown>(TEST_REQUEST_DOMAIN, { observe: 'body', headers: validHeaders })
			.subscribe(requestObserverMock);

		const mockErrorRequest = httpTestingController.expectOne(TEST_REQUEST_DOMAIN);
		mockErrorRequest.error(new ErrorEvent('Invalid token'));
		const mockRefreshRequest = httpTestingController.expectOne(TEST_REFRESH_URL);
		mockRefreshRequest.flush({ accessToken: 'token' } as TestRefreshResponse);
		const mockRequest = httpTestingController.expectOne(TEST_REQUEST_DOMAIN);
		mockRequest.error(new ErrorEvent('Invalid request'));

		expect(refreshInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(0); // Has the request returned something
		expect(errorMock).toBeCalledTimes(1); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(0); // Has the request returned completed
		expect(setRefreshedTokensMock).toBeCalledTimes(1); // Has actual refresh happened

		httpTestingController.verify();
	});

	it('should just fail if a token was not present at all at the beginning', () => {
		TestBed.overrideProvider(JWT_REFRESH_CONFIGURATION_TOKEN, {
			useValue: {
				createRefreshRequestBody: () => {
					return {
						refreshToken: 'token',
					};
				},
				refreshUrl: TEST_REFRESH_URL,
				setRefreshedTokens: setRefreshedTokensMock,
				errorCodeWhitelist: undefined,
				transformRefreshResponse: (response) => {
					return response;
				},
			} as JwtRefreshConfiguration<TestRefreshRequest, TestRefreshResponse>,
		});

		const { httpClient, httpTestingController, refreshInterceptSpy } = injectCommon();

		httpClient
			.get<unknown>(TEST_REQUEST_DOMAIN, { observe: 'body' })
			.subscribe(requestObserverMock);

		const mockErrorRequest = httpTestingController.expectOne(TEST_REQUEST_DOMAIN);
		mockErrorRequest.error(new ErrorEvent('Invalid token'));
		httpTestingController.expectNone(TEST_REFRESH_URL);

		expect(refreshInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(0); // Has the request returned something
		expect(errorMock).toBeCalledTimes(1); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(0); // Has the request returned completed
		expect(setRefreshedTokensMock).toBeCalledTimes(0); // Has actual refresh happened

		httpTestingController.verify();
	});

	it('should refresh correctly even with empty defaults', () => {
		TestBed.overrideProvider(DEFAULT_JWT_CONFIGURATION_TOKEN, {
			useValue: {},
		});

		TestBed.overrideProvider(DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN, {
			useValue: {},
		});

		TestBed.overrideProvider(JWT_CONFIGURATION_TOKEN, {
			useValue: {
				header: TEST_AUTH_HEADER,
			} as Partial<JwtConfiguration>,
		});

		TestBed.overrideProvider(JWT_REFRESH_CONFIGURATION_TOKEN, {
			useValue: {
				createRefreshRequestBody: () => {
					return {
						refreshToken: 'token',
					};
				},
				refreshUrl: TEST_REFRESH_URL,
				setRefreshedTokens: setRefreshedTokensMock,
				transformRefreshResponse: (response) => {
					return response;
				},
			} as JwtRefreshConfiguration<TestRefreshRequest, TestRefreshResponse>,
		});

		const { httpClient, httpTestingController, refreshInterceptSpy } = injectCommon();

		httpClient
			.get<unknown>(TEST_REQUEST_DOMAIN, { observe: 'body', headers: expiredHeaders })
			.subscribe(requestObserverMock);

		const mockRefreshRequest = httpTestingController.expectOne(TEST_REFRESH_URL);
		mockRefreshRequest.flush({ accessToken: 'token' } as TestRefreshResponse, {});
		const mockRequest = httpTestingController.expectOne(TEST_REQUEST_DOMAIN);
		mockRequest.flush({ result: 'okay' });

		expect(refreshInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(1); // Has the request returned something
		expect(errorMock).toBeCalledTimes(0); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(1); // Has the request returned completed
		expect(setRefreshedTokensMock).toBeCalledTimes(1); // Has actual refresh happened

		httpTestingController.verify();
	});

	it('should also try to refresh if the token was malformed', () => {
		TestBed.overrideProvider(JWT_REFRESH_CONFIGURATION_TOKEN, {
			useValue: {
				createRefreshRequestBody: () => {
					return {
						refreshToken: 'token',
					};
				},
				refreshUrl: TEST_REFRESH_URL,
				setRefreshedTokens: setRefreshedTokensMock,
				errorCodeWhitelist: undefined,
				transformRefreshResponse: (response) => {
					return response;
				},
			} as JwtRefreshConfiguration<TestRefreshRequest, TestRefreshResponse>,
		});

		const { httpClient, httpTestingController, refreshInterceptSpy } = injectCommon();

		httpClient
			.get<unknown>(TEST_REQUEST_DOMAIN, { observe: 'body', headers: malformedHeaders })
			.subscribe(requestObserverMock);

		const mockRefreshRequest = httpTestingController.expectOne(TEST_REFRESH_URL);
		mockRefreshRequest.flush({ accessToken: 'token' } as TestRefreshResponse, {});
		const mockRequest = httpTestingController.expectOne(TEST_REQUEST_DOMAIN);
		mockRequest.flush({ result: 'okay' });

		expect(refreshInterceptSpy).toBeCalledTimes(1); // Have the interceptor activated
		expect(nextMock).toBeCalledTimes(1); // Has the request returned something
		expect(errorMock).toBeCalledTimes(0); // Has the request returned errored
		expect(completeMock).toBeCalledTimes(1); // Has the request returned completed
		expect(setRefreshedTokensMock).toBeCalledTimes(1); // Has actual refresh happened

		httpTestingController.verify();
	});
});
