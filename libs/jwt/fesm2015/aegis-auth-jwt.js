import { InjectionToken, ɵɵdefineInjectable, ɵɵinject, Injectable, Inject, Optional, NgModule } from '@angular/core';
import { BehaviorSubject, throwError, isObservable, of, from, merge, timer } from 'rxjs';
import { switchMap, mapTo, filter, map, tap, mergeMap, catchError, take } from 'rxjs/operators';
import { HttpErrorResponse, HttpEventType, HttpRequest, HttpHandler, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Router } from '@angular/router';
import { Base64 } from 'js-base64';
import { CommonModule } from '@angular/common';

/**
 *
 * @param unixTimestamp seconds from the unix epoch 1970-01-01T00:00:00Z
 * if not supplied it will always be expired
 */
const isUnixTimestampExpired = (unixTimestamp = -Infinity) => unixTimestamp < Math.floor(new Date().getTime() / 1000);

const DEFAULT_HEADER_CONFIG = {
    getValue: new BehaviorSubject(null),
};

const DEFAULT_JWT_HEADER = 'Authorization';
const DEFAULT_JWT_SCHEME = 'Bearer ';
const DEFAULT_JWT_CONFIG = Object.assign(Object.assign({}, DEFAULT_HEADER_CONFIG), { header: DEFAULT_JWT_HEADER, scheme: DEFAULT_JWT_SCHEME, handleWithCredentials: true });
const DEFAULT_JWT_REFRESH_CONFIG_DEFAULT_AUTO_IN_GUARD = true;
const DEFAULT_JWT_REFRESH_CONFIG = {
    method: 'POST',
    errorCodeWhitelist: [401],
    isAutoRefreshAllowedInLoginGuardByDefault: DEFAULT_JWT_REFRESH_CONFIG_DEFAULT_AUTO_IN_GUARD,
};

class JwtError extends Error {
    constructor(originalRequest, originalError, message = JwtError.type) {
        super(message);
        this.originalRequest = originalRequest;
        this.originalError = originalError;
    }
    static createErrorResponse(request, refreshError) {
        return new HttpErrorResponse({
            error: JwtError.createErrorEvent(request, refreshError),
        });
    }
    static createErrorEvent(request, refreshError) {
        return new ErrorEvent(JwtError.type, {
            error: new JwtError(request, refreshError),
        });
    }
}
JwtError.type = 'JWT_ERROR';
/**
 * When both access and refresh tokens are either invalid or expired!
 */
class JwtCannotRefreshError extends JwtError {
    constructor(originalRequest, originalError) {
        super(originalRequest, originalError, JwtCannotRefreshError.type);
        this.originalRequest = originalRequest;
        this.originalError = originalError;
    }
    static createErrorResponse(request, refreshError) {
        return new HttpErrorResponse({
            error: JwtCannotRefreshError.createErrorEvent(request, refreshError),
        });
    }
    static createErrorEvent(request, refreshError) {
        return new ErrorEvent(JwtCannotRefreshError.type, {
            error: new JwtCannotRefreshError(request, refreshError),
        });
    }
}
JwtCannotRefreshError.type = 'JWT_CANNOT_REFRESH_ERROR';
/**
 * When refresh failed
 */
class JwtCouldntRefreshError extends JwtError {
    constructor(originalRequest, originalError) {
        super(originalRequest, originalError, JwtCouldntRefreshError.type);
        this.originalRequest = originalRequest;
        this.originalError = originalError;
    }
    static createErrorResponse(request, refreshError) {
        return new HttpErrorResponse({
            error: JwtCouldntRefreshError.createErrorEvent(request, refreshError),
        });
    }
    static createErrorEvent(request, refreshError) {
        return new ErrorEvent(JwtCouldntRefreshError.type, {
            error: new JwtCouldntRefreshError(request, refreshError),
        });
    }
}
JwtCouldntRefreshError.type = 'JWT_COULDNT_REFRESH_ERROR';

const isString = (stringLike) => typeof stringLike === 'string';

/**
 * Jwt failures are handled by either calling a callback or if its a string,
 * redirect
 *
 * @internal
 */
const handleJwtFailure = (errorCallbackOrRedirect, error, router, redirectParameters) => {
    if (isString(errorCallbackOrRedirect)) {
        if (router) {
            let queryParams = redirectParameters;
            if (typeof redirectParameters === 'function') {
                queryParams = redirectParameters(error);
            }
            router.navigate([errorCallbackOrRedirect], {
                queryParams,
            });
        }
        else {
            // This error is intended to surface as it's a configuration problem
            throw new Error('JWT Refresh configuration error! ' +
                '`onFailure` is defined as a string, but the ' +
                'Router is not available! Is @angular/router ' +
                'installed and the RouterModule imported?');
        }
    }
    else {
        errorCallbackOrRedirect(error);
    }
};

const isNotNullish = (t) => t !== undefined && t !== null;

const handleJwtError = (wrappedError, jwtConfiguration, jwtRefreshConfiguration, router) => {
    var _a;
    const error = (_a = wrappedError.error) === null || _a === void 0 ? void 0 : _a.error;
    if (error instanceof JwtCannotRefreshError || error instanceof JwtCouldntRefreshError) {
        if (jwtRefreshConfiguration && isNotNullish(jwtRefreshConfiguration.onFailure)) {
            handleJwtFailure(jwtRefreshConfiguration.onFailure, error, router, jwtRefreshConfiguration.onFailureRedirectParameters);
        }
        // Rethrow the inner error, so observers of the user can see it
        return throwError(error);
    }
    else if (error instanceof JwtError) {
        if (isNotNullish(jwtConfiguration.onFailure)) {
            handleJwtFailure(jwtConfiguration.onFailure, error, router, jwtConfiguration.onFailureRedirectParameters);
        }
        return throwError(error);
    }
    else {
        // Other errors are left untreated
        return throwError(wrappedError);
    }
};

const isFunction = (funlike) => typeof funlike === 'function';

/**
 * Returns true if the object is truthy and has a `then` and a `catch` function.
 * Using `instanceof` would not be sufficient as Promises can be contructed
 * in many ways, and it's just a specification.
 */
const isPromise = (promiseLike) => promiseLike &&
    typeof promiseLike.then === 'function' &&
    typeof promiseLike.catch === 'function';

/**
 * Returns a cold observable from a function, or returns an observable if
 * one is directly passed to it
 */
const intoObservable = (getValue) => {
    if (isObservable(getValue)) {
        return getValue;
    }
    else if (isFunction(getValue)) {
        return of(null).pipe(switchMap(() => {
            const result = getValue();
            if (isObservable(result)) {
                return result;
            }
            if (isPromise(result)) {
                return from(result);
            }
            else {
                return of(result);
            }
        }));
    }
    else if (isPromise(getValue)) {
        return from(getValue);
    }
    else {
        return of(getValue);
    }
};

/**
 * It returns an observable which emits instantly a boolean describing if the
 * timestamp is expired or not. If not, it will emit a second time when it
 * will expire.
 *
 * @param timestamp milliseconds
 */
const isTimestampExpiredNowAndWhenItIs = (timestamp) => {
    // If already expired, just return that
    if (timestamp - new Date().getTime() < 0) {
        return of(true);
    }
    else {
        // If not, return that is not and a timer that will emit when it does
        return merge(of(false), timer(new Date(timestamp)).pipe(mapTo(true)));
    }
};

/**
 * It returns an observable which emits instantly a boolean describing if the
 * timestamp is expired or not. If not, it will emit a second time when it
 * will expire.
 *
 * @param unixTimestamp seconds from the unix epoch 1970-01-01T00:00:00Z
 * if not supplied it will always be expired
 */
const isUnixTimestampExpiredNowAndWhenItIs = (unixTimestamp) => isTimestampExpiredNowAndWhenItIs(Math.floor(unixTimestamp * 1000));

/**
 * Matches the filter against an error response. Non-existend rulesets
 * automatically pass. **Empty whitelist rulesets never pass.** Empty blacklist
 * rulesets always pass.
 */
const checkAgainstHttpErrorFilter = (httpErrorFilter, error) => {
    var _a, _b, _c;
    const statusMatcher = (code) => code === error.status;
    const errorCodeWhitelistRulesPass = (_b = (_a = httpErrorFilter.errorCodeWhitelist) === null || _a === void 0 ? void 0 : _a.some(statusMatcher)) !== null && _b !== void 0 ? _b : true;
    const errorCodeBlacklistRulesPass = !((_c = httpErrorFilter.errorCodeBlacklist) === null || _c === void 0 ? void 0 : _c.some(statusMatcher));
    return errorCodeWhitelistRulesPass && errorCodeBlacklistRulesPass;
};

const callWhenFunction = (functionLike) => {
    let result;
    if (isFunction(functionLike)) {
        result = functionLike();
    }
    else {
        result = functionLike;
    }
    return result;
};

const isHttpResponse = (httpEvent) => httpEvent.type === HttpEventType.Response;

const doJwtRefresh = (next, requestBody, jwtRefreshConfiguration, onError, originalAction) => {
    var _a;
    const refreshRequest = new HttpRequest((_a = jwtRefreshConfiguration.method) !== null && _a !== void 0 ? _a : 'POST', jwtRefreshConfiguration.refreshUrl, requestBody, callWhenFunction(jwtRefreshConfiguration.refreshRequestInitials));
    return next.handle(refreshRequest).pipe(filter(isHttpResponse), map((response) => jwtRefreshConfiguration.transformRefreshResponse(response.body)), tap((refreshResponse) => jwtRefreshConfiguration.setRefreshedTokens(refreshResponse)), mergeMap((refreshResponse) => originalAction(refreshResponse)), catchError(onError));
};

const tryJwtRefresh = (next, originalError, jwtRefreshConfiguration, onError, originalAction) => {
    const isRefreshAllowed = typeof originalError === 'string' ||
        checkAgainstHttpErrorFilter(jwtRefreshConfiguration, originalError);
    if (isRefreshAllowed) {
        return intoObservable(jwtRefreshConfiguration.createRefreshRequestBody).pipe(take(1), switchMap((requestBody) => {
            if (requestBody) {
                return doJwtRefresh(next, requestBody, jwtRefreshConfiguration, onError, originalAction);
            }
            else {
                return onError(originalError);
            }
        }));
    }
    else {
        return throwError(originalError);
    }
};

/**
 *
 * @param str json encoded in Base64
 */
const decodeJsonLikeBase64 = (str) => {
    try {
        return JSON.parse(Base64.decode(str));
    }
    catch (error) {
        console.error('Invalid Jsonlike Base64 string', error);
        return null;
    }
};

class JwtToken {
    constructor(header, payload, signature) {
        this.header = header;
        this.payload = payload;
        this.signature = signature;
    }
    static from(token) {
        const convertedSegments = JwtToken.splitTokenString(token);
        if (!convertedSegments) {
            return null;
        }
        const header = decodeJsonLikeBase64(convertedSegments[0]);
        const payload = decodeJsonLikeBase64(convertedSegments[1]);
        const signature = Base64.decode(convertedSegments[2]); // Not used, only for validation
        if (!header || !payload || !signature) {
            return null;
        }
        return new JwtToken(header, payload, signature);
    }
    static stripScheme(jwtHeaderValue, scheme) {
        return jwtHeaderValue.substring((scheme !== null && scheme !== void 0 ? scheme : '').length);
    }
    static splitTokenString(token, separator = JwtToken.JWT_TOKEN_SEPARATOR) {
        const spl = token.split(separator);
        if (spl.length !== 3) {
            return null;
        }
        return spl;
    }
    isExpired() {
        return isUnixTimestampExpired(this.payload.exp);
    }
}
JwtToken.JWT_TOKEN_SEPARATOR = '.';

const JWT_CONFIGURATION_TOKEN = new InjectionToken('AegisJwtConfiguration');
const DEFAULT_JWT_CONFIGURATION_TOKEN = new InjectionToken('DefaultAegisJwtConfiguration');
const JWT_REFRESH_CONFIGURATION_TOKEN = new InjectionToken('AegisJwtRefreshConfiguration');
const DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN = new InjectionToken('DefaultAegisJwtRefreshConfiguration');

class JwtTokenService {
    constructor(httpHandler, rawConfig, rawDefaultConfig, rawDefaultRefreshConfig, rawRefreshConfig, router) {
        var _a;
        this.httpHandler = httpHandler;
        this.rawConfig = rawConfig;
        this.rawDefaultConfig = rawDefaultConfig;
        this.rawDefaultRefreshConfig = rawDefaultRefreshConfig;
        this.rawRefreshConfig = rawRefreshConfig;
        this.router = router;
        this.config = Object.assign(Object.assign({}, this.rawDefaultConfig), this.rawConfig);
        this.refreshConfig = this.rawDefaultRefreshConfig && this.rawRefreshConfig
            ? Object.assign(Object.assign({}, this.rawDefaultRefreshConfig), this.rawRefreshConfig) : undefined;
        /**
         * Consider restricting getToken to observables only so things can be cached
         */
        this.rawAccessToken$ = intoObservable(this.config.getToken);
        this.rawRefreshToken$ = ((_a = this.refreshConfig) === null || _a === void 0 ? void 0 : _a.getRefreshToken) ? intoObservable(this.refreshConfig.getRefreshToken)
            : of(null);
        this.accessToken$ = this.rawAccessToken$.pipe(map((token) => {
            if (isString(token)) {
                const jwtToken = JwtToken.from(token);
                if (!jwtToken) {
                    throw new Error('Non-valid token observed');
                }
                else {
                    return jwtToken;
                }
            }
            else {
                return null;
            }
        }));
        this.refreshToken$ = this.rawRefreshToken$.pipe(map((refreshToken) => {
            if (isString(refreshToken)) {
                const jwtToken = JwtToken.from(refreshToken);
                if (!jwtToken) {
                    throw new Error('Non-valid token observed');
                }
                else {
                    return jwtToken;
                }
            }
            else {
                return null;
            }
        }));
        this.accessTokenHeader$ = this.accessToken$.pipe(map((token) => { var _a; return (_a = token === null || token === void 0 ? void 0 : token.header) !== null && _a !== void 0 ? _a : null; }));
        this.accessTokenPayload$ = this.accessToken$.pipe(map((token) => { var _a; return (_a = token === null || token === void 0 ? void 0 : token.payload) !== null && _a !== void 0 ? _a : null; }));
        this.refreshTokenHeader$ = this.refreshToken$.pipe(map((token) => { var _a; return (_a = token === null || token === void 0 ? void 0 : token.header) !== null && _a !== void 0 ? _a : null; }));
        this.refreshTokenPayload$ = this.refreshToken$.pipe(map((token) => { var _a; return (_a = token === null || token === void 0 ? void 0 : token.payload) !== null && _a !== void 0 ? _a : null; }));
        this.isAccessTokenExpired$ = this.accessToken$.pipe(switchMap((token) => token ? isUnixTimestampExpiredNowAndWhenItIs(token.payload.exp) : of(null)));
        this.isRefreshTokenExpired$ = this.refreshToken$.pipe(switchMap((token) => token ? isUnixTimestampExpiredNowAndWhenItIs(token.payload.exp) : of(null)));
        this.isAccessTokenValid$ = this.isAccessTokenExpired$.pipe(map((isExpired) => isNotNullish(isExpired) && !isExpired));
        this.isRefreshTokenValid$ = this.isRefreshTokenExpired$.pipe(map((isExpired) => isNotNullish(isExpired) && !isExpired));
    }
    /**
     * Does a token refresh. Emits false if it failed, or true if succeeded.
     */
    manualRefresh() {
        if (this.refreshConfig) {
            return tryJwtRefresh(this.httpHandler, 'Access token not valid on guard activation', this.refreshConfig, (refreshError) => handleJwtError(JwtCouldntRefreshError.createErrorResponse(undefined, refreshError), this.config, this.refreshConfig, this.router).pipe(catchError(() => of(false))), () => of(true));
        }
        else {
            return of(false);
        }
    }
}
JwtTokenService.ɵprov = ɵɵdefineInjectable({ factory: function JwtTokenService_Factory() { return new JwtTokenService(ɵɵinject(HttpHandler), ɵɵinject(JWT_CONFIGURATION_TOKEN), ɵɵinject(DEFAULT_JWT_CONFIGURATION_TOKEN), ɵɵinject(DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN, 8), ɵɵinject(JWT_REFRESH_CONFIGURATION_TOKEN, 8), ɵɵinject(Router, 8)); }, token: JwtTokenService, providedIn: "root" });
JwtTokenService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
JwtTokenService.ctorParameters = () => [
    { type: HttpHandler },
    { type: undefined, decorators: [{ type: Inject, args: [JWT_CONFIGURATION_TOKEN,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [DEFAULT_JWT_CONFIGURATION_TOKEN,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN,] }, { type: Optional }] },
    { type: undefined, decorators: [{ type: Inject, args: [JWT_REFRESH_CONFIGURATION_TOKEN,] }, { type: Optional }] },
    { type: Router, decorators: [{ type: Optional }] }
];

class LoginGuard {
    constructor(jwtTokenService) {
        this.jwtTokenService = jwtTokenService;
        this.isAccessTokenValidOnce$ = this.jwtTokenService.isAccessTokenValid$.pipe(take(1));
    }
    canActivate(route, _state) {
        const data = route.data;
        return this.isValid(data === null || data === void 0 ? void 0 : data.isRefreshAllowed);
    }
    canActivateChild(childRoute, _state) {
        const data = childRoute.data;
        return this.isValid(data === null || data === void 0 ? void 0 : data.isRefreshAllowed);
    }
    canLoad(route, _segments) {
        const data = route.data;
        return this.isValid(data === null || data === void 0 ? void 0 : data.isRefreshAllowed);
    }
    isValid(isRefreshAllowed) {
        var _a, _b;
        const allowed = (_b = isRefreshAllowed !== null && isRefreshAllowed !== void 0 ? isRefreshAllowed : (_a = this.jwtTokenService.refreshConfig) === null || _a === void 0 ? void 0 : _a.isAutoRefreshAllowedInLoginGuardByDefault) !== null && _b !== void 0 ? _b : DEFAULT_JWT_REFRESH_CONFIG_DEFAULT_AUTO_IN_GUARD;
        return this.isAccessTokenValidOnce$.pipe(switchMap((isValid) => {
            if (!isValid && allowed) {
                return this.jwtTokenService.manualRefresh();
            }
            else {
                return of(isValid);
            }
        }));
    }
}
LoginGuard.ɵprov = ɵɵdefineInjectable({ factory: function LoginGuard_Factory() { return new LoginGuard(ɵɵinject(JwtTokenService)); }, token: LoginGuard, providedIn: "root" });
LoginGuard.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
LoginGuard.ctorParameters = () => [
    { type: JwtTokenService }
];

/**
 * If configured, handles authentication errors with custom callbacks
 * or redirects
 */
class JwtErrorHandlingInterceptor {
    constructor(jwtConfig, defaultJwtConfig, refreshConfig, defaultJwtRefreshConfig, router) {
        this.router = router;
        this.jwtConfiguration = Object.assign(Object.assign({}, defaultJwtConfig), jwtConfig);
        this.jwtRefreshConfiguration =
            defaultJwtRefreshConfig && refreshConfig
                ? Object.assign(Object.assign({}, defaultJwtRefreshConfig), refreshConfig) : undefined;
    }
    intercept(request, next) {
        return next
            .handle(request)
            .pipe(catchError((errorResponse) => handleJwtError(errorResponse, this.jwtConfiguration, this.jwtRefreshConfiguration, this.router)));
    }
}
JwtErrorHandlingInterceptor.decorators = [
    { type: Injectable }
];
JwtErrorHandlingInterceptor.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [JWT_CONFIGURATION_TOKEN,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [DEFAULT_JWT_CONFIGURATION_TOKEN,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [JWT_REFRESH_CONFIGURATION_TOKEN,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN,] }] },
    { type: Router, decorators: [{ type: Optional }] }
];

const matchRule = (rule, against) => {
    if (isString(rule)) {
        return rule === against;
    }
    else if (against) {
        return rule.test(against);
    }
    else {
        return false;
    }
};
/**
 *
 * @param inverse easy negating when composing
 */
const matchAgainst = (against, inverse = false) => (rule) => (inverse ? !matchRule(rule, against) : matchRule(rule, against));

/**
 * Matches the filter against a separated url. Non-existend rulesets
 * automatically pass. **Empty whitelist rulesets never pass.** Empty blacklist
 * rulesets always pass.
 */
const checkAgainstUrlFilter = (urlFilter, { domain, path, protocol }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const protocolMatcher = matchAgainst(protocol);
    const domainMatcher = matchAgainst(domain);
    const pathMatcher = matchAgainst(path);
    const protocolWhitelistRulesPass = (_b = (_a = urlFilter.protocolWhitelist) === null || _a === void 0 ? void 0 : _a.some(protocolMatcher)) !== null && _b !== void 0 ? _b : true;
    const protocolBlacklistRulesPass = !((_c = urlFilter.protocolBlacklist) === null || _c === void 0 ? void 0 : _c.some(protocolMatcher));
    const domainWhitelistRulesPass = (_e = (_d = urlFilter.domainWhitelist) === null || _d === void 0 ? void 0 : _d.some(domainMatcher)) !== null && _e !== void 0 ? _e : true;
    const domainBlacklistRulesPass = !((_f = urlFilter.domainBlacklist) === null || _f === void 0 ? void 0 : _f.some(domainMatcher));
    const pathWhitelistRulesPass = (_h = (_g = urlFilter.pathWhitelist) === null || _g === void 0 ? void 0 : _g.some(pathMatcher)) !== null && _h !== void 0 ? _h : true;
    const pathBlacklistRulesPass = !((_j = urlFilter.pathBlacklist) === null || _j === void 0 ? void 0 : _j.some(pathMatcher));
    return (protocolWhitelistRulesPass &&
        protocolBlacklistRulesPass &&
        domainWhitelistRulesPass &&
        domainBlacklistRulesPass &&
        pathWhitelistRulesPass &&
        pathBlacklistRulesPass);
};

/**
 * Returns the url split into parts, without the separators.
 * Separator between protocol and domain is `://`, and between domain
 * and path is `/`.
 */
const separateUrl = (url) => {
    const urlMatch = url === null || url === void 0 ? void 0 : url.match(/^((.*):\/\/)?([^/].*?)?(\/(.*))?$/);
    return {
        protocol: urlMatch === null || urlMatch === void 0 ? void 0 : urlMatch[2],
        domain: urlMatch === null || urlMatch === void 0 ? void 0 : urlMatch[3],
        path: urlMatch === null || urlMatch === void 0 ? void 0 : urlMatch[5],
    };
};

class JwtInjectorInterceptor {
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

class JwtRefreshInterceptor {
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
                        next.handle(request)).pipe(catchError((error) => 
                // If the request failed, or we failed at the precheck
                // Acquire a new token, but only if the error is allowing it
                tryJwtRefresh(next, error, this.jwtRefreshConfiguration, (refreshError) => throwError(JwtCouldntRefreshError.createErrorResponse(request, refreshError)), (refreshResponse) => {
                    const requestWithUpdatedTokens = request.clone({
                        headers: request.headers.set(this.jwtConfiguration.header, this.jwtConfiguration.scheme +
                            refreshResponse.accessToken),
                    });
                    return next.handle(requestWithUpdatedTokens);
                })));
            }));
        }
        else {
            return next.handle(request);
        }
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

/**
 * Helps you define a JwtConfigurationProvider
 *
 * @internal
 */
const createJwtConfigurationProvider = (tokenConfigurationProvider) => (Object.assign({ provide: JWT_CONFIGURATION_TOKEN, multi: false }, tokenConfigurationProvider));

/**
 * Helps you define a JwtConfigurationProvider
 *
 * @internal
 */
const createJwtRefreshConfigurationProvider = (tokenRefreshConfigurationProvider) => (Object.assign({ provide: JWT_REFRESH_CONFIGURATION_TOKEN, multi: false }, tokenRefreshConfigurationProvider));

/**
 * This module needs to be configured to use. See the
 * {@link JwtModule#forRoot | forRoot} method for more information.
 *
 * tokens. So that other, plug in configration modules can provide them.
 * Like Ngrx and Local. They then transform their configs into this common one.
 */
class JwtModule {
    static forRoot(jwtModuleConfigurationProvider, jwtRefreshConfigurationProvider) {
        return {
            ngModule: JwtModule,
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: JwtErrorHandlingInterceptor,
                    multi: true,
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: JwtInjectorInterceptor,
                    multi: true,
                },
                {
                    provide: DEFAULT_JWT_CONFIGURATION_TOKEN,
                    useValue: DEFAULT_JWT_CONFIG,
                },
                createJwtConfigurationProvider(jwtModuleConfigurationProvider),
                ...(jwtRefreshConfigurationProvider
                    ? [
                        {
                            provide: HTTP_INTERCEPTORS,
                            useClass: JwtRefreshInterceptor,
                            multi: true,
                        },
                        {
                            provide: DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN,
                            useValue: DEFAULT_JWT_REFRESH_CONFIG,
                        },
                        createJwtRefreshConfigurationProvider(jwtRefreshConfigurationProvider),
                    ]
                    : []),
            ],
        };
    }
}
JwtModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
            },] }
];

// eslint-disable-next-line no-shadow
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["HEAD"] = "HEAD";
    HttpMethod["POST"] = "POST";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["DELETE"] = "DELETE";
    HttpMethod["CONNECT"] = "CONNECT";
    HttpMethod["OPTIONS"] = "OPTIONS";
    HttpMethod["TRACE"] = "TRACE";
    HttpMethod["PATCH"] = "PATCH";
})(HttpMethod || (HttpMethod = {}));

/**
 * Generated bundle index. Do not edit.
 */

export { DEFAULT_HEADER_CONFIG, DEFAULT_JWT_CONFIG, DEFAULT_JWT_HEADER, DEFAULT_JWT_REFRESH_CONFIG, DEFAULT_JWT_REFRESH_CONFIG_DEFAULT_AUTO_IN_GUARD, DEFAULT_JWT_SCHEME, HttpMethod, JwtModule, JwtToken, JwtTokenService, LoginGuard, createJwtConfigurationProvider, createJwtRefreshConfigurationProvider, isUnixTimestampExpired, JWT_CONFIGURATION_TOKEN as ɵa, DEFAULT_JWT_CONFIGURATION_TOKEN as ɵb, JWT_REFRESH_CONFIGURATION_TOKEN as ɵc, DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN as ɵd, JwtErrorHandlingInterceptor as ɵe, JwtInjectorInterceptor as ɵf, JwtRefreshInterceptor as ɵg };
//# sourceMappingURL=aegis-auth-jwt.js.map
