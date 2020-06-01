import { JwtTokenPair } from '@aegis-auth/token';
import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { take, tap } from 'rxjs/operators';
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

	public constructor(private readonly mockServerService: MockServerService) {}

	/**
	 * Normally, a function like this in your app would do an http request
	 * to a server to acquire the tokens, in this example app, we just use
	 * another service in place of a server
	 *
	 * @param tokenTimeout seconds
	 */
	public login(tokenTimeout = 60): Observable<JwtTokenPair> {
		const tokenPair = this.mockServerService.getTokenPair(tokenTimeout);
		return of(tokenPair).pipe(
			take(1),
			tap((t) => {
				console.log(tokenPair);
				this.accessTokenStorage$.next(t.accessToken);
				this.refreshTokenStorage$.next(t.refreshToken);
			})
		);
	}

	public logout(): Observable<boolean> {
		this.accessTokenStorage$.next(undefined);
		this.refreshTokenStorage$.next(undefined);
		return of(true);
	}
}
