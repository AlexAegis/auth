import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError, zip } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { JwtTokenService } from '../service';

@Injectable()
export class JwtRefreshInterceptor implements HttpInterceptor {
	public constructor(private readonly jwtTokenService: JwtTokenService) {}

	public intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		console.log('JwtRefreshInterceptor intercepting!');
		//const [domain, path] = JwtInjectorInterceptor.separateUrl(request.url);
		//return this.jwtTokenService.isTokenExpired$.pipe(
		//	switchMap(isExpired => {
		//
		//	})
		//)

		//combineLatest([this.jwtTokenService.config$]).pipe(map(([config]) => {
		//	const isEnabled = JwtInjectorInterceptor.checkAgainstRules(config, domain, path)
		//}));

		// isTokenExpired$ comes from config$, if config$ emits, isTokenExpired$ will too
		return zip(this.jwtTokenService.config$, this.jwtTokenService.isAccessTokenExpired$).pipe(
			switchMap(([config, isTokenExpired]) => {
				// Only handle errors if we are able to do something about it
				if (config.autoRefresher) {
					// Inner chain so config is available for every step without propagating it
					return of(null).pipe(
						switchMap(() => {
							// Only pre-check if a token is injected (This interceptor comes after the other
							// because it is provided later)
							// This way it can be avoided to check the enabled paths twice in both interceptor
							if (request.headers.has(config.header) && isTokenExpired) {
								// If the token is used and is expired, don't even try the request. Fail fast
								return throwError('Expired token, refresh first');
							} else {
								// If it seems okay, try the request
								return next.handle(request);
							}
						}),
						catchError((error) => {
							console.log('error', error);
							// If the request failed, or we failed at the precheck
							// Acquire a new token

							return config.autoRefresher!.refresh().pipe(
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
				} else {
					return next.handle(request);
				}
			})
		);
	}
}
