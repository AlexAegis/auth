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
import { LoginGuard } from './login.guard';

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
			providers: [
				{
					provide: JwtTokenService,
					useValue: {} as Partial<JwtTokenService>,
				},
				{
					provide: ActivatedRoute,
					useValue: { snapshot: { paramMap: convertToParamMap({ id: 'one-id' }) } },
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
		guard = TestBed.inject(LoginGuard);
		expect(guard).toBeTruthy();
	});

	it('should be true on all guards when the access token is valid', () => {
		TestBed.overrideProvider(JwtTokenService, {
			useValue: {
				isAccessTokenValid$: of(true),
			} as Partial<JwtTokenService>,
		});
		guard = TestBed.inject(LoginGuard);
		activatedRoute = TestBed.inject(ActivatedRoute);
		routerStateSnapshot = TestBed.inject(RouterStateSnapshot);

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

	it('should be false on all guards when the access token is invalid', () => {
		TestBed.overrideProvider(JwtTokenService, {
			useValue: {
				isAccessTokenValid$: of(false),
			} as Partial<JwtTokenService>,
		});
		guard = TestBed.inject(LoginGuard);
		activatedRoute = TestBed.inject(ActivatedRoute);
		routerStateSnapshot = TestBed.inject(RouterStateSnapshot);
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
});
