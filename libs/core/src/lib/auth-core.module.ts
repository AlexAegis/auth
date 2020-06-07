import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { HeaderInjectorInterceptor } from './interceptor';
import { DEFAULT_HEADER_CONFIG } from './model';
import {
	DefaultHeaderConfigurationToken,
	HeaderConfigurationProvider,
	HeaderConfigurationToken,
	HeaderModuleConfigurationProvider,
} from './token';

export function createHeaderProvider<
	A = unknown,
	B = unknown,
	C = unknown,
	D = unknown,
	E = unknown
>(
	headerConfigurationProvider: HeaderModuleConfigurationProvider<A, B, C, D, E>
): HeaderConfigurationProvider<A, B, C, D, E> {
	return {
		provide: HeaderConfigurationToken,
		multi: true,
		...headerConfigurationProvider,
	} as HeaderConfigurationProvider<A, B, C, D, E>;
}

/**
 * This module needs to be configured to use. See
 * {@link AuthCoreModule#forRoot | forRoot} and
 * {@link AuthCoreModule#forFeature | forFeature} for more information.
 *
 *
 *
 * With `useValue` generics are not needed
 * With `useClass`, similarly to `useFactory` you have to define what gets
 * injected.
 *
 * @example
 *
 * ```ts
 * (a)Injectable
 * class Foo {
 * 		getConf(): AuthConfiguration {
 * 			return { ... };
 * 		}
 * }
 *
 * ```
 *
 * ```ts
 * (a)NgModule({
 *		imports: [
 *			AuthCoreModule.forRoot(
 *				createAuthTokenProvider<AuthService>({
 *					useFactory: (foo) => foo.getConf(),
 *					deps: [Foo] // if something has to be injected
 *				}), // can define as much as you like
 *				{
 *					useFactory: (foo) => foo.getConf(),
 *					deps: [Foo] // if something has to be injected
 *				} as TokenConfigurationProvider<Foo>,
 *				{
 *					useValue: { ... },
 *					deps: [Foo] // if something has to be injected
 *				} as TokenConfigurationProvider<Foo>
 *			}),
 *		,
 *	})
 *	export class CoreModule {}
 * ```
 *
 * Q: Why the helper method?
 *
 * A: This way you get some type help and generics per Provider. You couldn't
 *    define them on `forRoot` because you then couldn't define different
 *    generics for each provider. Using these methods are not necessary, you
 *    might not need the type help, and the default `multi: true` and the
 *    token itself, will be set by the `forRoot` method too. The helper
 *    methods also set these, so you can use them separately too.
 */
@NgModule({
	imports: [CommonModule],
})
export class AuthCoreModule {
	/**
	 * To define the interceptors and the tokens with provided configs.
	 * These token configuration can be provided by hand, or here, preferably
	 * with the `createAuthTokenProvider` and
	 * `createRefreshableAuthTokenProvider` helper methods. They will defaul
	 * two fields and help with the typing when defining these providers.
	 * They can also be used on their own in the providers array.
	 *
	 * @example
	 *
	 * ```ts
	 * (a)NgModule({
	 *		imports: [
	 *			AuthCoreModule.forRoot(
	 *				createAuthTokenProvider<AuthService>({
	 *					useFactory: (foo) => foo.getConf(), // define either this
	 *					deps: [Foo] // if something has to be injected
	 *				}), // can define as much as you like
	 *			}),
	 *		,
	 *	})
	 *	export class CoreModule {}
	 * ```
	 * @param tokenProviders create with `createAuthTokenProvider` or
	 * 	`createRefreshableAuthTokenProvider`
	 */
	public static forRoot(
		...configurationProviders: HeaderModuleConfigurationProvider[]
	): ModuleWithProviders<AuthCoreModule> {
		return {
			ngModule: AuthCoreModule,
			providers: [
				{
					provide: HTTP_INTERCEPTORS,
					useClass: HeaderInjectorInterceptor,
					multi: true,
				},
				{
					provide: DefaultHeaderConfigurationToken,
					useValue: DEFAULT_HEADER_CONFIG,
				},
				...configurationProviders.map(createHeaderProvider),
			],
		};
	}

	/**
	 * For defining the module with extra tokens but with no interceptors
	 *
	 * @param tokenProviders create with `createAuthTokenProvider` or
	 * 	`createRefreshableAuthTokenProvider`
	 */
	public static forFeature(
		...configurationProviders: HeaderModuleConfigurationProvider[]
	): ModuleWithProviders<AuthCoreModule> {
		return {
			ngModule: AuthCoreModule,
			providers: configurationProviders.map(createHeaderProvider),
		};
	}
}
