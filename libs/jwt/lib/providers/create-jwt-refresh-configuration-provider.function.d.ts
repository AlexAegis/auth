import { JwtModuleRefreshConfigurationProvider, JwtRefreshConfigurationProvider } from '../token/jwt-configuration.token';
/**
 * Helps you define a JwtConfigurationProvider
 *
 * @internal
 */
export declare const createJwtRefreshConfigurationProvider: <RefreshRequest, RefreshResponse>(tokenRefreshConfigurationProvider: Partial<Omit<import("../model/typed-providers.interface").TypedProvider<Partial<import("@aegis-auth/jwt").JwtRefreshConfiguration<RefreshRequest, RefreshResponse>>>, "provide" | "multi">>) => JwtRefreshConfigurationProvider<RefreshRequest, RefreshResponse>;
