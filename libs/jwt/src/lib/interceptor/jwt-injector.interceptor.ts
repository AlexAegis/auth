import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { JwtError } from '../errors/jwt-error.class';
import { checkAgainstUrlFilter } from '../function/check-against-url-filter.function';
import { intoObservable } from '../function/into-observable.function';
import { separateUrl } from '../function/separate-url.function';
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

@Injectable()
export class JwtInjectorInterceptor implements HttpInterceptor {
	private readonly jwtConfiguration!: JwtConfiguration;
	private readonly jwtRefreshConfiguration?: JwtRefreshConfiguration<unknown, unknown>;

	public constructor(
		@Inject(JWT_CONFIGURATION_TOKEN)
		jwtConfig: JwtConfiguration,
		@Inject(DEFAULT_JWT_CONFIGURATION_TOKEN)
		defaultJwtConfig: JwtConfiguration,
		@Optional()
		@Inject(JWT_REFRESH_CONFIGURATION_TOKEN)
		refreshConfig?: JwtRefreshConfiguration<unknown, unknown>,
		@Optional()
		@Inject(DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN)
		defaultJwtRefreshConfig?: JwtRefreshConfiguration<unknown, unknown>,
	) {
		this.jwtConfiguration = {
			...defaultJwtConfig,
			...jwtConfig,
		};

		this.jwtRefreshConfiguration = refreshConfig &&
			defaultJwtRefreshConfig && {
				...defaultJwtRefreshConfig,
				...refreshConfig,
			};
	}

	public intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler,
	): Observable<HttpEvent<unknown>> {
		const separatedUrl = separateUrl(request.url);
		return intoObservable(this.jwtConfiguration.getToken).pipe(
			take(1),
			switchMap((rawToken) => {
				if (checkAgainstUrlFilter(this.jwtConfiguration, separatedUrl)) {
					const token = rawToken && JwtToken.from(rawToken);
					const isAccessTokenExpiredOrInvalid = !token || token.isExpired();
					// If there is a token to inject
					if (
						rawToken &&
						(!isAccessTokenExpiredOrInvalid || this.jwtRefreshConfiguration)
					) {
						let cloned = request.clone({
							headers: request.headers.set(
								this.jwtConfiguration.header,
								this.jwtConfiguration.scheme
									? this.jwtConfiguration.scheme + rawToken
									: rawToken,
							),
						});
						if (this.jwtConfiguration.handleWithCredentials) {
							cloned = cloned.clone({
								withCredentials: true,
							});
						}
						return next.handle(cloned);
					} else {
						return throwError(
							JwtError.createErrorResponse(
								request,
								'Token is expired or invalid, and refresh is not configured.',
							),
						);
					}
				} else {
					return next.handle(request);
				}
			}),
		);
	}
}
