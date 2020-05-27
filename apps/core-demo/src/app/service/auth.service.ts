import { JwtTokenPair } from '@aegis-auth/token';
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
	public accessTokenStorage$ = new ReplaySubject<string>(1);
	public refreshTokenStorage$ = new ReplaySubject<string>(1);

	public constructor(private readonly mockServerService: MockServerService) {}

	/**
	 * Normally, a function like this in your app would do an http request
	 * to a server to acquire the tokens, in this example app, we just use
	 * another service in place of a server
	 */
	public login(): Observable<JwtTokenPair> {
		const tokenPair = this.mockServerService.getTokenPair();
		return of(tokenPair).pipe(
			tap((t) => {
				this.accessTokenStorage$.next(t.accessToken);
				this.refreshTokenStorage$.next(t.refreshToken);
			})
		);
	}
}
