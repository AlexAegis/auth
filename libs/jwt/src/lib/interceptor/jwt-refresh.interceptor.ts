import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
	callIfFunction,
	checkAgainstUrlFilter,
	isExpired,
	matchAgainst,
	separateUrl,
} from '../function';
import { HttpMethod, JwtConfiguration, JwtRefreshConfiguration, JwtToken } from '../model';
import { JwtTokenService } from '../service';
import {
	DEFAULT_JWT_CONFIGURATION_TOKEN,
	JWT_CONFIGURATION_TOKEN,
	JWT_REFRESH_CONFIGURATION_TOKEN,
} from '../token';

@Injectable()
export class JwtRefreshInterceptor implements HttpInterceptor {
	public constructor(
		private readonly jwtTokenService: JwtTokenService,
		@Inject(JWT_CONFIGURATION_TOKEN)
		private readonly jwtConfig: JwtConfiguration,
		@Inject(DEFAULT_JWT_CONFIGURATION_TOKEN)
		private readonly defaultJwtConfig: JwtConfiguration,
		@Inject(JWT_REFRESH_CONFIGURATION_TOKEN)
		private readonly refreshConfig: JwtRefreshConfiguration<unknown, unknown>
	) {}

	public intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		console.log('JwtRefreshInterceptor intercepting!', request.url);
		console.log('jwt config and refresh config', this.jwtConfig, this.refreshConfig);
		const [domain, path] = separateUrl(request.url);
		const jwtHeader = request.headers.get(
			this.jwtConfig.header ?? this.defaultJwtConfig.header
		);

		// Only do something if the request is headed towards a protected endpoint.
		// The forRoot method of the module ensures that this interceptor is injected
		// after the token injector interceptor. So by the time this executes, the token should
		// be here.
		// And if the url is not the refresh url itself, and any of the other explicitly
		// filtered urls where refresh is prohibited by config.
		if (
			jwtHeader &&
			!matchAgainst(request.url)(this.refreshConfig.refreshUrl) &&
			!checkAgainstUrlFilter(this.refreshConfig, domain, path)
		) {
			// todo make a function out of this
			const token = jwtHeader.split(
				this.jwtConfig.scheme ?? this.defaultJwtConfig.scheme ?? '\n'
			)[1];
			// If the conversion would fail, that would handle the same as an expired token
			return (isExpired(JwtToken.from(token)?.payload.exp)
				? // If the token is used and is expired, don't even try the request.
				  throwError('Expired token, refresh first')
				: // If it seems okay, try the request
				  next.handle(request)
			).pipe(
				catchError((error) => {
					console.log('outer error', error);
					// If the request failed, or we failed at the precheck
					// Acquire a new token
					const req = new HttpRequest<unknown>(
						this.refreshConfig.method ?? HttpMethod.POST,
						this.refreshConfig.refreshUrl,
						this.refreshConfig.refreshRequestBody(),
						callIfFunction(this.refreshConfig.refreshRequestInitials)
					);
					return next.handle(req).pipe(
						map((response) => this.refreshConfig.transformRefreshResponse(response)),
						tap(({ accessToken, refreshToken }) => {
							console.log(
								'refresh happened, in the interceptor',
								accessToken,
								refreshToken
							);
						}),
						switchMap(() => next.handle(request)),
						catchError((e) => {
							console.log('inner error', e);
							return next.handle(request);
						})
					);
				})
			);
		} else return next.handle(request);
	}
}
