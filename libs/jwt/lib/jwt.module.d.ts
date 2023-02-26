import { ModuleWithProviders } from '@angular/core';
import { JwtModuleConfigurationProvider, JwtModuleRefreshConfigurationProvider } from './token/jwt-configuration.token';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
/**
 * This module needs to be configured to use. See the
 * {@link JwtModule#forRoot | forRoot} method for more information.
 *
 * tokens. So that other, plug in configration modules can provide them.
 * Like Ngrx and Local. They then transform their configs into this common one.
 */
export declare class JwtModule {
    /**
     * To define the interceptors and the token with the provided config.
     *
     * @example
     *
     * ```ts
     * (a)NgModule({
     *		imports: [
     *			JwtModule.forRoot<Foo>({
     *					useFactory: (foo) => foo.getConf(),
     *					deps: [Foo] // if something has to be injected
     *			})
     *		]
     *	})
     *	export class CoreModule {}
     * ```
     * @param tokenProvider create with `createAuthTokenProvider` or
     * 	`createRefreshableAuthTokenProvider`
     */
    static forRoot(jwtModuleConfigurationProvider: JwtModuleConfigurationProvider): ModuleWithProviders<JwtModule>;
    static forRoot<RefreshRequest, RefreshResponse>(jwtModuleConfigurationProvider: JwtModuleConfigurationProvider, jwtRefreshConfigurationProvider: JwtModuleRefreshConfigurationProvider<RefreshRequest, RefreshResponse>): ModuleWithProviders<JwtModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<JwtModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<JwtModule, never, [typeof i1.CommonModule], never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<JwtModule>;
}