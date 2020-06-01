import { InjectionToken } from '@angular/core';
import { AuthConfiguration, TypedProvider } from '../model';

export const AuthCoreModuleConfigurationService = new InjectionToken<AuthConfiguration>(
	'AuthCoreModuleConfiguration'
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AuthCoreModuleConfigurationProvider<
	A = unknown,
	B = unknown,
	C = unknown,
	D = unknown,
	E = unknown
> = Omit<TypedProvider<Partial<AuthConfiguration>, A, B, C, D, E>, 'provide'>;
