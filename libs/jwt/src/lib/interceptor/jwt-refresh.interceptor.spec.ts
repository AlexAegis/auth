import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DEFAULT_JWT_CONFIG, JwtConfiguration } from '../model';
import {
	DEFAULT_JWT_CONFIGURATION_TOKEN,
	JWT_CONFIGURATION_TOKEN,
	JWT_REFRESH_CONFIGURATION_TOKEN,
} from '../token';
import { JwtRefreshInterceptor } from './jwt-refresh.interceptor';

describe('JwtRefreshInterceptor', () => {
	const TEST_AUTH_HEADER = 'TestAuthHeader';
	const TEST_AUTH_HEADER_VALUE = 'token';
	// const TEST_AUTH_SCHEME_VALUE = 'Prefix ';
	const TEST_REQUEST_DOMAIN = 'test';
	// const TEST_REQUEST_PATH = 'path';

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule, HttpClientTestingModule],
			providers: [
				{ provide: DEFAULT_JWT_CONFIGURATION_TOKEN, useValue: DEFAULT_JWT_CONFIG },
				{
					provide: HTTP_INTERCEPTORS,
					multi: true,
					useClass: JwtRefreshInterceptor,
				},
				{
					provide: JWT_CONFIGURATION_TOKEN,
					useValue: {},
				},
				{
					provide: JWT_REFRESH_CONFIGURATION_TOKEN,
					useValue: {},
				},
			],
		});
	});

	it('should be created', () => {
		const interceptors = TestBed.inject(HTTP_INTERCEPTORS);
		const jwtRefreshInterceptor = interceptors.find((i) => i instanceof JwtRefreshInterceptor);
		expect(jwtRefreshInterceptor).toBeTruthy();
	});

	it('should have made a request ', () => {
		TestBed.overrideProvider(JWT_CONFIGURATION_TOKEN, {
			useValue: {
				getToken: () => TEST_AUTH_HEADER_VALUE,
				header: TEST_AUTH_HEADER,
				scheme: undefined,
			} as JwtConfiguration,
		});

		const httpClient = TestBed.inject(HttpClient);
		const httpTestingController = TestBed.inject(HttpTestingController);

		httpClient.get<unknown>('test').subscribe((r) => console.log('adfsdfa', r));

		const mockResult = httpTestingController.expectOne('test');
		mockResult.flush({ result: 'okay' });
		expect(mockResult).toBeTruthy();
	});
});
