import { InjectionToken } from '@angular/core';
import { JwtConfiguration, JwtRefreshConfiguration, TypedProvider } from '../model';

export const JWT_CONFIGURATION_TOKEN = new InjectionToken<JwtConfiguration>(
	'AegisJwtConfiguration'
);

export const DEFAULT_JWT_CONFIGURATION_TOKEN = new InjectionToken<Partial<JwtConfiguration>>(
	'DefaultAegisJwtConfiguration'
);

export const JWT_REFRESH_CONFIGURATION_TOKEN = new InjectionToken<
	JwtRefreshConfiguration<unknown, unknown>
>('AegisJwtRefreshConfiguration');

export const DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN = new InjectionToken<
	Partial<JwtRefreshConfiguration<unknown, unknown>>
>('DefaultAegisJwtRefreshConfiguration');

/**
 * To provide an {@link AuthTokenConfiguration |  AuthTokenConfiguration}
 */
export type JwtConfigurationProvider<> = TypedProvider<JwtConfiguration>;

/**
 * To provide an {@link AuthTokenConfiguration |  AuthTokenConfiguration}
 */
export type JwtRefreshConfigurationProvider<RefreshRequest, RefreshResponse> = TypedProvider<
	JwtRefreshConfiguration<RefreshRequest, RefreshResponse>
>;

/**
 * This type describes a providerlike object that doesn't have a provide field
 * because that will be defaulted by the
 * {@link createRefreshableAuthTokenProvider | createRefreshableAuthTokenProvider }
 * function
 */
export type JwtModuleConfigurationProvider = Omit<
	TypedProvider<Partial<JwtConfiguration>>,
	'provide' | 'multi'
>;

export type JwtModuleRefreshConfigurationProvider<RefreshRequest, RefreshResponse> = Omit<
	TypedProvider<Partial<JwtRefreshConfiguration<RefreshRequest, RefreshResponse>>>,
	'provide' | 'multi'
>;
