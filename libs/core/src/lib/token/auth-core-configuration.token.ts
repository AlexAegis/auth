import { InjectionToken } from '@angular/core';
import { AuthConfiguration, TypedProvider } from '../model';

export const AuthCoreModuleConfigurationService = new InjectionToken<AuthConfiguration[]>(
	'AuthCoreModuleConfiguration'
);

export type AuthCoreModuleConfigurationProvider<
	A = unknown,
	B = unknown,
	C = unknown,
	D = unknown,
	E = unknown
> = Omit<
	TypedProvider<Partial<Omit<AuthConfiguration<unknown>, 'autoRefresher'>>, A, B, C, D, E>,
	'provide'
>;

export type AuthCoreModuleRefreshableConfigurationProvider<
	RefreshResponse,
	A = unknown,
	B = unknown,
	C = unknown,
	D = unknown,
	E = unknown
> = Omit<TypedProvider<Partial<AuthConfiguration<RefreshResponse>>, A, B, C, D, E>, 'provide'>;
