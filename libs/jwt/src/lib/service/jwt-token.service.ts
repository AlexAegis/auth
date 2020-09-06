import { HttpHandler } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { JwtCouldntRefreshError } from '../errors/jwt-error.class';
import { handleJwtError } from '../function/handle-jwt-error.function';
import { intoObservable } from '../function/into-observable.function';
import { isNotNullish } from '../function/is-not-nullish.predicate';
import { isUnixTimestampExpiredNowAndWhenItIs } from '../function/is-unix-timestamp-expired-now-and-when-it-is.function';
import { isString } from '../function/string.predicate';
import { tryJwtRefresh } from '../function/try-jwt-refresh.function';
import {
	JwtConfiguration,
	JwtRefreshConfiguration,
} from '../model/auth-core-configuration.interface';
import { JwtToken } from '../model/jwt-token.class';
import {
	DEFAULT_JWT_CONFIGURATION_TOKEN,
	DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN,
	JWT_CONFIGURATION_TOKEN,
	JWT_REFRESH_CONFIGURATION_TOKEN,
} from '../token/jwt-configuration.token';

@Injectable({
	providedIn: 'root',
})
export class JwtTokenService<
	Claims = Record<string | number, unknown>,
	RefreshClaims = Record<string | number, unknown>,
	RefreshRequest = Record<string | number, unknown>,
	RefreshResponse = Record<string | number, unknown>
> {
	public constructor(
		private readonly httpHandler: HttpHandler,
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
		private readonly rawRefreshConfig?: JwtRefreshConfiguration<
			RefreshRequest,
			RefreshResponse
		>,
		@Optional() private readonly router?: Router
	) {}
	public readonly config: JwtConfiguration = {
		...this.rawDefaultConfig,
		...this.rawConfig,
	};

	public readonly refreshConfig?: JwtRefreshConfiguration<RefreshRequest, RefreshResponse> =
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

	public readonly isAccessTokenExpired$ = this.accessToken$.pipe(
		switchMap((token) =>
			token ? isUnixTimestampExpiredNowAndWhenItIs(token.payload.exp) : of(null)
		)
	);

	public readonly isRefreshTokenExpired$ = this.refreshToken$.pipe(
		switchMap((token) =>
			token ? isUnixTimestampExpiredNowAndWhenItIs(token.payload.exp) : of(null)
		)
	);

	public readonly isAccessTokenValid$ = this.isAccessTokenExpired$.pipe(
		map((isExpired) => isNotNullish(isExpired) && !isExpired)
	);

	public readonly isRefreshTokenValid$ = this.isRefreshTokenExpired$.pipe(
		map((isExpired) => isNotNullish(isExpired) && !isExpired)
	);

	/**
	 * Does a token refresh. Emits false if it failed, or true if succeeded.
	 */
	public manualRefresh(): Observable<boolean> {
		if (this.refreshConfig) {
			return tryJwtRefresh(
				this.httpHandler,
				'Access token not valid on guard activation',
				this.refreshConfig,
				(refreshError) =>
					handleJwtError<RefreshRequest, RefreshResponse>(
						JwtCouldntRefreshError.createErrorResponse(undefined, refreshError),
						this.config,
						this.refreshConfig,
						this.router
					).pipe(catchError(() => of(false))),
				() => of(true)
			);
		} else {
			return of(false);
		}
	}
}
