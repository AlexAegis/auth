import { JwtToken, JwtTokenString } from '@aegis-auth/token';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { from, isObservable, Observable, of, ReplaySubject, Subscription } from 'rxjs';
import { filter, map, shareReplay, tap } from 'rxjs/operators';
import {
	AuthConfiguration,
	AuthCoreModule,
	AuthCoreModuleConfigurationService,
} from '../auth-core.module';

@Injectable({
	providedIn: AuthCoreModule,
})
export class JwtTokenService implements OnDestroy {
	public readonly tokenString$ = new ReplaySubject<string | null | undefined>(1);

	public readonly token$ = this.tokenString$.pipe(
		filter((str): str is string => !!str && typeof str === 'string'),
		map((token) => {
			const jwtToken = JwtToken.from(token);
			console.log('token', token);
			console.log('jwtToken', jwtToken);
			if (!jwtToken) throw new Error('Non-valid token observed');
			else return jwtToken;
		}),
		shareReplay(1)
	);

	public readonly header$ = this.token$.pipe(map((token) => token.header));
	public readonly payload$ = this.token$.pipe(map((token) => token.payload));

	private readonly subscriptions = new Subscription();

	public constructor(
		@Inject(AuthCoreModuleConfigurationService)
		public readonly config: AuthConfiguration
	) {
		const tokenSource = this.config.getToken();
		if (tokenSource) {
			console.log('JwtTokenService CONSTRUCTING', this.config, tokenSource);
			let observable: Observable<string | null | undefined>;
			if (typeof tokenSource === 'string') {
				observable = of(tokenSource);
				console.log('**************************************');
				this.tokenString$.next(tokenSource as string);
			} else if (isObservable(tokenSource)) {
				console.log('SUBSCRIBINMG TO SORUCE');
				observable = tokenSource;
			} else {
				observable = from(tokenSource);
			}

			this.subscriptions.add(
				observable
					.pipe(tap((tok) => console.log('toksdfsferwe ', tok)))
					.subscribe(this.tokenString$)
			);
		} else {
			this.tokenString$.next(null);
		}
	}

	public parseToken(tokenString: string): JwtToken | null {
		return JwtToken.from(tokenString as JwtTokenString);
	}

	public ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
