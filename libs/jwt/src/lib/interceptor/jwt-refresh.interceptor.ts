import {
	HttpErrorResponse,
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';
import { JwtCannotRefreshError, JwtCouldntRefreshError } from '../errors';
import {
	callWhenFunction,
	checkAgainstHttpErrorFilter,
	checkAgainstUrlFilter,
	intoObservable,
	isHttpResponse,
	matchAgainst,
	separateUrl,
} from '../function';
import { JwtConfiguration, JwtRefreshConfiguration, JwtToken } from '../model';
import {
	DEFAULT_JWT_CONFIGURATION_TOKEN,
	DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN,
	JWT_CONFIGURATION_TOKEN,
	JWT_REFRESH_CONFIGURATION_TOKEN,
} from '../token';

@Injectable()
export class JwtRefreshInterceptor implements HttpInterceptor {
	private readonly jwtConfiguration!: JwtConfiguration;
	private readonly jwtRefreshConfiguration!: JwtRefreshConfiguration<unknown, unknown>;
	private readonly rawRefreshToken$: Observable<string | null | undefined>;
	private readonly isRawRefreshTokenGetterAvailable: boolean;

	public constructor(
		@Inject(JWT_CONFIGURATION_TOKEN)
		jwtConfig: JwtConfiguration,
		@Inject(DEFAULT_JWT_CONFIGURATION_TOKEN)
		defaultJwtConfig: JwtConfiguration,
		@Inject(JWT_REFRESH_CONFIGURATION_TOKEN)
		refreshConfig: JwtRefreshConfiguration<unknown, unknown>,
		@Inject(DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN)
		defaultJwtRefreshConfig: JwtRefreshConfiguration<unknown, unknown>
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
					return (isAccessTokenExpiredOrInvalid
						? // If the token is used and is expired, don't even try the request.
						  throwError('Expired token, refresh first')
						: // If it seems okay, try the request
						  next.handle(request)
					).pipe(
						catchError((error: HttpErrorResponse | string) => {
							// If the request failed, or we failed at the precheck
							// Acquire a new token, but only if the error is allowing it

							const isRefreshAllowed =
								typeof error === 'string' ||
								checkAgainstHttpErrorFilter(this.jwtRefreshConfiguration, error);
							if (isRefreshAllowed) {
								return intoObservable(
									this.jwtRefreshConfiguration.createRefreshRequestBody
								).pipe(
									take(1),
									switchMap((requestBody) => {
										const refreshRequest = new HttpRequest<unknown>(
											this.jwtRefreshConfiguration.method ?? 'POST',
											this.jwtRefreshConfiguration.refreshUrl,
											requestBody,
											callWhenFunction(
												this.jwtRefreshConfiguration.refreshRequestInitials
											)
										);
										return next.handle(refreshRequest).pipe(
											filter(isHttpResponse),
											catchError((refreshError) =>
												throwError(
													JwtCouldntRefreshError.createErrorResponse(
														request,
														refreshError
													)
												)
											),
											map((response) =>
												this.jwtRefreshConfiguration.transformRefreshResponse(
													response.body
												)
											),
											switchMap((refreshResponse) => {
												this.jwtRefreshConfiguration.setRefreshedTokens(
													refreshResponse
												);
												// inject the new tokens
												const requestWithUpdatedTokens = request.clone({
													headers: request.headers.set(
														this.jwtConfiguration.header,
														this.jwtConfiguration.scheme +
															refreshResponse.accessToken
													),
												});
												return next.handle(requestWithUpdatedTokens);
											})
										);
									})
								);
							} else return throwError(error);
						})
					);
				})
			);
		} else return next.handle(request);
	}
}
