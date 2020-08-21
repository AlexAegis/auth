import { Inject, Injectable, Optional } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { intoObservable, isString, isUnixTimestampExpired } from '../function';
import { JwtConfiguration, JwtRefreshConfiguration, JwtToken } from '../model';
import {
	DEFAULT_JWT_CONFIGURATION_TOKEN,
	DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN,
	JWT_CONFIGURATION_TOKEN,
	JWT_REFRESH_CONFIGURATION_TOKEN,
} from '../token';

@Injectable({
	providedIn: 'root',
})
export class JwtTokenService<
	Claims = Record<string | number, unknown>,
	RefreshClaims = Record<string | number, unknown>,
	RefreshRequest = Record<string | number, unknown>,
	RefreshResponse = Record<string | number, unknown>
> {
	private readonly config: JwtConfiguration = {
		...this.rawDefaultConfig,
		...this.rawConfig,
	};

	private readonly refreshConfig:
		| JwtRefreshConfiguration<RefreshRequest, RefreshResponse>
		| undefined =
		this.rawDefaultRefreshConfig && this.rawRefreshConfig
			? {
					...this.rawDefaultRefreshConfig,
					...this.rawRefreshConfig,
			  }
			: undefined;

	/**
	 * Consider restricting getToken to observables only so things can be cached
	 */
	public readonly rawAccessToken$ = intoObservable(this.config.getToken);

	public readonly rawRefreshToken$ = this.refreshConfig?.getRefreshToken
		? intoObservable(this.refreshConfig.getRefreshToken)
		: of(null);

	public readonly accessToken$ = this.rawAccessToken$.pipe(
		map((token) => {
			if (isString(token)) {
				const jwtToken = JwtToken.from<Claims>(token);
				if (!jwtToken) throw new Error('Non-valid token observed');
				else return jwtToken;
			} else return null;
		})
	);

	public readonly refreshToken$ = this.rawRefreshToken$.pipe(
		map((refreshToken) => {
			if (isString(refreshToken)) {
				const jwtToken = JwtToken.from<RefreshClaims>(refreshToken);
				if (!jwtToken) throw new Error('Non-valid token observed');
				else return jwtToken;
			} else return null;
		})
	);

	public readonly accessTokenHeader$ = this.accessToken$.pipe(
		map((token) => token?.header ?? null)
	);
	public readonly accessTokenPayload$ = this.accessToken$.pipe(
		map((token) => token?.payload ?? null)
	);

	public readonly refreshTokenHeader$ = this.refreshToken$.pipe(
		map((token) => token?.header ?? null)
	);
	public readonly refreshTokenPayload$ = this.refreshToken$.pipe(
		map((token) => token?.payload ?? null)
	);

	public readonly isAccessTokenExpired$ = this.accessTokenPayload$.pipe(
		map((payload) => isUnixTimestampExpired(payload?.exp))
	);

	public readonly isRefreshTokenExpired$ = this.refreshTokenPayload$.pipe(
		map((payload) => isUnixTimestampExpired(payload?.exp))
	);

	public constructor(
		@Inject(JWT_CONFIGURATION_TOKEN)
		private readonly rawConfig: JwtConfiguration,
		@Inject(DEFAULT_JWT_CONFIGURATION_TOKEN)
		private readonly rawDefaultConfig: JwtConfiguration,
		@Inject(DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN)
		@Optional()
		private readonly rawDefaultRefreshConfig?: JwtRefreshConfiguration<
			RefreshRequest,
			RefreshResponse
		>,
		@Inject(JWT_REFRESH_CONFIGURATION_TOKEN)
		@Optional()
		private readonly rawRefreshConfig?: JwtRefreshConfiguration<RefreshRequest, RefreshResponse>
	) {}
}
