import { InjectionToken } from '@angular/core';
import { HeaderConfiguration, TypedProvider } from '../model';

export const HeaderConfigurationToken = new InjectionToken<
	HeaderConfiguration | HeaderConfiguration[]
>('AegisHeaderConfiguration');

export const DefaultHeaderConfigurationToken = new InjectionToken<Partial<HeaderConfiguration>>(
	'DefaultAegisHeaderConfiguration'
);

/**
 * To provide an {@link HeaderConfiguration | HeaderConfiguration}
 */
export type HeaderModuleConfigurationProvider<
	A = unknown,
	B = unknown,
	C = unknown,
	D = unknown,
	E = unknown
> = Omit<TypedProvider<HeaderConfiguration, A, B, C, D, E>, 'provide' | 'multi'>;

/**
 * To provide an {@link HeaderConfiguration | HeaderConfiguration}
 */
export type HeaderConfigurationProvider<
	A = unknown,
	B = unknown,
	C = unknown,
	D = unknown,
	E = unknown
> = TypedProvider<HeaderConfiguration, A, B, C, D, E>;
