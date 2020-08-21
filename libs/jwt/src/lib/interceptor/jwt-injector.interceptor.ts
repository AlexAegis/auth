import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { JwtError } from '../errors';
import { checkAgainstUrlFilter, intoObservable, separateUrl } from '../function';
import { JwtConfiguration } from '../model';
import { DEFAULT_JWT_CONFIGURATION_TOKEN, JWT_CONFIGURATION_TOKEN } from '../token';

@Injectable()
export class JwtInjectorInterceptor implements HttpInterceptor {
	private readonly jwtConfiguration!: JwtConfiguration;

	public constructor(
		@Inject(JWT_CONFIGURATION_TOKEN)
		jwtConfig: JwtConfiguration,
		@Inject(DEFAULT_JWT_CONFIGURATION_TOKEN)
		defaultJwtConfig: JwtConfiguration
	) {
		this.jwtConfiguration = {
			...defaultJwtConfig,
			...jwtConfig,
		};
	}

	public intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		const separatedUrl = separateUrl(request.url);
		return intoObservable(this.jwtConfiguration.getToken).pipe(
			take(1),
			switchMap((token) => {
				if (token && checkAgainstUrlFilter(this.jwtConfiguration, separatedUrl)) {
					let cloned = request.clone({
						headers: request.headers.set(
							this.jwtConfiguration.header,
							this.jwtConfiguration.scheme
								? this.jwtConfiguration.scheme + token
								: token
						),
					});
					if (this.jwtConfiguration.handleWithCredentials) {
						cloned = cloned.clone({
							withCredentials: true,
						});
					}
					return next.handle(cloned).pipe(
						catchError((error) => {
							// Only rethrow as is if already a JwtError
							if (error instanceof JwtError) {
								return throwError(error);
							} else {
								return throwError(new JwtError(cloned, error));
							}
						})
					);
				} else return next.handle(request);
			})
		);
	}
}
