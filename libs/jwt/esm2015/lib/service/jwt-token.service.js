import { HttpHandler } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { JwtCouldntRefreshError } from '../errors/jwt-error.class';
import { handleJwtError } from '../function/handle-jwt-error.function';
import { intoObservable } from '../function/into-observable.function';
import { isNotNullish } from '../function/is-not-nullish.predicate';
import { isUnixTimestampExpiredNowAndWhenItIs } from '../function/is-unix-timestamp-expired-now-and-when-it-is.function';
import { isString } from '../function/string.predicate';
import { tryJwtRefresh } from '../function/try-jwt-refresh.function';
import { JwtToken } from '../model/jwt-token.class';
import { DEFAULT_JWT_CONFIGURATION_TOKEN, DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN, JWT_CONFIGURATION_TOKEN, JWT_REFRESH_CONFIGURATION_TOKEN, } from '../token/jwt-configuration.token';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "../token/jwt-configuration.token";
import * as i3 from "@angular/router";
export class JwtTokenService {
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
                if (!jwtToken)
                    throw new Error('Non-valid token observed');
                else
                    return jwtToken;
            }
            else
                return null;
        }));
        this.refreshToken$ = this.rawRefreshToken$.pipe(map((refreshToken) => {
            if (isString(refreshToken)) {
                const jwtToken = JwtToken.from(refreshToken);
                if (!jwtToken)
                    throw new Error('Non-valid token observed');
                else
                    return jwtToken;
            }
            else
                return null;
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
JwtTokenService.ɵprov = i0.ɵɵdefineInjectable({ factory: function JwtTokenService_Factory() { return new JwtTokenService(i0.ɵɵinject(i1.HttpHandler), i0.ɵɵinject(i2.JWT_CONFIGURATION_TOKEN), i0.ɵɵinject(i2.DEFAULT_JWT_CONFIGURATION_TOKEN), i0.ɵɵinject(i2.DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN, 8), i0.ɵɵinject(i2.JWT_REFRESH_CONFIGURATION_TOKEN, 8), i0.ɵɵinject(i3.Router, 8)); }, token: JwtTokenService, providedIn: "root" });
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
//# sourceMappingURL=jwt-token.service.js.map