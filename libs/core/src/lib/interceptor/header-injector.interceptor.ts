import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { from, isObservable, Observable, of } from 'rxjs';
import { isPromise } from '../helper';
import { HeaderConfiguration } from '../model';
import { DefaultHeaderConfigurationToken, HeaderConfigurationToken } from '../token';

@Injectable()
export class HeaderInjectorInterceptor implements HttpInterceptor {
	public constructor(
		@Inject(HeaderConfigurationToken)
		private readonly rawConfigs: HeaderConfiguration[] = [],
		@Inject(DefaultHeaderConfigurationToken)
		private readonly defaultBasicConfigs?: Partial<HeaderConfiguration>[]
	) {}
	public intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		/*const urlMatch = request.url.match(/^(.*:\/\/)?(.*?)(\/(.*))?$/);
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
		);*/
		return next.handle(request);
	}

	private normalizeGetValue(
		getValue:
			| Observable<string | null | undefined>
			| (() =>
					| string
					| null
					| undefined
					| Promise<string | null | undefined>
					| Observable<string | null | undefined>)
	): Observable<string | null | undefined> {
		if (isObservable(getValue)) {
			return getValue;
		} else {
			const result = getValue();
			if (isObservable(result)) return result;
			if (isPromise(result)) return from(result);
			else return of(result);
		}
	}
}
