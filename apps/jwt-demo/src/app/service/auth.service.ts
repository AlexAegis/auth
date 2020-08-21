import { JwtTokenPair } from '@aegis-auth/jwt';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MockServerService } from './mock-server.service';

const ACCESS_TOKEN = 'accessToken';
const REFRESH_TOKEN = 'refreshToken';

@Injectable({
	providedIn: 'root',
})
export class AuthService implements OnDestroy {
	public accessTokenStorage$ = new BehaviorSubject<string | undefined | null>(
		localStorage.getItem(ACCESS_TOKEN)
	);
	public refreshTokenStorage$ = new BehaviorSubject<string | undefined | null>(
		localStorage.getItem(REFRESH_TOKEN)
	);

	private subscriptions = new Subscription();

	public constructor(
		private readonly http: HttpClient,
		private readonly mockServerService: MockServerService
	) {
		this.subscriptions.add(
			this.accessTokenStorage$.subscribe((accessToken) =>
				accessToken
					? localStorage.setItem(ACCESS_TOKEN, accessToken)
					: localStorage.removeItem(ACCESS_TOKEN)
			)
		);

		this.subscriptions.add(
			this.refreshTokenStorage$.subscribe((refreshToken) =>
				refreshToken
					? localStorage.setItem(REFRESH_TOKEN, refreshToken)
					: localStorage.removeItem(REFRESH_TOKEN)
			)
		);
	}

	/**
	 * Normally, a function like this in your app would do an http request
	 * to a server to acquire the tokens, in this example app, we just use
	 * another service in place of a server
	 *
	 * @param tokenTimeout seconds
	 */
	public generateTokenPair(tokenTimeout = 60): JwtTokenPair {
		return this.mockServerService.getTokenPair(tokenTimeout);
	}

	public login(tokenTimeout = 60): Observable<JwtTokenPair> {
		return this.http
			.post<JwtTokenPair>(
				'https://localhost/login',
				{},
				{
					params: {
						tokenTimeout: tokenTimeout.toString(),
					},
				}
			)
			.pipe(
				tap((tokenPair) => {
					console.log('tokenpair', tokenPair);
					this.accessTokenStorage$.next(tokenPair.accessToken);
					this.refreshTokenStorage$.next(tokenPair.refreshToken);
				})
			);
	}

	public refresh(tokenTimeout = 60): Observable<JwtTokenPair> {
		return this.http
			.post<JwtTokenPair>(
				'https://localhost/refresh',
				{
					refreshToken: this.refreshTokenStorage$.value,
				},
				{
					params: {
						tokenTimeout: tokenTimeout.toString(),
					},
				}
			)
			.pipe(
				tap((tokenPair) => {
					console.log('tokenpair', tokenPair);
					this.accessTokenStorage$.next(tokenPair.accessToken);
					this.refreshTokenStorage$.next(tokenPair.refreshToken);
				})
			);
	}

	public logout(): Observable<boolean> {
		this.accessTokenStorage$.next(null);
		this.refreshTokenStorage$.next(null);
		return of(true);
	}

	public ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
