import { JwtModuleRefreshConfigurationProvider, JwtRefreshConfigurationProvider } from '../token/jwt-configuration.token';
/**
 * Helps you define a JwtConfigurationProvider
 *
 * @internal
 */
export declare const createJwtRefreshConfigurationProvider: <RefreshRequest, RefreshResponse>(tokenRefreshConfigurationProvider: Partial<Pick<import("../model/typed-providers.interface").TypedProvider<Partial<import("../..").JwtRefreshConfiguration<RefreshRequest, RefreshResponse>>, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>, "useClass" | "useValue" | "useExisting" | "useFactory" | "deps">>) => import("../model/typed-providers.interface").TypedProvider<import("../..").JwtRefreshConfiguration<RefreshRequest, RefreshResponse>, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>;
