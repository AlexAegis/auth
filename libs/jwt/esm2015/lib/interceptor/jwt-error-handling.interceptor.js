import { Inject, Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { handleJwtError } from '../function/handle-jwt-error.function';
import { DEFAULT_JWT_CONFIGURATION_TOKEN, DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN, JWT_CONFIGURATION_TOKEN, JWT_REFRESH_CONFIGURATION_TOKEN, } from '../token/jwt-configuration.token';
/**
 * If configured, handles authentication errors with custom callbacks
 * or redirects
 */
export class JwtErrorHandlingInterceptor {
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
//# sourceMappingURL=jwt-error-handling.interceptor.js.map