import { HttpHandler } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtConfiguration, JwtRefreshConfiguration } from '../model/auth-core-configuration.interface';
import { JwtToken } from '../model/jwt-token.class';
export declare class JwtTokenService<Claims = Record<string | number, unknown>, RefreshClaims = Record<string | number, unknown>, RefreshRequest = Record<string | number, unknown>, RefreshResponse = Record<string | number, unknown>> {
    private readonly httpHandler;
    private readonly rawConfig;
    private readonly rawDefaultConfig;
    private readonly rawDefaultRefreshConfig?;
    private readonly rawRefreshConfig?;
    private readonly router?;
    constructor(httpHandler: HttpHandler, rawConfig: JwtConfiguration, rawDefaultConfig: JwtConfiguration, rawDefaultRefreshConfig?: JwtRefreshConfiguration<RefreshRequest, RefreshResponse> | undefined, rawRefreshConfig?: JwtRefreshConfiguration<RefreshRequest, RefreshResponse> | undefined, router?: Router | undefined);
    readonly config: JwtConfiguration;
    readonly refreshConfig?: JwtRefreshConfiguration<RefreshRequest, RefreshResponse>;
    /**
     * Consider restricting getToken to observables only so things can be cached
     */
    readonly rawAccessToken$: Observable<string | null | undefined>;
    readonly rawRefreshToken$: Observable<string | null | undefined>;
    readonly accessToken$: Observable<JwtToken<Claims> | null>;
    readonly refreshToken$: Observable<JwtToken<RefreshClaims> | null>;
    readonly accessTokenHeader$: Observable<import("../model/jwt-token.class").JwtTokenHeader | null>;
    readonly accessTokenPayload$: Observable<NonNullable<import("../model/jwt-token.class").JwtTokenPayload & Claims> | null>;
    readonly refreshTokenHeader$: Observable<import("../model/jwt-token.class").JwtTokenHeader | null>;
    readonly refreshTokenPayload$: Observable<NonNullable<import("../model/jwt-token.class").JwtTokenPayload & RefreshClaims> | null>;
    readonly isAccessTokenExpired$: Observable<boolean | null>;
    readonly isRefreshTokenExpired$: Observable<boolean | null>;
    readonly isAccessTokenValid$: Observable<boolean>;
    readonly isRefreshTokenValid$: Observable<boolean>;
    /**
     * Does a token refresh. Emits false if it failed, or true if succeeded.
     */
    manualRefresh(): Observable<boolean>;
}
