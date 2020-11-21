import { JWT_REFRESH_CONFIGURATION_TOKEN, } from '../token/jwt-configuration.token';
/**
 * Helps you define a JwtConfigurationProvider
 *
 * @internal
 */
export const createJwtRefreshConfigurationProvider = (tokenRefreshConfigurationProvider) => (Object.assign({ provide: JWT_REFRESH_CONFIGURATION_TOKEN, multi: false }, tokenRefreshConfigurationProvider));
//# sourceMappingURL=create-jwt-refresh-configuration-provider.function.js.map