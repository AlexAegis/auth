import { JwtTokenPair } from '@aegis-auth/jwt';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MockServerService } from './mock-server.service';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	/**
	 * TODO: These might have to be moved to a separate AuthStorageService
	 * Try not to
	 */
	public accessTokenStorage$ = new ReplaySubject<string | undefined | null>(1);
	public refreshTokenStorage$ = new ReplaySubject<string | undefined | null>(1);

	public constructor(
		private readonly http: HttpClient,
		private readonly mockServerService: MockServerService
	) {}

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

	public logout(): Observable<boolean> {
		this.accessTokenStorage$.next(undefined);
		this.refreshTokenStorage$.next(undefined);
		return of(true);
	}
}
