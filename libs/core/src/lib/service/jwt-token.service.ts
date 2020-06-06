import { JwtToken, JwtTokenString } from '@aegis-auth/token';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, isObservable, of } from 'rxjs';
import { filter, map, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { isPromise, isString } from '../helper';
import { AuthTokenConfiguration, DEFAULT_AUTH_TOKEN_CONFIG } from '../model';
import { AuthCoreModuleConfigurationService } from '../token';

@Injectable({
	providedIn: 'root',
})
export class JwtTokenService {
	public readonly config$ = new BehaviorSubject<AuthTokenConfiguration>({
		...DEFAULT_AUTH_TOKEN_CONFIG,
		...this.rawConfig,
	});

	public readonly tokenString$ = this.config$.pipe(
		switchMap((config) => {
			if (isObservable(config.getToken)) {
				return config.getToken;
			} else {
				const result = config.getToken();
				if (isObservable(result) || isPromise(result)) return result;
				else return of(result);
			}
		}),
		startWith(null),
		shareReplay({
			refCount: false,
			bufferSize: 1,
		})
	);

	public readonly token$ = this.tokenString$.pipe(
		filter(isString),
		map((token) => {
			const jwtToken = JwtToken.from(token);
			console.log('token', token);
			console.log('jwtToken', jwtToken);
			if (!jwtToken) throw new Error('Non-valid token observed');
			else return jwtToken;
		}),
		shareReplay({
			refCount: false,
			bufferSize: 1,
		})
	);

	public readonly header$ = this.token$.pipe(map((token) => token.header));
	public readonly payload$ = this.token$.pipe(map((token) => token.payload));

	public constructor(
		@Inject(AuthCoreModuleConfigurationService)
		public readonly rawConfig: AuthTokenConfiguration[]
	) {
		// TODO: refactor to an array configs
		console.log('rawConfig', rawConfig);
	}

	public parseToken(tokenString: string): JwtToken | null {
		return JwtToken.from(tokenString as JwtTokenString);
	}
}
