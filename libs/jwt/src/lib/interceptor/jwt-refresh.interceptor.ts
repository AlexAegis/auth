import {
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
	HttpResponse,
} from '@angular/common/http';
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

		const jwtHeaderKey = this.jwtConfig.header ?? this.defaultJwtConfig.header;
		const jwtScheme = this.jwtConfig.scheme ?? this.defaultJwtConfig.scheme ?? '';
		const jwtHeader = request.headers.get(jwtHeaderKey);

		console.log('domain, path', domain, path, jwtHeader);
		console.log(matchAgainst(request.url)(this.refreshConfig.refreshUrl));
		console.log(checkAgainstUrlFilter(this.refreshConfig, domain, path));
		// Only do something if the request is headed towards a protected endpoint.
		// The forRoot method of the module ensures that this interceptor is injected
		// after the token injector interceptor. So by the time this executes, the token should
		// be here.
		// And if the url is not the refresh url itself, and any of the other explicitly
		// filtered urls where refresh is prohibited by config.
		if (
			jwtHeader &&
			!matchAgainst(request.url)(this.refreshConfig.refreshUrl) &&
			checkAgainstUrlFilter(this.refreshConfig, domain, path)
		) {
			// todo make a function out of this
			const token = jwtHeader.split(jwtScheme)[1];
			console.log(
				'asd',
				token,
				JwtToken.from(token),
				isExpired(JwtToken.from(token)?.payload.exp)
			);
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
					const refreshRequest = new HttpRequest<unknown>(
						this.refreshConfig.method ?? HttpMethod.POST,
						this.refreshConfig.refreshUrl,
						this.refreshConfig.refreshRequestBody(),
						callIfFunction(this.refreshConfig.refreshRequestInitials)
					);
					return next.handle(refreshRequest).pipe(
						tap((rrrr) => {
							console.log('refresh happened gre ger ge', rrrr);
						}),
						map((response) => {
							if ((response as HttpResponse<unknown>).body) {
								return this.refreshConfig.transformRefreshResponse(
									(response as HttpResponse<unknown>).body
								);
							} else throw new Error('No body on response');
						}),
						tap(({ accessToken, refreshToken }) => {
							console.log(
								'refresh happened, in the interceptor',
								accessToken,
								refreshToken
							);
						}),
						switchMap((refreshResponse) => {
							this.refreshConfig.setRefreshedTokens(refreshResponse);
							// inject
							const requestWithUpdatedTokens = request.clone({
								headers: request.headers.set(
									jwtHeaderKey,
									jwtScheme + refreshResponse.accessToken
								),
							});
							return next.handle(requestWithUpdatedTokens).pipe(
								// to avoid loops
								catchError((e) => {
									console.log('inner error', e);
									return next.handle(requestWithUpdatedTokens);
								})
							);
						})
					);
				})
			);
		} else return next.handle(request);
	}
}
