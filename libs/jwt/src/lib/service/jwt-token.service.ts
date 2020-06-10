import { BaseConfigService, HeaderConfiguration, isPromise, isString } from '@aegis-auth/core';
import { JwtToken, JwtTokenString } from '@aegis-auth/token';
import { Inject, Injectable } from '@angular/core';
import { from, isObservable, Observable, of } from 'rxjs';
import { filter, map, startWith, switchMap, take, tap } from 'rxjs/operators';
import { JwtConfiguration } from '../model';
import { DEFAULT_JWT_CONFIGURATION_TOKEN, JWT_CONFIGURATION_TOKEN } from '../token';

@Injectable({
	providedIn: 'root',
})
export class JwtTokenService extends BaseConfigService<JwtConfiguration> {
	public readonly tokenString$ = this.config$.pipe(
		tap((config) => console.log('got config in pipe!', config)),
		switchMap((config) => JwtTokenService.normalizeGetToken(config.getToken)),
		startWith(null)
	);

	public readonly token$ = this.tokenString$.pipe(
		filter(isString),
		map((token) => {
			const jwtToken = JwtToken.from(token);
			console.log('token', token);
			console.log('jwtToken', jwtToken);
			if (!jwtToken) throw new Error('Non-valid token observed');
			else return jwtToken;
		})
	);

	public readonly header$ = this.token$.pipe(map((token) => token.header));
	public readonly payload$ = this.token$.pipe(map((token) => token.payload));

	public constructor(
		@Inject(JWT_CONFIGURATION_TOKEN)
		protected readonly rawConfig: JwtConfiguration,
		@Inject(DEFAULT_JWT_CONFIGURATION_TOKEN)
		public readonly defaultConfig: Partial<HeaderConfiguration>
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
