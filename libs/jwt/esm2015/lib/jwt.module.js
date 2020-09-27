import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { JwtErrorHandlingInterceptor } from './interceptor/jwt-error-handling.interceptor';
import { JwtInjectorInterceptor } from './interceptor/jwt-injector.interceptor';
import { JwtRefreshInterceptor } from './interceptor/jwt-refresh.interceptor';
import { DEFAULT_JWT_CONFIG, DEFAULT_JWT_REFRESH_CONFIG, } from './model/auth-core-configuration.interface';
import { DEFAULT_JWT_CONFIGURATION_TOKEN, DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN, JWT_CONFIGURATION_TOKEN, JWT_REFRESH_CONFIGURATION_TOKEN, } from './token/jwt-configuration.token';
/**
 * Helps you define a JwtConfigurationProvider
 *
 * @internal
 */
export function createJwtConfigurationProvider(tokenConfigurationProvider) {
    return Object.assign({ provide: JWT_CONFIGURATION_TOKEN, multi: false }, tokenConfigurationProvider);
}
/**
 * Helps you define a JwtConfigurationProvider
 *
 * @internal
 */
export function createJwtRefreshConfigurationProvider(tokenRefreshConfigurationProvider) {
    return Object.assign({ provide: JWT_REFRESH_CONFIGURATION_TOKEN, multi: false }, tokenRefreshConfigurationProvider);
}
/**
 * This module needs to be configured to use. See the
 * {@link JwtModule#forRoot | forRoot} method for more information.
 *
 * tokens. So that other, plug in configration modules can provide them.
 * Like Ngrx and Local. They then transform their configs into this common one.
 */
export class JwtModule {
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
//# sourceMappingURL=jwt.module.js.map