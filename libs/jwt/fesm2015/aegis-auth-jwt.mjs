import * as i0 from '@angular/core';
import { InjectionToken, Injectable, Inject, Optional, NgModule } from '@angular/core';
import { BehaviorSubject, throwError, isObservable, of, from, merge, timer } from 'rxjs';
import { switchMap, mapTo, filter, map, tap, mergeMap, finalize, catchError, take, withLatestFrom } from 'rxjs/operators';
import * as i1 from '@angular/common/http';
import { HttpErrorResponse, HttpEventType, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Base64 } from 'js-base64';
import * as i3 from '@angular/router';
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
            // Unset accesstoken
            // jwtRefreshConfiguration.setRefreshedTokens({ accessToken: undefined });
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
const isPromise = (promiseLike) => !!promiseLike &&
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

const doJwtRefresh = (next, requestBody, jwtRefreshConfiguration, refreshLock, onError, originalAction) => {
    var _a;
    const refreshRequest = new HttpRequest((_a = jwtRefreshConfiguration.method) !== null && _a !== void 0 ? _a : 'POST', jwtRefreshConfiguration.refreshUrl, requestBody, callWhenFunction(jwtRefreshConfiguration.refreshRequestInitials));
    refreshLock.next(true); // Lock on refresh
    return next.handle(refreshRequest).pipe(filter(isHttpResponse), map((response) => jwtRefreshConfiguration.transformRefreshResponse(response.body)), tap((refreshResponse) => jwtRefreshConfiguration.setRefreshedTokens(refreshResponse)), mergeMap((refreshResponse) => originalAction(refreshResponse)), finalize(() => refreshLock.next(false)), // Unlock on finish
    catchError(onError));
};

const tryJwtRefresh = (next, originalError, jwtRefreshConfiguration, refreshLock, onError, originalAction) => {
    const isRefreshAllowed = typeof originalError === 'string' ||
        checkAgainstHttpErrorFilter(jwtRefreshConfiguration, originalError);
    if (isRefreshAllowed) {
        return intoObservable(jwtRefreshConfiguration.createRefreshRequestBody).pipe(take(1), switchMap((requestBody) => {
            if (requestBody) {
                return doJwtRefresh(next, requestBody, jwtRefreshConfiguration, refreshLock, onError, originalAction);
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

class JwtRefreshStateService {
    constructor() {
        this.refreshLock$ = new BehaviorSubject(false);
    }
}
JwtRefreshStateService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.0", ngImport: i0, type: JwtRefreshStateService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
JwtRefreshStateService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.0", ngImport: i0, type: JwtRefreshStateService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.0", ngImport: i0, type: JwtRefreshStateService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });

class JwtTokenService {
    constructor(httpHandler, jwtRefreshStateService, rawConfig, rawDefaultConfig, rawDefaultRefreshConfig, rawRefreshConfig, router) {
        var _a;
        this.httpHandler = httpHandler;
        this.jwtRefreshStateService = jwtRefreshStateService;
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
        this.rawRefreshToken$ = ((_a = this.refreshConfig) === null || _a === void 0 ? void 0 : _a.getRefreshToken)
            ? intoObservable(this.refreshConfig.getRefreshToken)
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
            return tryJwtRefresh(this.httpHandler, 'Access token not valid on guard activation', this.refreshConfig, this.jwtRefreshStateService.refreshLock$, (refreshError) => handleJwtError(JwtCouldntRefreshError.createErrorResponse(undefined, refreshError), this.config, this.refreshConfig, this.router).pipe(catchError(() => of(false))), () => of(true));
        }
        else {
            return of(false);
        }
    }
}
JwtTokenService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.0", ngImport: i0, type: JwtTokenService, deps: [{ token: i1.HttpHandler }, { token: JwtRefreshStateService }, { token: JWT_CONFIGURATION_TOKEN }, { token: DEFAULT_JWT_CONFIGURATION_TOKEN }, { token: DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN, optional: true }, { token: JWT_REFRESH_CONFIGURATION_TOKEN, optional: true }, { token: i3.Router, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
JwtTokenService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.0", ngImport: i0, type: JwtTokenService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.0", ngImport: i0, type: JwtTokenService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () {
        return [{ type: i1.HttpHandler }, { type: JwtRefreshStateService }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [JWT_CONFIGURATION_TOKEN]
                    }] }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [DEFAULT_JWT_CONFIGURATION_TOKEN]
                    }] }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN]
                    }, {
                        type: Optional
                    }] }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [JWT_REFRESH_CONFIGURATION_TOKEN]
                    }, {
                        type: Optional
                    }] }, { type: i3.Router, decorators: [{
                        type: Optional
                    }] }];
    } });

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
LoginGuard.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.0", ngImport: i0, type: LoginGuard, deps: [{ token: JwtTokenService }], target: i0.ɵɵFactoryTarget.Injectable });
LoginGuard.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.0", ngImport: i0, type: LoginGuard, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.0", ngImport: i0, type: LoginGuard, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: JwtTokenService }]; } });

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
JwtErrorHandlingInterceptor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.0", ngImport: i0, type: JwtErrorHandlingInterceptor, deps: [{ token: JWT_CONFIGURATION_TOKEN }, { token: DEFAULT_JWT_CONFIGURATION_TOKEN }, { token: JWT_REFRESH_CONFIGURATION_TOKEN, optional: true }, { token: DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN, optional: true }, { token: i3.Router, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
JwtErrorHandlingInterceptor.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.0", ngImport: i0, type: JwtErrorHandlingInterceptor });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.0", ngImport: i0, type: JwtErrorHandlingInterceptor, decorators: [{
            type: Injectable
        }], ctorParameters: function () {
        return [{ type: undefined, decorators: [{
                        type: Inject,
                        args: [JWT_CONFIGURATION_TOKEN]
                    }] }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [DEFAULT_JWT_CONFIGURATION_TOKEN]
                    }] }, { type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [JWT_REFRESH_CONFIGURATION_TOKEN]
                    }] }, { type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN]
                    }] }, { type: i3.Router, decorators: [{
                        type: Optional
                    }] }];
    } });

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
const matchAgainst = (against, inverse = false) => (rule) => inverse ? !matchRule(rule, against) : matchRule(rule, against);

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
JwtInjectorInterceptor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.0", ngImport: i0, type: JwtInjectorInterceptor, deps: [{ token: JWT_CONFIGURATION_TOKEN }, { token: DEFAULT_JWT_CONFIGURATION_TOKEN }, { token: JWT_REFRESH_CONFIGURATION_TOKEN, optional: true }, { token: DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
JwtInjectorInterceptor.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.0", ngImport: i0, type: JwtInjectorInterceptor });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.0", ngImport: i0, type: JwtInjectorInterceptor, decorators: [{
            type: Injectable
        }], ctorParameters: function () {
        return [{ type: undefined, decorators: [{
                        type: Inject,
                        args: [JWT_CONFIGURATION_TOKEN]
                    }] }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [DEFAULT_JWT_CONFIGURATION_TOKEN]
                    }] }, { type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [JWT_REFRESH_CONFIGURATION_TOKEN]
                    }] }, { type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN]
                    }] }];
    } });

class JwtRefreshInterceptor {
    constructor(jwtConfig, defaultJwtConfig, refreshConfig, defaultJwtRefreshConfig, jwtRefreshStateService, jwtTokenService) {
        var _a;
        this.jwtConfig = jwtConfig;
        this.defaultJwtConfig = defaultJwtConfig;
        this.refreshConfig = refreshConfig;
        this.defaultJwtRefreshConfig = defaultJwtRefreshConfig;
        this.jwtRefreshStateService = jwtRefreshStateService;
        this.jwtTokenService = jwtTokenService;
        this.jwtConfiguration = Object.assign(Object.assign({}, defaultJwtConfig), jwtConfig);
        this.jwtRefreshConfiguration = Object.assign(Object.assign({}, defaultJwtRefreshConfig), refreshConfig);
        this.rawRefreshToken$ = intoObservable((_a = this.jwtRefreshConfiguration.getRefreshToken) !== null && _a !== void 0 ? _a : (() => null));
        this.isRawRefreshTokenGetterAvailable = !!this.jwtRefreshConfiguration.getRefreshToken;
    }
    handleWithToken(request, next, token) {
        const requestWithUpdatedTokens = request.clone({
            headers: request.headers.set(this.jwtConfiguration.header, this.jwtConfiguration.scheme + token),
        });
        return next.handle(requestWithUpdatedTokens);
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
            // If locked, instead of refreshing, wait for it and get the new accessToken
            if (this.jwtRefreshStateService.refreshLock$.value) {
                // When the lock unlocks, retry with the new token
                return this.jwtRefreshStateService.refreshLock$.pipe(filter((lock) => !lock), take(1), withLatestFrom(this.jwtTokenService.rawAccessToken$), switchMap(([, accessToken]) => {
                    // ...but only if there is actually a token
                    if (accessToken) {
                        return this.handleWithToken(request, next, accessToken);
                    }
                    else {
                        return throwError(JwtError.createErrorResponse(request, 'No access token available after waiting for a refresh'));
                    }
                }));
            }
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
                // If a refresh is already happening, wait for it, and use it's results
                tryJwtRefresh(next, error, this.jwtRefreshConfiguration, this.jwtRefreshStateService.refreshLock$, (refreshError) => throwError(JwtCouldntRefreshError.createErrorResponse(request, refreshError)), (refreshResponse) => this.handleWithToken(request, next, refreshResponse.accessToken))));
            }));
        }
        else {
            return next.handle(request);
        }
    }
}
JwtRefreshInterceptor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.0", ngImport: i0, type: JwtRefreshInterceptor, deps: [{ token: JWT_CONFIGURATION_TOKEN }, { token: DEFAULT_JWT_CONFIGURATION_TOKEN }, { token: JWT_REFRESH_CONFIGURATION_TOKEN }, { token: DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN }, { token: JwtRefreshStateService }, { token: JwtTokenService }], target: i0.ɵɵFactoryTarget.Injectable });
JwtRefreshInterceptor.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.0", ngImport: i0, type: JwtRefreshInterceptor });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.0", ngImport: i0, type: JwtRefreshInterceptor, decorators: [{
            type: Injectable
        }], ctorParameters: function () {
        return [{ type: undefined, decorators: [{
                        type: Inject,
                        args: [JWT_CONFIGURATION_TOKEN]
                    }] }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [DEFAULT_JWT_CONFIGURATION_TOKEN]
                    }] }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [JWT_REFRESH_CONFIGURATION_TOKEN]
                    }] }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN]
                    }] }, { type: JwtRefreshStateService }, { type: JwtTokenService }];
    } });

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
JwtModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.0", ngImport: i0, type: JwtModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
JwtModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.0", ngImport: i0, type: JwtModule, imports: [CommonModule] });
JwtModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.0", ngImport: i0, type: JwtModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.0", ngImport: i0, type: JwtModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                }]
        }] });

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

export { DEFAULT_HEADER_CONFIG, DEFAULT_JWT_CONFIG, DEFAULT_JWT_HEADER, DEFAULT_JWT_REFRESH_CONFIG, DEFAULT_JWT_REFRESH_CONFIG_DEFAULT_AUTO_IN_GUARD, DEFAULT_JWT_SCHEME, HttpMethod, JwtModule, JwtRefreshStateService, JwtToken, JwtTokenService, LoginGuard, createJwtConfigurationProvider, createJwtRefreshConfigurationProvider, isUnixTimestampExpired };
//# sourceMappingURL=aegis-auth-jwt.mjs.map
