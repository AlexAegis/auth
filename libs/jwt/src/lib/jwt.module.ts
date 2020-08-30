import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import {
	JwtErrorHandlingInterceptor,
	JwtInjectorInterceptor,
	JwtRefreshInterceptor,
} from './interceptor';
import { DEFAULT_JWT_CONFIG, DEFAULT_JWT_REFRESH_CONFIG } from './model';
import {
	DEFAULT_JWT_CONFIGURATION_TOKEN,
	DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN,
	JwtConfigurationProvider,
	JwtModuleConfigurationProvider,
	JwtModuleRefreshConfigurationProvider,
	JwtRefreshConfigurationProvider,
	JWT_CONFIGURATION_TOKEN,
	JWT_REFRESH_CONFIGURATION_TOKEN,
} from './token';

/**
 * Helps you define a JwtConfigurationProvider
 *
 * @internal
 */
export function createJwtConfigurationProvider(
	tokenConfigurationProvider: JwtModuleConfigurationProvider
): JwtConfigurationProvider {
	return {
		provide: JWT_CONFIGURATION_TOKEN,
		multi: false,
		...tokenConfigurationProvider,
	} as JwtConfigurationProvider;
}

/**
 * Helps you define a JwtConfigurationProvider
 *
 * @internal
 */
export function createJwtRefreshConfigurationProvider<RefreshRequest, RefreshResponse>(
	tokenRefreshConfigurationProvider: JwtModuleRefreshConfigurationProvider<
		RefreshRequest,
		RefreshResponse
	>
): JwtRefreshConfigurationProvider<RefreshRequest, RefreshResponse> {
	return {
		provide: JWT_REFRESH_CONFIGURATION_TOKEN,
		multi: false,
		...tokenRefreshConfigurationProvider,
	} as JwtRefreshConfigurationProvider<RefreshRequest, RefreshResponse>;
}

/**
 * This module needs to be configured to use. See the
 * {@link JwtModule#forRoot | forRoot} method for more information.
 *
 * tokens. So that other, plug in configration modules can provide them.
 * Like Ngrx and Local. They then transform their configs into this common one.
 */
@NgModule({
	imports: [CommonModule],
})
export class JwtModule {
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
	public static forRoot(
		jwtModuleConfigurationProvider: JwtModuleConfigurationProvider
	): ModuleWithProviders<JwtModule>;
	public static forRoot<RefreshRequest, RefreshResponse>(
		jwtModuleConfigurationProvider: JwtModuleConfigurationProvider,
		jwtRefreshConfigurationProvider: JwtModuleRefreshConfigurationProvider<
			RefreshRequest,
			RefreshResponse
		>
	): ModuleWithProviders<JwtModule>;
	public static forRoot<RefreshRequest, RefreshResponse>(
		jwtModuleConfigurationProvider: JwtModuleConfigurationProvider,
		jwtRefreshConfigurationProvider?: JwtModuleRefreshConfigurationProvider<
			RefreshRequest,
			RefreshResponse
		>
	): ModuleWithProviders<JwtModule> {
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
							createJwtRefreshConfigurationProvider<RefreshRequest, RefreshResponse>(
								jwtRefreshConfigurationProvider
							),
					  ]
					: []),
			],
		};
	}
}
