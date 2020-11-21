import { Inject, Injectable, Optional } from '@angular/core';
import { throwError } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { JwtError } from '../errors/jwt-error.class';
import { checkAgainstUrlFilter } from '../function/check-against-url-filter.function';
import { intoObservable } from '../function/into-observable.function';
import { separateUrl } from '../function/separate-url.function';
import { JwtToken } from '../model/jwt-token.class';
import { DEFAULT_JWT_CONFIGURATION_TOKEN, DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN, JWT_CONFIGURATION_TOKEN, JWT_REFRESH_CONFIGURATION_TOKEN, } from '../token/jwt-configuration.token';
export class JwtInjectorInterceptor {
    constructor(jwtConfig, defaultJwtConfig, refreshConfig, defaultJwtRefreshConfig) {
        this.jwtConfiguration = Object.assign(Object.assign({}, defaultJwtConfig), jwtConfig);
        this.jwtRefreshConfiguration = refreshConfig &&
            defaultJwtRefreshConfig && Object.assign(Object.assign({}, defaultJwtRefreshConfig), refreshConfig);
    }
    intercept(request, next) {
        const separatedUrl = separateUrl(request.url);
        return intoObservable(this.jwtConfiguration.getToken).pipe(take(1), switchMap((rawToken) => {
            if (checkAgainstUrlFilter(this.jwtConfiguration, separatedUrl)) {
                const token = rawToken && JwtToken.from(rawToken);
                const isAccessTokenExpiredOrInvalid = !token || token.isExpired();
                // If there is a token to inject
                if (rawToken &&
                    (!isAccessTokenExpiredOrInvalid || this.jwtRefreshConfiguration)) {
                    let cloned = request.clone({
                        headers: request.headers.set(this.jwtConfiguration.header, this.jwtConfiguration.scheme
                            ? this.jwtConfiguration.scheme + rawToken
                            : rawToken),
                    });
                    if (this.jwtConfiguration.handleWithCredentials) {
                        cloned = cloned.clone({
                            withCredentials: true,
                        });
                    }
                    return next.handle(cloned);
                }
                else {
                    return throwError(JwtError.createErrorResponse(request, 'Token is expired or invalid, and refresh is not configured.'));
                }
            }
            else {
                return next.handle(request);
            }
        }));
    }
}
JwtInjectorInterceptor.decorators = [
    { type: Injectable }
];
JwtInjectorInterceptor.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [JWT_CONFIGURATION_TOKEN,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [DEFAULT_JWT_CONFIGURATION_TOKEN,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [JWT_REFRESH_CONFIGURATION_TOKEN,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN,] }] }
];
//# sourceMappingURL=jwt-injector.interceptor.js.map