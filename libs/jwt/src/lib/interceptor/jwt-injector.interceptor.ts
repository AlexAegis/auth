import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { checkAgainstUrlFilter, separateUrl } from '../function';
import { JwtTokenService } from '../service';

@Injectable()
export class JwtInjectorInterceptor implements HttpInterceptor {
	public constructor(private readonly jwtTokenService: JwtTokenService) {}

	public intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		const separatedUrl = separateUrl(request.url);
		return combineLatest([
			this.jwtTokenService.rawAccessToken$,
			this.jwtTokenService.jwtConfig$,
		]).pipe(
			take(1),
			switchMap(([token, config]) => {
				if (token && checkAgainstUrlFilter(config, separatedUrl)) {
					let cloned = request.clone({
						headers: request.headers.set(
							config.header,
							config.scheme ? config.scheme + token : token
						),
					});
					if (config.handleWithCredentials) {
						cloned = cloned.clone({
							withCredentials: true,
						});
					}
					return next.handle(cloned);
				} else return next.handle(request);
			})
		);
	}
}
