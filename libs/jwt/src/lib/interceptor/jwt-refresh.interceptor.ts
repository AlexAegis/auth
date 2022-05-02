import {
	HttpErrorResponse,
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { JwtCannotRefreshError, JwtCouldntRefreshError, JwtError } from '../errors/jwt-error.class';
import { checkAgainstUrlFilter } from '../function/check-against-url-filter.function';
import { intoObservable } from '../function/into-observable.function';
import { matchAgainst } from '../function/match-against.function';
import { separateUrl } from '../function/separate-url.function';
import { tryJwtRefresh } from '../function/try-jwt-refresh.function';
import {
	JwtConfiguration,
	JwtRefreshConfiguration,
} from '../model/auth-core-configuration.interface';
import { JwtToken } from '../model/jwt-token.class';
import { JwtRefreshStateService } from '../service/jwt-refresh-state.service';
import { JwtTokenService } from '../service/jwt-token.service';
import {
	DEFAULT_JWT_CONFIGURATION_TOKEN,
	DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN,
	JWT_CONFIGURATION_TOKEN,
	JWT_REFRESH_CONFIGURATION_TOKEN,
} from '../token/jwt-configuration.token';

@Injectable()
export class JwtRefreshInterceptor implements HttpInterceptor {
	private readonly jwtConfiguration!: JwtConfiguration;
	private readonly jwtRefreshConfiguration!: JwtRefreshConfiguration<unknown, unknown>;
	private readonly rawRefreshToken$: Observable<string | null | undefined>;
	private readonly isRawRefreshTokenGetterAvailable: boolean;

	public constructor(
		@Inject(JWT_CONFIGURATION_TOKEN)
		readonly jwtConfig: JwtConfiguration,
		@Inject(DEFAULT_JWT_CONFIGURATION_TOKEN)
		readonly defaultJwtConfig: JwtConfiguration,
		@Inject(JWT_REFRESH_CONFIGURATION_TOKEN)
		readonly refreshConfig: JwtRefreshConfiguration<unknown, unknown>,
		@Inject(DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN)
		readonly defaultJwtRefreshConfig: JwtRefreshConfiguration<unknown, unknown>,
		private readonly jwtRefreshStateService: JwtRefreshStateService,
		private readonly jwtTokenService: JwtTokenService
	) {
		this.jwtConfiguration = {
			...defaultJwtConfig,
			...jwtConfig,
		};

		this.jwtRefreshConfiguration = {
			...defaultJwtRefreshConfig,
			...refreshConfig,
		};

		this.rawRefreshToken$ = intoObservable(
			this.jwtRefreshConfiguration.getRefreshToken ?? (() => null)
		);

		this.isRawRefreshTokenGetterAvailable = !!this.jwtRefreshConfiguration.getRefreshToken;
	}

	private handleWithToken(
		request: HttpRequest<unknown>,
		next: HttpHandler,
		token: string
	): Observable<HttpEvent<unknown>> {
		const requestWithUpdatedTokens = request.clone({
			headers: request.headers.set(
				this.jwtConfiguration.header,
				this.jwtConfiguration.scheme + token
			),
		});
		return next.handle(requestWithUpdatedTokens);
	}

	public intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		const separatedUrl = separateUrl(request.url);
		const jwtHeaderValue = request.headers.get(this.jwtConfiguration.header);

		// Only do something if the request is headed towards a protected endpoint.
		// The forRoot method of the module ensures that this interceptor is injected
		// after the token injector interceptor. So by the time this executes, the token should
		// be here.
		// And if the url is not the refresh url itself, and any of the other explicitly
		// filtered urls where refresh is prohibited by config.
		if (
			jwtHeaderValue &&
			!matchAgainst(request.url)(this.jwtRefreshConfiguration.refreshUrl) &&
			checkAgainstUrlFilter(this.jwtRefreshConfiguration, separatedUrl)
		) {
			// If locked, instead of refreshing, wait for it and get the new accessToken
			if (this.jwtRefreshStateService.refreshLock$.value) {
				// When the lock unlocks, retry with the new token
				return this.jwtRefreshStateService.refreshLock$.pipe(
					filter((lock) => !lock),
					take(1),
					withLatestFrom(this.jwtTokenService.rawAccessToken$),
					switchMap(([, accessToken]) => {
						// ...but only if there is actually a token
						if (accessToken) {
							return this.handleWithToken(request, next, accessToken);
						} else {
							return throwError(
								JwtError.createErrorResponse(
									request,
									'No access token available after waiting for a refresh'
								)
							);
						}
					})
				);
			}

			return this.rawRefreshToken$.pipe(
				take(1),
				switchMap((rawRefreshToken) => {
					const rawToken = JwtToken.stripScheme(
						jwtHeaderValue,
						this.jwtConfiguration.scheme
					);
					const token = JwtToken.from(rawToken);
					const refreshToken = rawRefreshToken ? JwtToken.from(rawRefreshToken) : null;
					const isAccessTokenExpiredOrInvalid = !token || token.isExpired();
					const isRefreshTokenExpiredOrInvalid =
						!refreshToken || refreshToken.isExpired();
					// If we know beforehand that nothing can be done, panic.
					if (
						isAccessTokenExpiredOrInvalid &&
						this.isRawRefreshTokenGetterAvailable &&
						isRefreshTokenExpiredOrInvalid
					) {
						return throwError(
							JwtCannotRefreshError.createErrorResponse(
								request,
								'Both access and refresh tokens are expired'
							)
						);
					}
					// If the conversion would fail, that would handle the same as an expired token
					return (
						isAccessTokenExpiredOrInvalid
							? // If the token is used and is expired, don't even try the request.
							  throwError('Expired token, refresh first')
							: // If it seems okay, try the request
							  next.handle(request)
					).pipe(
						catchError((error: HttpErrorResponse | string) =>
							// If the request failed, or we failed at the precheck
							// Acquire a new token, but only if the error is allowing it
							// If a refresh is already happening, wait for it, and use it's results
							tryJwtRefresh(
								next,
								error,
								this.jwtRefreshConfiguration,
								this.jwtRefreshStateService.refreshLock$,
								(refreshError) =>
									throwError(
										JwtCouldntRefreshError.createErrorResponse(
											request,
											refreshError
										)
									),
								(refreshResponse) =>
									this.handleWithToken(request, next, refreshResponse.accessToken)
							)
						)
					);
				})
			);
		} else {
			return next.handle(request);
		}
	}
}
