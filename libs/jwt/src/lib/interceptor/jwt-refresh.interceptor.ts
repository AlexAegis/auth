import {
	HttpErrorResponse,
	HttpEvent,
	HttpEventType,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
	HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import {
	callWhenFunction,
	checkAgainstHttpErrorFilter,
	checkAgainstUrlFilter,
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
	}

	public intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		const separatedUrl = separateUrl(request.url);
		const jwtHeader = request.headers.get(this.jwtConfiguration.header);

		// Only do something if the request is headed towards a protected endpoint.
		// The forRoot method of the module ensures that this interceptor is injected
		// after the token injector interceptor. So by the time this executes, the token should
		// be here.
		// And if the url is not the refresh url itself, and any of the other explicitly
		// filtered urls where refresh is prohibited by config.
		if (
			jwtHeader &&
			!matchAgainst(request.url)(this.jwtRefreshConfiguration.refreshUrl) &&
			checkAgainstUrlFilter(this.jwtRefreshConfiguration, separatedUrl)
		) {
			// todo make a function out of this
			const rawToken = jwtHeader.substring((this.jwtConfiguration.scheme ?? '').length);
			const token = JwtToken.from(rawToken);
			// If the conversion would fail, that would handle the same as an expired token
			return (!token || token.isExpired()
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
						const refreshRequest = new HttpRequest<unknown>(
							this.jwtRefreshConfiguration.method ?? 'POST',
							this.jwtRefreshConfiguration.refreshUrl,
							this.jwtRefreshConfiguration.createRefreshRequestBody(),
							callWhenFunction(this.jwtRefreshConfiguration.refreshRequestInitials)
						);
						return next.handle(refreshRequest).pipe(
							filter(
								(r): r is HttpResponse<unknown> => r.type === HttpEventType.Response
							),
							map((response) =>
								this.jwtRefreshConfiguration.transformRefreshResponse(response.body)
							),
							switchMap((refreshResponse) => {
								this.jwtRefreshConfiguration.setRefreshedTokens(refreshResponse);
								// inject the new tokens
								const requestWithUpdatedTokens = request.clone({
									headers: request.headers.set(
										this.jwtConfiguration.header,
										this.jwtConfiguration.scheme + refreshResponse.accessToken
									),
								});
								return next.handle(requestWithUpdatedTokens);
							})
						);
					} else return throwError(error);
				})
			);
		} else return next.handle(request);
	}
}
