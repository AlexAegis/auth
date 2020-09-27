import { InjectionToken } from '@angular/core';
import { JwtConfiguration, JwtRefreshConfiguration } from '../model/auth-core-configuration.interface';
import { TypedProvider } from '../model/typed-providers.interface';
export declare const JWT_CONFIGURATION_TOKEN: InjectionToken<JwtConfiguration>;
export declare const DEFAULT_JWT_CONFIGURATION_TOKEN: InjectionToken<Partial<JwtConfiguration>>;
export declare const JWT_REFRESH_CONFIGURATION_TOKEN: InjectionToken<JwtRefreshConfiguration<unknown, unknown>>;
export declare const DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN: InjectionToken<Partial<JwtRefreshConfiguration<unknown, unknown>>>;
/**
 * To provide an {@link AuthTokenConfiguration |  AuthTokenConfiguration}
 */
export declare type JwtConfigurationProvider = TypedProvider<JwtConfiguration>;
/**
 * To provide an {@link AuthTokenConfiguration |  AuthTokenConfiguration}
 */
export declare type JwtRefreshConfigurationProvider<RefreshRequest, RefreshResponse> = TypedProvider<JwtRefreshConfiguration<RefreshRequest, RefreshResponse>>;
/**
 * This type describes a providerlike object that doesn't have a provide field
 * because that will be defaulted by the
 * {@link createRefreshableAuthTokenProvider | createRefreshableAuthTokenProvider }
 * function
 */
export declare type JwtModuleConfigurationProvider = Partial<Omit<TypedProvider<Partial<JwtConfiguration>>, 'provide' | 'multi'>>;
export declare type JwtModuleRefreshConfigurationProvider<RefreshRequest, RefreshResponse> = Partial<Omit<TypedProvider<Partial<JwtRefreshConfiguration<RefreshRequest, RefreshResponse>>>, 'provide' | 'multi'>>;
