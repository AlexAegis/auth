import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { matchAgainst } from '../function';
import { JwtConfiguration } from '../model';
import { JwtTokenService } from '../service';

@Injectable()
export class JwtInjectorInterceptor implements HttpInterceptor {
	public constructor(private readonly jwtTokenService: JwtTokenService) {}

	private static checkAgainstRules(
		config: JwtConfiguration,
		domain?: string,
		path?: string
	): boolean {
		const domainWhitelistRulesPass = config.domainWhitelist?.some(matchAgainst(domain)) ?? true;

		const domainBlacklistRulesPass =
			!config.domainBlacklist?.some(matchAgainst(domain)) ?? true;

		const pathWhitelistRulesPass = config.pathWhitelist?.some(matchAgainst(path)) ?? true;

		const pathBlacklistRulesPass = !config.pathBlacklist?.some(matchAgainst(path)) ?? true;

		return (
			domainWhitelistRulesPass &&
			domainBlacklistRulesPass &&
			pathWhitelistRulesPass &&
			pathBlacklistRulesPass
		);
	}

	public intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		const urlMatch = request.url.match(/^(.*:\/\/)?(.*?)(\/(.*))?$/);
		const domain = urlMatch?.[2];
		const path = urlMatch?.[4];

		return combineLatest([
			this.jwtTokenService.tokenString$,
			this.jwtTokenService.config$,
		]).pipe(
			take(1),
			switchMap(([token, config]) => {
				if (token && JwtInjectorInterceptor.checkAgainstRules(config, domain, path)) {
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
