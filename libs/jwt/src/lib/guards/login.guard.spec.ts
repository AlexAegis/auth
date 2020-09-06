import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
	ActivatedRoute,
	convertToParamMap,
	Route,
	RouterStateSnapshot,
	UrlSegment,
	UrlTree,
} from '@angular/router';
import { Observer, of, zip } from 'rxjs';
import { take } from 'rxjs/operators';
import { intoObservable } from '../function/into-observable.function';
import { JwtTokenService } from '../service/jwt-token.service';
import { LoginGuard, LoginGuardData } from './login.guard';

describe('LoginGuard', () => {
	let guard: LoginGuard;
	let activatedRoute: ActivatedRoute;
	let routerStateSnapshot: RouterStateSnapshot;
	const route: Route = { path: '/' };
	const urlSegments: UrlSegment[] = [new UrlSegment('/', {})];

	const mockError = jest.fn();
	const mockComplete = jest.fn();

	const getMockObserver = <T>(mockNext: jest.Mock<void, [T]>): Observer<T> => ({
		next: mockNext,
		error: mockError,
		complete: mockComplete,
	});

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
			providers: [
				{
					provide: ActivatedRoute,
					useValue: {
						snapshot: { paramMap: convertToParamMap({ id: 'one-id' }) },
					},
				},
				{ provide: RouterStateSnapshot, useValue: { url: route.path } },
			],
		});
	});

	afterEach(() => jest.clearAllMocks());

	it('should be created', () => {
		TestBed.overrideProvider(JwtTokenService, {
			useValue: {
				isAccessTokenValid$: of(true),
			} as Partial<JwtTokenService>,
		});
		guard = TestBed.get(LoginGuard);
		expect(guard).toBeTruthy();
	});

	it('should be true on all guards when the access token is valid', () => {
		TestBed.overrideProvider(JwtTokenService, {
			useValue: {
				isAccessTokenValid$: of(true),
			} as Partial<JwtTokenService>,
		});
		guard = TestBed.get(LoginGuard);
		activatedRoute = TestBed.get(ActivatedRoute);
		routerStateSnapshot = TestBed.get(RouterStateSnapshot);

		const canActivateResult = guard.canActivate(activatedRoute.snapshot, routerStateSnapshot);
		const canActivateChildResult = guard.canActivateChild(
			activatedRoute.snapshot,
			routerStateSnapshot
		);
		const canLoadResult = guard.canLoad(route, urlSegments);

		const mockNext = jest.fn<void, [[boolean | UrlTree, boolean | UrlTree, boolean | UrlTree]]>(
			([a, b, c]) => {
				expect(a).toBeTruthy();
				expect(b).toBeTruthy();
				expect(c).toBeTruthy();
			}
		);

		zip(
			intoObservable(canActivateResult),
			intoObservable(canActivateChildResult),
			intoObservable(canLoadResult)
		)
			.pipe(take(1))
			.subscribe(getMockObserver(mockNext));

		expect(mockNext).toBeCalledTimes(1);
		expect(mockError).toBeCalledTimes(0);
		expect(mockComplete).toBeCalledTimes(1);
	});

	it('should be false on all guards when the access token is invalid and manual refresh is disabled', () => {
		TestBed.overrideProvider(JwtTokenService, {
			useValue: {
				isAccessTokenValid$: of(false),
				refreshConfig: {
					isAutoRefreshAllowedInLoginGuardByDefault: false,
				},
			} as Partial<JwtTokenService>,
		});

		guard = TestBed.get(LoginGuard);
		activatedRoute = TestBed.get(ActivatedRoute);
		routerStateSnapshot = TestBed.get(RouterStateSnapshot);
		const canActivateResult = guard.canActivate(activatedRoute.snapshot, routerStateSnapshot);
		const canActivateChildResult = guard.canActivateChild(
			activatedRoute.snapshot,
			routerStateSnapshot
		);
		const canLoadResult = guard.canLoad(route, urlSegments);

		const mockNext = jest.fn<void, [[boolean | UrlTree, boolean | UrlTree, boolean | UrlTree]]>(
			([a, b, c]) => {
				expect(a).toBeFalsy();
				expect(b).toBeFalsy();
				expect(c).toBeFalsy();
			}
		);

		zip(
			intoObservable(canActivateResult),
			intoObservable(canActivateChildResult),
			intoObservable(canLoadResult)
		)
			.pipe(take(1))
			.subscribe(getMockObserver(mockNext));

		expect(mockNext).toBeCalledTimes(1);
		expect(mockError).toBeCalledTimes(0);
		expect(mockComplete).toBeCalledTimes(1);
	});

	it('should be true on all guards when the access token is expired but it is refreshed', () => {
		TestBed.overrideProvider(JwtTokenService, {
			useValue: {
				isAccessTokenValid$: of(false),
				manualRefresh: () => of(true),
				refreshConfig: {
					isAutoRefreshAllowedInLoginGuardByDefault: true,
				},
			} as Partial<JwtTokenService>,
		});

		guard = TestBed.get(LoginGuard);
		activatedRoute = TestBed.get(ActivatedRoute);
		routerStateSnapshot = TestBed.get(RouterStateSnapshot);
		const canActivateResult = guard.canActivate(activatedRoute.snapshot, routerStateSnapshot);
		const canActivateChildResult = guard.canActivateChild(
			activatedRoute.snapshot,
			routerStateSnapshot
		);
		const canLoadResult = guard.canLoad(route, urlSegments);

		const mockNext = jest.fn<void, [[boolean | UrlTree, boolean | UrlTree, boolean | UrlTree]]>(
			([a, b, c]) => {
				expect(a).toBeTruthy();
				expect(b).toBeTruthy();
				expect(c).toBeTruthy();
			}
		);

		zip(
			intoObservable(canActivateResult),
			intoObservable(canActivateChildResult),
			intoObservable(canLoadResult)
		)
			.pipe(take(1))
			.subscribe(getMockObserver(mockNext));

		expect(mockNext).toBeCalledTimes(1);
		expect(mockError).toBeCalledTimes(0);
		expect(mockComplete).toBeCalledTimes(1);
	});

	it('should be false on all guards when the access token is invalid and manual refresh is enabled globally but not on the route', () => {
		TestBed.overrideProvider(JwtTokenService, {
			useValue: {
				isAccessTokenValid$: of(false),
				refreshConfig: {
					isAutoRefreshAllowedInLoginGuardByDefault: true,
				},
			} as Partial<JwtTokenService>,
		});
		const data = { isRefreshAllowed: false } as LoginGuardData;
		guard = TestBed.get(LoginGuard);

		activatedRoute = TestBed.get(ActivatedRoute);
		activatedRoute = ({
			...activatedRoute,
			snapshot: { ...activatedRoute.snapshot, data },
		} as unknown) as ActivatedRoute;

		routerStateSnapshot = TestBed.get(RouterStateSnapshot);

		const routeWithData: Route = { ...route, data };

		const canActivateResult = guard.canActivate(activatedRoute.snapshot, routerStateSnapshot);
		const canActivateChildResult = guard.canActivateChild(
			activatedRoute.snapshot,
			routerStateSnapshot
		);
		const canLoadResult = guard.canLoad(routeWithData, urlSegments);

		const mockNext = jest.fn<void, [[boolean | UrlTree, boolean | UrlTree, boolean | UrlTree]]>(
			([a, b, c]) => {
				expect(a).toBeFalsy();
				expect(b).toBeFalsy();
				expect(c).toBeFalsy();
			}
		);

		zip(
			intoObservable(canActivateResult),
			intoObservable(canActivateChildResult),
			intoObservable(canLoadResult)
		)
			.pipe(take(1))
			.subscribe(getMockObserver(mockNext));

		expect(mockNext).toBeCalledTimes(1);
		expect(mockError).toBeCalledTimes(0);
		expect(mockComplete).toBeCalledTimes(1);
	});
});
