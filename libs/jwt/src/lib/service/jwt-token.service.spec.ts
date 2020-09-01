import { TestBed } from '@angular/core/testing';
import { of, zip } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import {
	mockJwtTokenCreation,
	TEST_EXPIRED_TOKEN,
	TEST_MALFORMED_TOKEN,
	TEST_VALID_TOKEN,
} from '../interceptor/jwt-refresh.interceptor.spec';
import { JwtModule } from '../jwt.module';
import {
	DEFAULT_JWT_CONFIG,
	DEFAULT_JWT_REFRESH_CONFIG,
} from '../model/auth-core-configuration.interface';
import {
	DEFAULT_JWT_CONFIGURATION_TOKEN,
	DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN,
	JwtConfigurationProvider,
	JwtRefreshConfigurationProvider,
	JWT_CONFIGURATION_TOKEN,
	JWT_REFRESH_CONFIGURATION_TOKEN,
} from '../token/jwt-configuration.token';
import { JwtTokenService } from './jwt-token.service';

describe('JwtTokenService', () => {
	mockJwtTokenCreation();
	let service: JwtTokenService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [JwtModule],
			providers: [
				{
					provide: DEFAULT_JWT_CONFIGURATION_TOKEN,
					useValue: DEFAULT_JWT_CONFIG,
				},
				{
					provide: DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN,
					useValue: DEFAULT_JWT_REFRESH_CONFIG,
				},
				{
					provide: JWT_CONFIGURATION_TOKEN,
					useValue: {
						getToken: () => TEST_VALID_TOKEN,
					},
				} as JwtConfigurationProvider,
				{
					provide: JWT_REFRESH_CONFIGURATION_TOKEN,
					useValue: {
						getRefreshToken: () => TEST_VALID_TOKEN,
					},
				} as JwtRefreshConfigurationProvider<unknown, unknown>,
			],
		});
	});

	afterEach(() => jest.clearAllMocks());

	it('should be created', () => {
		service = TestBed.get(JwtTokenService);
		expect(service).toBeTruthy();
	});

	it('should yield nulls from all pipes when the tokens are nulls, and evaluate on every subscribe', () => {
		const mockGetToken = jest.fn().mockReturnValue(null);
		const mockGetRefreshToken = jest.fn().mockReturnValue(null);

		TestBed.overrideProvider(JWT_CONFIGURATION_TOKEN, {
			useValue: {
				getToken: mockGetToken as () => string,
			},
		} as JwtConfigurationProvider);

		TestBed.overrideProvider(JWT_REFRESH_CONFIGURATION_TOKEN, {
			useValue: {
				getRefreshToken: mockGetRefreshToken as () => string,
			},
		} as JwtRefreshConfigurationProvider<unknown, unknown>);

		TestBed.overrideProvider(DEFAULT_JWT_CONFIGURATION_TOKEN, {
			useValue: {},
		} as JwtConfigurationProvider);

		service = TestBed.get(JwtTokenService);
		const accessTokenObservables = [
			service.rawAccessToken$.pipe(tap((n) => expect(n).toBeNull())),
			service.accessToken$.pipe(tap((n) => expect(n).toBeNull())),
			service.accessTokenHeader$.pipe(tap((n) => expect(n).toBeNull())),
			service.accessTokenPayload$.pipe(tap((n) => expect(n).toBeNull())),
			service.isAccessTokenExpired$.pipe(tap((n) => expect(n).toBe(true))),
		];

		const refreshTokenObservables = [
			service.rawRefreshToken$.pipe(tap((n) => expect(n).toBeNull())),
			service.refreshToken$.pipe(tap((n) => expect(n).toBeNull())),
			service.refreshTokenHeader$.pipe(tap((n) => expect(n).toBeNull())),
			service.refreshTokenPayload$.pipe(tap((n) => expect(n).toBeNull())),
			service.isRefreshTokenExpired$.pipe(tap((n) => expect(n).toBe(true))),
		];

		return zip(...accessTokenObservables, ...refreshTokenObservables)
			.pipe(
				take(1),
				tap(() => expect(mockGetToken).toBeCalledTimes(accessTokenObservables.length)),
				tap(() =>
					expect(mockGetRefreshToken).toBeCalledTimes(refreshTokenObservables.length)
				)
			)
			.toPromise();
	});

	it('should yield valid results from all pipes when the tokens are valid, and evaluate on every subscribe', () => {
		const mockGetToken = jest.fn().mockReturnValue(TEST_VALID_TOKEN);
		const mockGetRefreshToken = jest.fn().mockReturnValue(TEST_VALID_TOKEN);

		TestBed.overrideProvider(JWT_CONFIGURATION_TOKEN, {
			useValue: {
				getToken: mockGetToken as () => string,
			},
		} as JwtConfigurationProvider);

		TestBed.overrideProvider(JWT_REFRESH_CONFIGURATION_TOKEN, {
			useValue: {
				getRefreshToken: mockGetRefreshToken as () => string,
			},
		} as JwtRefreshConfigurationProvider<unknown, unknown>);

		TestBed.overrideProvider(DEFAULT_JWT_CONFIGURATION_TOKEN, {
			useValue: {},
		} as JwtConfigurationProvider);

		service = TestBed.get(JwtTokenService);
		const accessTokenObservables = [
			service.rawAccessToken$.pipe(tap((n) => expect(n).toBe(TEST_VALID_TOKEN))),
			service.accessToken$.pipe(tap((n) => expect(n).toBeTruthy())),
			service.accessTokenHeader$.pipe(tap((n) => expect(n).toBeTruthy())),
			service.accessTokenPayload$.pipe(tap((n) => expect(n).toBeTruthy())),
			service.isAccessTokenExpired$.pipe(tap((n) => expect(n).toBe(false))),
		];

		const refreshTokenObservables = [
			service.rawRefreshToken$.pipe(tap((n) => expect(n).toBe(TEST_VALID_TOKEN))),
			service.refreshToken$.pipe(tap((n) => expect(n).toBeTruthy())),
			service.refreshTokenHeader$.pipe(tap((n) => expect(n).toBeTruthy())),
			service.refreshTokenPayload$.pipe(tap((n) => expect(n).toBeTruthy())),
			service.isRefreshTokenExpired$.pipe(tap((n) => expect(n).toBe(false))),
		];

		return zip(...accessTokenObservables, ...refreshTokenObservables)
			.pipe(
				take(1),
				tap(() => expect(mockGetToken).toBeCalledTimes(accessTokenObservables.length)),
				tap(() =>
					expect(mockGetRefreshToken).toBeCalledTimes(refreshTokenObservables.length)
				)
			)
			.toPromise();
	});

	it('should yield valid results from all pipes when the tokens are malformed, and evaluate on every subscribe', () => {
		const mockGetToken = jest.fn().mockReturnValue(TEST_MALFORMED_TOKEN);
		const mockGetRefreshToken = jest.fn().mockReturnValue(TEST_MALFORMED_TOKEN);
		const mockNoCall = jest.fn();

		TestBed.overrideProvider(JWT_CONFIGURATION_TOKEN, {
			useValue: {
				getToken: mockGetToken as () => string,
			},
		} as JwtConfigurationProvider);

		TestBed.overrideProvider(JWT_REFRESH_CONFIGURATION_TOKEN, {
			useValue: {
				getRefreshToken: mockGetRefreshToken as () => string,
			},
		} as JwtRefreshConfigurationProvider<unknown, unknown>);

		TestBed.overrideProvider(DEFAULT_JWT_CONFIGURATION_TOKEN, {
			useValue: {},
		} as JwtConfigurationProvider);

		service = TestBed.get(JwtTokenService);
		const accessTokenObservables = [
			service.rawAccessToken$.pipe(tap((n) => expect(n).toBe(TEST_MALFORMED_TOKEN))),
			service.accessToken$.pipe(
				tap(mockNoCall),
				catchError((_e) => of('ERROR')),
				tap((n) => expect(n).toBe('ERROR'))
			),
			service.accessTokenHeader$.pipe(
				tap(mockNoCall),
				catchError((_e) => of('ERROR')),
				tap((n) => expect(n).toBe('ERROR'))
			),
			service.accessTokenPayload$.pipe(
				tap(mockNoCall),
				catchError((_e) => of('ERROR')),
				tap((n) => expect(n).toBe('ERROR'))
			),
			service.isAccessTokenExpired$.pipe(
				tap(mockNoCall),
				catchError((_e) => of('ERROR')),
				tap((n) => expect(n).toBe('ERROR'))
			),
		];

		const refreshTokenObservables = [
			service.rawRefreshToken$.pipe(tap((n) => expect(n).toBe(TEST_MALFORMED_TOKEN))),
			service.refreshToken$.pipe(
				tap(mockNoCall),
				catchError((_e) => of('ERROR')),
				tap((n) => expect(n).toBe('ERROR'))
			),
			service.refreshTokenHeader$.pipe(
				tap(mockNoCall),
				catchError((_e) => of('ERROR')),
				tap((n) => expect(n).toBe('ERROR'))
			),
			service.refreshTokenPayload$.pipe(
				tap(mockNoCall),
				catchError((_e) => of('ERROR')),
				tap((n) => expect(n).toBe('ERROR'))
			),
			service.isRefreshTokenExpired$.pipe(
				tap(mockNoCall),
				catchError((_e) => of('ERROR')),
				tap((n) => expect(n).toBe('ERROR'))
			),
		];

		return zip(...accessTokenObservables, ...refreshTokenObservables)
			.pipe(
				take(1),
				tap(() => expect(mockGetToken).toBeCalledTimes(accessTokenObservables.length)),
				tap(() =>
					expect(mockGetRefreshToken).toBeCalledTimes(refreshTokenObservables.length)
				),
				tap(() => expect(mockNoCall).toBeCalledTimes(0))
			)
			.toPromise();
	});

	it('should yield on every pipe when an expired token is supplied', () => {
		const mockGetToken = jest.fn().mockReturnValue(TEST_EXPIRED_TOKEN);
		const mockGetRefreshToken = jest.fn().mockReturnValue(TEST_EXPIRED_TOKEN);

		TestBed.overrideProvider(JWT_CONFIGURATION_TOKEN, {
			useValue: {
				getToken: mockGetToken as () => string,
			},
		} as JwtConfigurationProvider);

		TestBed.overrideProvider(JWT_REFRESH_CONFIGURATION_TOKEN, {
			useValue: {
				getRefreshToken: mockGetRefreshToken as () => string,
			},
		} as JwtRefreshConfigurationProvider<unknown, unknown>);

		TestBed.overrideProvider(DEFAULT_JWT_CONFIGURATION_TOKEN, {
			useValue: {},
		} as JwtConfigurationProvider);

		service = TestBed.get(JwtTokenService);
		const accessTokenObservables = [
			service.rawAccessToken$.pipe(tap((n) => expect(n).toBe(TEST_EXPIRED_TOKEN))),
			service.accessToken$.pipe(tap((n) => expect(n).toBeTruthy())),
			service.accessTokenHeader$.pipe(tap((n) => expect(n).toBeTruthy())),
			service.accessTokenPayload$.pipe(tap((n) => expect(n).toBeTruthy())),
			service.isAccessTokenExpired$.pipe(tap((n) => expect(n).toBe(true))),
		];

		const refreshTokenObservables = [
			service.rawRefreshToken$.pipe(tap((n) => expect(n).toBe(TEST_EXPIRED_TOKEN))),
			service.refreshToken$.pipe(tap((n) => expect(n).toBeTruthy())),
			service.refreshTokenHeader$.pipe(tap((n) => expect(n).toBeTruthy())),
			service.refreshTokenPayload$.pipe(tap((n) => expect(n).toBeTruthy())),
			service.isRefreshTokenExpired$.pipe(tap((n) => expect(n).toBe(true))),
		];

		return zip(...accessTokenObservables, ...refreshTokenObservables)
			.pipe(
				take(1),
				tap(() => expect(mockGetToken).toBeCalledTimes(accessTokenObservables.length)),
				tap(() =>
					expect(mockGetRefreshToken).toBeCalledTimes(refreshTokenObservables.length)
				)
			)
			.toPromise();
	});

	it('should yield on every accessToken pipe when refresh is not configured', () => {
		const mockGetToken = jest.fn().mockReturnValue(TEST_EXPIRED_TOKEN);

		TestBed.overrideProvider(JWT_CONFIGURATION_TOKEN, {
			useValue: {
				getToken: mockGetToken as () => string,
			},
		} as JwtConfigurationProvider);

		TestBed.overrideProvider(JWT_REFRESH_CONFIGURATION_TOKEN, {
			useValue: undefined,
		});

		service = TestBed.get(JwtTokenService);
		const accessTokenObservables = [
			service.rawAccessToken$.pipe(tap((n) => expect(n).toBe(TEST_EXPIRED_TOKEN))),
			service.accessToken$.pipe(tap((n) => expect(n).toBeTruthy())),
			service.accessTokenHeader$.pipe(tap((n) => expect(n).toBeTruthy())),
			service.accessTokenPayload$.pipe(tap((n) => expect(n).toBeTruthy())),
			service.isAccessTokenExpired$.pipe(tap((n) => expect(n).toBe(true))),
		];

		const refreshTokenObservables = [
			service.rawRefreshToken$.pipe(tap((n) => expect(n).toBeNull())),
			service.refreshToken$.pipe(tap((n) => expect(n).toBeNull())),
			service.refreshTokenHeader$.pipe(tap((n) => expect(n).toBeNull())),
			service.refreshTokenPayload$.pipe(tap((n) => expect(n).toBeNull())),
			service.isRefreshTokenExpired$.pipe(tap((n) => expect(n).toBe(true))),
		];
		return zip(...accessTokenObservables, ...refreshTokenObservables)
			.pipe(
				take(1),
				tap(() => expect(mockGetToken).toBeCalledTimes(accessTokenObservables.length))
			)
			.toPromise();
	});
});
