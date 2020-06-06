import { InjectionToken } from '@angular/core';
import { AuthTokenConfiguration, TypedProvider } from '../model';

export const AuthCoreModuleConfigurationService = new InjectionToken<
	AuthTokenConfiguration | AuthTokenConfiguration[]
>('AuthCoreModuleConfiguration');

/**
 * To provide an {@link AuthTokenConfiguration |  AuthTokenConfiguration}
 */
export type TokenConfigurationProvider<
	A = unknown,
	B = unknown,
	C = unknown,
	D = unknown,
	E = unknown
> = TypedProvider<AuthTokenConfiguration, A, B, C, D, E>;

/**
 * This type describes a providerlike object that doesn't have a provide field
 * because that will be defaulted by the
 * {@link createRefreshableAuthTokenProvider | createRefreshableAuthTokenProvider }
 * function
 */
export type AuthCoreModuleConfigurationProvider<
	A = unknown,
	B = unknown,
	C = unknown,
	D = unknown,
	E = unknown
> = Omit<
	TypedProvider<Partial<Omit<AuthTokenConfiguration<unknown>, 'autoRefresher'>>, A, B, C, D, E>,
	'provide' | 'multi'
>;

export type AuthCoreModuleRefreshableConfigurationProvider<
	RefreshResponse,
	A = unknown,
	B = unknown,
	C = unknown,
	D = unknown,
	E = unknown
> = Omit<
	TypedProvider<Partial<AuthTokenConfiguration<RefreshResponse>>, A, B, C, D, E>,
	'provide' | 'multi'
>;
