import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { EMPTY, from, isObservable, Observable, of } from 'rxjs';
import { map, startWith, switchMap, take, tap } from 'rxjs/operators';
import { isExpired, isPromise, isString } from '../function';
import { JwtConfiguration, JwtToken, JwtTokenString } from '../model';
import { DEFAULT_JWT_CONFIGURATION_TOKEN, JWT_CONFIGURATION_TOKEN } from '../token';
import { BaseConfigService } from './base-config-service.class';

@Injectable({
	providedIn: 'root',
})
export class JwtTokenService extends BaseConfigService<JwtConfiguration> {
	/**
	 * Consider restricting getToken to observables only so things can be cached
	 */
	public readonly rawAccessToken$ = this.config$.pipe(
		tap((config) => console.log('got config in pipe!', config)),
		switchMap((config) => JwtTokenService.normalizeGetToken(config.getToken)),
		startWith(null)
	);

	public readonly rawRefreshToken$ = this.config$.pipe(
		tap((config) => console.log('got config in refresh pipe!', config)),
		switchMap((config) => config.autoRefresher?.getRefreshToken$ || EMPTY),
		startWith(null)
	);

	public readonly accessToken$ = this.rawAccessToken$.pipe(
		map((token) => {
			if (isString(token)) {
				const jwtToken = JwtToken.from(token);
				console.log('token', token);
				console.log('jwtToken', jwtToken);
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
		private http: HttpClient,
		@Inject(JWT_CONFIGURATION_TOKEN)
		protected readonly rawConfig: JwtConfiguration,
		@Inject(DEFAULT_JWT_CONFIGURATION_TOKEN)
		public readonly defaultConfig: JwtConfiguration
	) {
		super(rawConfig, defaultConfig);
		this.config$
			.pipe(
				take(1),
				tap((configs) => console.log('JWT ConfigService', configs))
			)
			.subscribe();
	}

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
