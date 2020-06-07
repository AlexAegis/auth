import {
	AuthCoreModule,
	DefaultHeaderConfigurationToken,
	HeaderConfigurationToken,
} from '@aegis-auth/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { JwtRefreshInterceptor } from './interceptor';
import { DEFAULT_JWT_CONFIG } from './model';
import {
	JwtConfigurationProvider,
	JwtModuleConfigurationProvider,
	JwtModuleRefreshableConfigurationProvider,
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
		provide: HeaderConfigurationToken,
		multi: true,
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
	public static forRoot(
		...tokenProviders: JwtModuleConfigurationProvider[]
	): ModuleWithProviders<JwtModule> {
		return {
			ngModule: JwtModule,
			providers: [
				{
					provide: HTTP_INTERCEPTORS,
					useClass: JwtRefreshInterceptor,
					multi: true,
				},
				{
					provide: DefaultHeaderConfigurationToken,
					useValue: DEFAULT_JWT_CONFIG,
				},
				...tokenProviders.map(createJwtProvider),
			],
		};
	}
}
