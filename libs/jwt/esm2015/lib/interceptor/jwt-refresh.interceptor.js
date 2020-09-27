import { Inject, Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { JwtCannotRefreshError, JwtCouldntRefreshError } from '../errors/jwt-error.class';
import { checkAgainstUrlFilter } from '../function/check-against-url-filter.function';
import { intoObservable } from '../function/into-observable.function';
import { matchAgainst } from '../function/match-against.function';
import { tryJwtRefresh } from '../function/try-jwt-refresh.function';
import { separateUrl } from '../function/separate-url.function';
import { JwtToken } from '../model/jwt-token.class';
import { DEFAULT_JWT_CONFIGURATION_TOKEN, DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN, JWT_CONFIGURATION_TOKEN, JWT_REFRESH_CONFIGURATION_TOKEN, } from '../token/jwt-configuration.token';
export class JwtRefreshInterceptor {
    constructor(jwtConfig, defaultJwtConfig, refreshConfig, defaultJwtRefreshConfig) {
        var _a;
        this.jwtConfiguration = Object.assign(Object.assign({}, defaultJwtConfig), jwtConfig);
        this.jwtRefreshConfiguration = Object.assign(Object.assign({}, defaultJwtRefreshConfig), refreshConfig);
        this.rawRefreshToken$ = intoObservable((_a = this.jwtRefreshConfiguration.getRefreshToken) !== null && _a !== void 0 ? _a : (() => null));
        this.isRawRefreshTokenGetterAvailable = !!this.jwtRefreshConfiguration.getRefreshToken;
    }
    intercept(request, next) {
        const separatedUrl = separateUrl(request.url);
        const jwtHeaderValue = request.headers.get(this.jwtConfiguration.header);
        // Only do something if the request is headed towards a protected endpoint.
        // The forRoot method of the module ensures that this interceptor is injected
        // after the token injector interceptor. So by the time this executes, the token should
        // be here.
        // And if the url is not the refresh url itself, and any of the other explicitly
        // filtered urls where refresh is prohibited by config.
        if (jwtHeaderValue &&
            !matchAgainst(request.url)(this.jwtRefreshConfiguration.refreshUrl) &&
            checkAgainstUrlFilter(this.jwtRefreshConfiguration, separatedUrl)) {
            return this.rawRefreshToken$.pipe(take(1), switchMap((rawRefreshToken) => {
                const rawToken = JwtToken.stripScheme(jwtHeaderValue, this.jwtConfiguration.scheme);
                const token = JwtToken.from(rawToken);
                const refreshToken = rawRefreshToken ? JwtToken.from(rawRefreshToken) : null;
                const isAccessTokenExpiredOrInvalid = !token || token.isExpired();
                const isRefreshTokenExpiredOrInvalid = !refreshToken || refreshToken.isExpired();
                // If we know beforehand that nothing can be done, panic.
                if (isAccessTokenExpiredOrInvalid &&
                    this.isRawRefreshTokenGetterAvailable &&
                    isRefreshTokenExpiredOrInvalid) {
                    return throwError(JwtCannotRefreshError.createErrorResponse(request, 'Both access and refresh tokens are expired'));
                }
                // If the conversion would fail, that would handle the same as an expired token
                return (isAccessTokenExpiredOrInvalid
                    ? // If the token is used and is expired, don't even try the request.
                        throwError('Expired token, refresh first')
                    : // If it seems okay, try the request
                        next.handle(request)).pipe(catchError((error) => {
                    // If the request failed, or we failed at the precheck
                    // Acquire a new token, but only if the error is allowing it
                    return tryJwtRefresh(next, error, this.jwtRefreshConfiguration, (refreshError) => throwError(JwtCouldntRefreshError.createErrorResponse(request, refreshError)), (refreshResponse) => {
                        const requestWithUpdatedTokens = request.clone({
                            headers: request.headers.set(this.jwtConfiguration.header, this.jwtConfiguration.scheme +
                                refreshResponse.accessToken),
                        });
                        return next.handle(requestWithUpdatedTokens);
                    });
                }));
            }));
        }
        else
            return next.handle(request);
    }
}
JwtRefreshInterceptor.decorators = [
    { type: Injectable }
];
JwtRefreshInterceptor.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [JWT_CONFIGURATION_TOKEN,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [DEFAULT_JWT_CONFIGURATION_TOKEN,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [JWT_REFRESH_CONFIGURATION_TOKEN,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN,] }] }
];
//# sourceMappingURL=jwt-refresh.interceptor.js.map