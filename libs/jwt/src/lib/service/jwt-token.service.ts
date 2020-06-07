import {
	BaseConfigService,
	DefaultHeaderConfigurationToken,
	HeaderConfiguration,
	HeaderConfigurationToken,
} from '@aegis-auth/core';
import { JwtToken, JwtTokenString } from '@aegis-auth/token';
import { Inject, Injectable } from '@angular/core';
import { take, tap } from 'rxjs/operators';
import { JwtModule } from '../jwt.module';
import { JwtConfiguration } from '../model';

@Injectable({
	providedIn: JwtModule,
})
export class JwtTokenService extends BaseConfigService {
	/*
	public readonly tokenString$ = this.configService.configs$.pipe(
		switchMap((configs) => {
			return combineLatest(
				configs.map((config) => {
					if (isObservable(config.getToken)) {
						return config.getToken;
					} else {
						const result = config.getToken();
						if (isObservable(result) || isPromise(result)) return result;
						else return of(result);
					}
				})
			);
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
*/
	public constructor(
		@Inject(HeaderConfigurationToken)
		protected readonly rawConfigs: JwtConfiguration[] = [],
		@Inject(DefaultHeaderConfigurationToken)
		public readonly defaultConfig: Partial<HeaderConfiguration>[]
	) {
		super(rawConfigs, defaultConfig);
		this.configs$
			.pipe(
				take(1),
				tap((configs) => console.log('JWT ConfigService', configs))
			)
			.subscribe();
	}

	public parseToken(tokenString: string): JwtToken | null {
		return JwtToken.from(tokenString as JwtTokenString);
	}
}
