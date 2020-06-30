import { Inject, Injectable, Optional } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
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
export class JwtTokenService {
	public readonly config$ = new BehaviorSubject<JwtConfiguration>({
		...this.rawDefaultConfig,
		...this.rawConfig,
	});

	public readonly refreshConfig$ = new BehaviorSubject<
		JwtRefreshConfiguration<unknown, unknown> | undefined
	>(
		this.rawDefaultRefreshConfig && this.rawRefreshConfig
			? {
					...this.rawDefaultRefreshConfig,
					...this.rawRefreshConfig,
			  }
			: undefined
	);

	/**
	 * Consider restricting getToken to observables only so things can be cached
	 */
	public readonly rawAccessToken$ = this.config$.pipe(
		mergeMap((config) => intoObservable(config.getToken))
	);

	public readonly rawRefreshToken$ = this.refreshConfig$.pipe(
		mergeMap((refreshConfig) =>
			refreshConfig?.getRefreshToken
				? intoObservable(refreshConfig.getRefreshToken)
				: of(null)
		)
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

	public readonly refreshToken$ = this.rawRefreshToken$.pipe(
		map((refreshToken) => {
			if (isString(refreshToken)) {
				const jwtToken = JwtToken.from(refreshToken);
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
		private readonly rawDefaultRefreshConfig?: JwtRefreshConfiguration<unknown, unknown>,
		@Inject(JWT_REFRESH_CONFIGURATION_TOKEN)
		@Optional()
		private readonly rawRefreshConfig?: JwtRefreshConfiguration<unknown, unknown>
	) {}
}
