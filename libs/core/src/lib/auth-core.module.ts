import { CommonModule } from '@angular/common';
import { HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { TokenInjectorInterceptor, TokenRefreshInterceptor } from './interceptor';
import { TypedProvider } from './model';
import { AuthCoreModuleConfigurationProvider, AuthCoreModuleConfigurationService } from './token';

@NgModule({
	imports: [CommonModule],
})
export class AuthCoreModule {
	/**
	 * Define any one of the `use...` functions.
	 * If you defied `useFactory` you also have to define `deps`, which is
	 * an array of the paramaters of the useFactory functions.
	 * Define the generics on `forRoot` to get type inference.
	 *
	 * Example:
	 * ```ts
	 * AuthCoreModule.forRoot<Foo>({
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
	 *
	 * Other examples in one snippet:
	 * With `useValue` generics are not needed
	 * With `useClass`, similarly to `useFactory` you have to define what gets
	 * injected, but you won't get any type help here regardless of the use of
	 * Generics.
	 * ```ts
	 *
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
	 * @NgModule({
	 * 	imports: [
	 * 		AuthCoreModule.forRoot<Foo>({
	 * 			useFactory: (foo) => foo.getConf(),
	 * 			useClass: Bar,
	 * 			useValue: conf,
	 * 			deps: [Foo]
	 * 		}),
	 * 	],
	 * })
	 * export class AppModule {}
	 * ```
	 *
	 * Remember, only define one of the `use...` functions
	 */
	public static forRoot<A = unknown, B = unknown, C = unknown, D = unknown, E = unknown>(
		configurationProvider?: AuthCoreModuleConfigurationProvider<A, B, C, D, E>,
		...extraProviders: Provider[]
	): ModuleWithProviders<AuthCoreModule | HttpInterceptor[]> {
		// TODO: Optional Interceptors

		return {
			ngModule: AuthCoreModule,
			providers: [
				{
					...configurationProvider,
					provide: AuthCoreModuleConfigurationService,
				} as TypedProvider<A, B, C, D, E>,
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
				...extraProviders,
			],
		};
	}
}
