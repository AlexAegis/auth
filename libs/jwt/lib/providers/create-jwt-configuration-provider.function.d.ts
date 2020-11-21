import { JwtConfigurationProvider, JwtModuleConfigurationProvider } from '../token/jwt-configuration.token';
/**
 * Helps you define a JwtConfigurationProvider
 *
 * @internal
 */
export declare const createJwtConfigurationProvider: (tokenConfigurationProvider: JwtModuleConfigurationProvider) => JwtConfigurationProvider;
