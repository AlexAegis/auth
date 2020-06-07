import { TypedProvider } from '@aegis-auth/core';
import { JwtConfiguration } from '../model';

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
> = Omit<
	TypedProvider<Partial<Omit<JwtConfiguration<unknown>, 'autoRefresher'>>, A, B, C, D, E>,
	'provide' | 'multi'
>;

export type JwtModuleRefreshableConfigurationProvider<
	RefreshResponse,
	A = unknown,
	B = unknown,
	C = unknown,
	D = unknown,
	E = unknown
> = Omit<
	TypedProvider<Partial<JwtConfiguration<RefreshResponse>>, A, B, C, D, E>,
	'provide' | 'multi'
>;
