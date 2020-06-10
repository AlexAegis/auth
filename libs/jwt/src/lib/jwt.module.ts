import { AuthCoreModule } from '@aegis-auth/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { JwtInjectorInterceptor, JwtRefreshInterceptor } from './interceptor';
import { DEFAULT_JWT_CONFIG } from './model';
import {
	DEFAULT_JWT_CONFIGURATION_TOKEN,
	JwtConfigurationProvider,
	JwtModuleConfigurationProvider,
	JwtModuleRefreshableConfigurationProvider,
	JWT_CONFIGURATION_TOKEN,
} from './token';

export function createRefreshableJwtProvider<
	RefreshResponse,
	A = unknown,
	B = unknown,
	C = unknown,
	D = unknown,
	E = unknown
>(
	tokenConfigurationProvider: JwtModuleRefreshableConfigurationProvider<
		RefreshResponse,
		A,
		B,
		C,
		D,
		E
	>
): JwtConfigurationProvider<A, B, C, D, E> {
	return {
		provide: JWT_CONFIGURATION_TOKEN,
		multi: false,
		...tokenConfigurationProvider,
	} as JwtConfigurationProvider<A, B, C, D, E>;
}

/**
 * Helps you define a TokenConfigProvider
 */
export function createJwtProvider<A = unknown, B = unknown, C = unknown, D = unknown, E = unknown>(
	tokenConfigurationProvider: JwtModuleConfigurationProvider<A, B, C, D, E>
): JwtConfigurationProvider<A, B, C, D, E> {
	return createRefreshableJwtProvider<unknown, A, B, C, D, E>(tokenConfigurationProvider);
}

@NgModule({
	imports: [CommonModule, AuthCoreModule],
})
export class JwtModule {
	/**
	 * refresh? separate method?
	 */
	public static forRoot<A = unknown, B = unknown, C = unknown, D = unknown, E = unknown>(
		tokenProvider: JwtModuleConfigurationProvider<A, B, C, D, E>
	): ModuleWithProviders<JwtModule> {
		return {
			ngModule: JwtModule,
			providers: [
				{
					provide: HTTP_INTERCEPTORS,
					useClass: JwtInjectorInterceptor,
					multi: true,
				},
				{
					provide: HTTP_INTERCEPTORS,
					useClass: JwtRefreshInterceptor,
					multi: true,
				},
				{
					provide: DEFAULT_JWT_CONFIGURATION_TOKEN,
					useValue: DEFAULT_JWT_CONFIG,
				},
				createJwtProvider<A, B, C, D, E>(tokenProvider),
			],
		};
	}
}
