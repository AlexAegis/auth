import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, take, withLatestFrom } from 'rxjs/operators';
import { matchAgainst } from '../helper';
import { JwtTokenService } from '../service';

@Injectable()
export class TokenInjectorInterceptor implements HttpInterceptor {
	public constructor(private readonly jwtTokenService: JwtTokenService) {}
	public intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		const urlMatch = request.url.match(/^(.*:\/\/)?(.*?)(\/(.*))?$/);
		const domain = urlMatch?.[2];
		const path = urlMatch?.[4];

		return this.jwtTokenService.tokenString$.pipe(
			take(1),
			withLatestFrom(this.jwtTokenService.config$),
			switchMap(([token, config]) => {
				const domainWhitelistRulesPass =
					config.domainWhitelist?.some(matchAgainst(domain)) ?? true;

				const domainBlacklistRulesPass =
					!config.domainBlacklist?.some(matchAgainst(domain)) ?? true;

				const pathWhitelistRulesPass =
					config.pathWhitelist?.some(matchAgainst(path)) ?? true;

				const pathBlacklistRulesPass =
					!config.pathBlacklist?.some(matchAgainst(path)) ?? true;

				if (
					token &&
					domainWhitelistRulesPass &&
					domainBlacklistRulesPass &&
					pathWhitelistRulesPass &&
					pathBlacklistRulesPass
				) {
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
