import { CommonModule } from '@angular/common';
import { HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { TokenInjectorInterceptor, TokenRefreshInterceptor } from './interceptor';
import { TypedProvider } from './model';
import {
	AuthCoreModuleConfigurationProvider,
	AuthCoreModuleConfigurationService,
	AuthCoreModuleRefreshableConfigurationProvider,
} from './token';

/**
 * Used to configure the AuthCoreModule
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
 * Example:
 *
 * With `useValue` generics are not needed
 * With `useClass`, similarly to `useFactory` you have to define what gets
 * injected.
 *
 * ```ts
 * const conf: AuthConfiguration = {
 * 	getToken: () => {
 * 		return '';
 * 	},
 * };
 *
 * class Foo {
 * 	getConf(): AuthConfiguration {
 * 		return conf;
 * 	}
 * }
 * class Bar implements AuthConfiguration {
 * 	constructor(private foo: Foo) {};
 * 	getToken() {
 * 		return this.foo.getConf().getToken();
 * 	}
 * }
 *
 *	(a)NgModule({
 *		mports: [
 *			AuthCoreModule.forRoot().withToken<Foo>({
 *				useFactory: (foo) => foo.getConf(), // define either this
 *				useClass: Bar, // or this
 *				useValue: conf, // or this
 *				deps: [Foo] // if something has to be injected
 *			}),
 *		,
 *	})
 *	export class AppModule {}
 * ```
 *
 * Remember, only define one of the `use...` functions, this is just an example.
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

	 *
	 *
	 *
	 */
	public static forRoot = (
		options: AuthCoreModuleRootOptions = { autoRefresh: true }
	): TokenConfigurationBuilder =>
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
	 */
	public static forFeature = (): ModuleWithProviders<AuthCoreModule> =>
		new TokenConfigurationBuilder();
}
