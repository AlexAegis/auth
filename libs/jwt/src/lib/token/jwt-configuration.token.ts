import { InjectionToken } from '@angular/core';
import { JwtConfiguration, TypedProvider } from '../model';

export const JWT_CONFIGURATION_TOKEN = new InjectionToken<JwtConfiguration>(
	'AegisJwtConfiguration'
);

export const DEFAULT_JWT_CONFIGURATION_TOKEN = new InjectionToken<Partial<JwtConfiguration>>(
	'DefaultAegisJwtConfiguration'
);

/**
 * To provide an {@link AuthTokenConfiguration |  AuthTokenConfiguration}
 */
export type JwtConfigurationProvider<
	A = unknown,
	B = unknown,
	C = unknown,
	D = unknown,
	E = unknown
> = TypedProvider<JwtConfiguration, A, B, C, D, E>;

/**
 * This type describes a providerlike object that doesn't have a provide field
 * because that will be defaulted by the
 * {@link createRefreshableAuthTokenProvider | createRefreshableAuthTokenProvider }
 * function
 */
export type JwtModuleConfigurationProvider<
	A = unknown,
	B = unknown,
	C = unknown,
	D = unknown,
	E = unknown
> = Omit<TypedProvider<Partial<JwtConfiguration>, A, B, C, D, E>, 'provide' | 'multi'>;
