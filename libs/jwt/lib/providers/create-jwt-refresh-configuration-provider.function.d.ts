import { JwtModuleRefreshConfigurationProvider, JwtRefreshConfigurationProvider } from '../token/jwt-configuration.token';
/**
 * Helps you define a JwtConfigurationProvider
 *
 * @internal
 */
export declare const createJwtRefreshConfigurationProvider: <RefreshRequest, RefreshResponse>(tokenRefreshConfigurationProvider: JwtModuleRefreshConfigurationProvider<RefreshRequest, RefreshResponse>) => JwtRefreshConfigurationProvider<RefreshRequest, RefreshResponse>;
