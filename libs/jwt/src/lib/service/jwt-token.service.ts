import { Inject, Injectable, Optional } from '@angular/core';
import { BehaviorSubject, EMPTY, from, isObservable, Observable, of } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { isExpired, isPromise, isString } from '../function';
import { JwtConfiguration, JwtRefreshConfiguration, JwtToken, JwtTokenString } from '../model';
import {
	DEFAULT_JWT_CONFIGURATION_TOKEN,
	JWT_CONFIGURATION_TOKEN,
	JWT_REFRESH_CONFIGURATION_TOKEN,
} from '../token';

@Injectable({
	providedIn: 'root',
})
export class JwtTokenService {
	public readonly jwtConfig$ = new BehaviorSubject<JwtConfiguration>({
		...this.defaultConfig,
		...this.rawConfig,
	});

	public readonly refreshConfig$ = new BehaviorSubject<
		JwtRefreshConfiguration<unknown, unknown> | undefined
	>(this.rawRefreshConfig);

	/**
	 * Consider restricting getToken to observables only so things can be cached
	 */
	public readonly rawAccessToken$ = this.jwtConfig$.pipe(
		switchMap((config) => JwtTokenService.normalizeGetToken(config.getToken)),
		startWith(null)
	);

	public readonly rawRefreshToken$ = this.refreshConfig$.pipe(
		switchMap((config) => config?.getRefreshToken$ || EMPTY),
		startWith(null)
	);

	public readonly accessToken$ = this.rawAccessToken$.pipe(
		map((token) => {
			if (isString(token)) {
				const jwtToken = JwtToken.from(token);
				if (!jwtToken) throw new Error('Non-valid token observed');
				else return jwtToken;
			} else return null;
		})
	);

	public readonly refreshToken$ = this.rawAccessToken$.pipe(
		map((refreshToken) => {
			if (isString(refreshToken)) {
				const jwtToken = JwtToken.from(refreshToken);
				if (!jwtToken) throw new Error('Non-valid token observed');
				else return jwtToken;
			} else return null;
		})
	);

	public readonly accessTokenHeader$ = this.accessToken$.pipe(map((token) => token?.header));
	public readonly accessTokenPayload$ = this.accessToken$.pipe(map((token) => token?.payload));

	public readonly refreshTokenHeader$ = this.refreshToken$.pipe(map((token) => token?.header));
	public readonly refreshTokenPayload$ = this.refreshToken$.pipe(map((token) => token?.payload));

	public readonly isAccessTokenExpired$ = this.accessTokenPayload$.pipe(
		map((payload) => isExpired(payload?.exp))
	);

	public readonly isRefreshTokenExpired$ = this.refreshTokenPayload$.pipe(
		map((payload) => isExpired(payload?.exp))
	);

	public constructor(
		@Inject(JWT_CONFIGURATION_TOKEN)
		private readonly rawConfig: JwtConfiguration,
		@Inject(DEFAULT_JWT_CONFIGURATION_TOKEN)
		private readonly defaultConfig: JwtConfiguration,
		@Inject(JWT_REFRESH_CONFIGURATION_TOKEN)
		@Optional()
		private readonly rawRefreshConfig?: JwtRefreshConfiguration<unknown, unknown>
	) {}

	private static normalizeGetToken(
		getValue:
			| Observable<string | null | undefined>
			| (() =>
					| string
					| null
					| undefined
					| Promise<string | null | undefined>
					| Observable<string | null | undefined>)
	): Observable<string | null | undefined> {
		if (isObservable(getValue)) {
			return getValue;
		} else {
			const result = getValue();
			if (isObservable(result)) return result;
			if (isPromise(result)) return from(result);
			else return of(result);
		}
	}

	public parseToken(tokenString: string): JwtToken | null {
		return JwtToken.from(tokenString as JwtTokenString);
	}
}
