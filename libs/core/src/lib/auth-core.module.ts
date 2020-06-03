import { CommonModule } from '@angular/common';
import { HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { TokenInjectorInterceptor, TokenRefreshInterceptor } from './interceptor';
import { TypedProvider } from './model';
import {
	AuthCoreModuleConfigurationProvider,
	AuthCoreModuleConfigurationService,
	AuthCoreModuleRefreshableConfigurationProvider,
	TokenConfigurationProvider,
} from './token';

export function createRefreshableAuthTokenProvider<
	RefreshResponse,
	A = unknown,
	B = unknown,
	C = unknown,
	D = unknown,
	E = unknown
>(
	tokenConfigurationProvider: AuthCoreModuleRefreshableConfigurationProvider<
		RefreshResponse,
		A,
		B,
		C,
		D,
		E
	>
): TokenConfigurationProvider<A, B, C, D, E> {
	return {
		provide: AuthCoreModuleConfigurationService,
		multi: true,
		...tokenConfigurationProvider,
	} as TokenConfigurationProvider<A, B, C, D, E>;
}

/**
 * Helps you define a TokenConfigProvider
 */
export function createAuthTokenProvider<
	A = unknown,
	B = unknown,
	C = unknown,
	D = unknown,
	E = unknown
>(
	tokenConfigurationProvider: AuthCoreModuleConfigurationProvider<A, B, C, D, E>
): TokenConfigurationProvider<A, B, C, D, E> {
	return createRefreshableAuthTokenProvider<unknown, A, B, C, D, E>(tokenConfigurationProvider);
}

/**
 * Used to configure the AuthCoreModule
 *
 * @deprecated will only be useful in Angular 10. Also usable under that, but
 * with Ivy disabled
 */
class TokenConfigurationBuilder implements ModuleWithProviders<AuthCoreModule | HttpInterceptor[]> {
	public ngModule = AuthCoreModule;

	public constructor(public providers: Provider[] = []) {}

	/**
	 * Appends a new configuration provider to the module
	 * @internal
	 */
	private withConfig<
		RefreshResponse,
		A = unknown,
		B = unknown,
		C = unknown,
		D = unknown,
		E = unknown
	>(
		tokenConfigurationProvider: AuthCoreModuleRefreshableConfigurationProvider<
			RefreshResponse,
			A,
			B,
			C,
			D,
			E
		>
		// tslint:disable-next-line: deprecation
	): TokenConfigurationBuilder {
		this.providers.push({
			...tokenConfigurationProvider,
			provide: AuthCoreModuleConfigurationService,
			multi: true,
		} as TypedProvider<A, B, C, D, E>);
		return this;
	}

	/**
	 * Define a token configuration. If you want a token that is refreshable,
	 * use the {@link TokenConfigurationBuilder#withRefreshableToken | withRefreshableToken}
	 * method.
	 *
	 * On Provider usage:
	 *
	 * Define any one of the `use...` functions.
	 * If you defied `useFactory` you also have to define `deps`, which is
	 * an array of the paramaters of the useFactory functions.
	 * Define the generics on `forRoot` to get type inference.
	 *
	 * Example:
	 * ```ts
	 * AuthCoreModule.forRoot().withToken<unknown, Foo>({
	 * 		useFactory: (foo) => {
	 * 			return foo.getConf();
	 * 		},
	 * 		deps: [Foo]
	 * }),
	 * ```
	 *
	 * But this is weakly typed, TypeScript would allow you to skip any of this
	 * even though angular would require them. As of TS3.9, without variadic
	 * generic this cannot be properly typed.
	 *
	 * This method only supports a few typed generics but you are free to
	 * define as much as you want. But you won't get type inference and you
	 * won't be able to define them. But for a simple configuration provider
	 * like this, in the vast majority of times you'll only need 1 or at most
	 * 2 dependencies injected.
	 */
	public withToken<A = unknown, B = unknown, C = unknown, D = unknown, E = unknown>(
		tokenConfigurationProvider: AuthCoreModuleConfigurationProvider<A, B, C, D, E>
		// tslint:disable-next-line: deprecation
	): TokenConfigurationBuilder {
		return this.withConfig<unknown, A, B, C, D, E>(tokenConfigurationProvider);
	}

	/**
	 * Define a token that is refreshable. Everything whats on
	 * {@link TokenConfigurationBuilder#withToken | withTokens} documentation
	 * applies here with an extra generic and an extra (e.g.: not omitted)
	 * configuration field on {@link AuthConfiguration | AuthConfiguration}
	 *
	 * The extra first generic defines the shape of the refresh endpoints
	 * response.
	 */
	public withRefreshableToken<
		RefreshResponse,
		A = unknown,
		B = unknown,
		C = unknown,
		D = unknown,
		E = unknown
	>(
		tokenConfigurationProvider: AuthCoreModuleRefreshableConfigurationProvider<
			RefreshResponse,
			A,
			B,
			C,
			D,
			E
		>
		// tslint:disable-next-line: deprecation
	): TokenConfigurationBuilder {
		return this.withConfig<RefreshResponse, A, B, C, D, E>(tokenConfigurationProvider);
	}
}

/**
 * Optional root options of the AuthCoreModule
 */
export interface AuthCoreModuleRootOptions {
	/**
	 * Whether the autorefresh interceptor is enabled or not.
	 *
	 * @default true
	 */
	autoRefresh: boolean;
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
 * Using the builder methods: (Not supported with Ivy below Angular 10)
 *
 * ```ts
 * (a)NgModule({
 *		imports: [
 *			AuthCoreModule.forRootWithBuilder().withToken<Foo>({
 *				useFactory: (foo) => foo.getConf(), // define either this
 *				deps: [Foo] // if something has to be injected
 *			}), // can chain as much as you like
 *		,
 *	})
 *	export class CoreModule {}
 * ```
 *
 * Using the helper functions:
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
 *
 * Q: Why the builder pattern? Why not just an array?
 *
 * A: An array would need to have the same type, and even if there
 *		were variadic generics, it would look ugly to type the configs
 *		because it's essentially a generic matrix. N tokens with M injected
 *		dependencies. With one function per token configuration you can
 *		type it just as nicely as if it would only support a single token
 *
 * Q: Why not a default token config in the `forRoot` method itself?
 *
 * A: Because I want to keep it flexible. You might want to define the
 *    the interceptors, but the token definitions would come only in
 *    feature modules.
 */
@NgModule({
	imports: [CommonModule],
})
export class AuthCoreModule {
	/**
	 * @deprecated Won't work with ivy enabled below Angular 10
	 *
	 * Use this method to define the global token interceptors.
	 *
	 * The refresh feature can be disabled globally using the `options` object.
	 * You can find more information about it on
	 * {@link AuthCoreModuleRootOptions | the options interface}.
	 *
	 * With the this method you provide the interceptors that will handle
	 * the token injections. **But you also need to define a token for it to
	 * actually do something.** For this, use the `withToken` method after
	 * calling `forRoot` like so:
	 *
	 * ```ts
	 * AuthCoreModule.forRoot().withToken<Foo>({
	 * 		useFactory: (foo) => {
	 * 			return foo.getConf();
	 * 		},
	 * 		deps: [Foo]
	 * }),
	 * ```
	 */
	public static forRootWithBuilder = (
		options: AuthCoreModuleRootOptions = { autoRefresh: true }
		// tslint:disable-next-line: deprecation
	): TokenConfigurationBuilder =>
		// tslint:disable-next-line: deprecation
		new TokenConfigurationBuilder([
			{
				provide: HTTP_INTERCEPTORS,
				useClass: TokenInjectorInterceptor,
				multi: true,
			},
			...(options.autoRefresh
				? [
						{
							provide: HTTP_INTERCEPTORS,
							useClass: TokenRefreshInterceptor,
							multi: true,
						},
				  ]
				: []),
		]);

	/**
	 * For defining the module with extra tokens but with no interceptors
	 *
	 * @deprecated Won't work with ivy enabled under Angular 10
	 */
	public static forFeatureWithBuilder = (): ModuleWithProviders<AuthCoreModule> =>
		// tslint:disable-next-line: deprecation
		new TokenConfigurationBuilder();

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
	public static forRoot(...tokenProviders: TypedProvider[]): ModuleWithProviders<AuthCoreModule> {
		return {
			ngModule: AuthCoreModule,
			providers: [
				{
					provide: HTTP_INTERCEPTORS,
					useClass: TokenInjectorInterceptor,
					multi: true,
				},
				{
					provide: HTTP_INTERCEPTORS,
					useClass: TokenRefreshInterceptor,
					multi: true,
				},
				...tokenProviders,
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
		...tokenProviders: TypedProvider[]
	): ModuleWithProviders<AuthCoreModule> {
		return {
			ngModule: AuthCoreModule,
			providers: [...tokenProviders],
		};
	}
}
