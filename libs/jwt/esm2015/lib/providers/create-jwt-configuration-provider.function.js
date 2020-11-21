import { JWT_CONFIGURATION_TOKEN, } from '../token/jwt-configuration.token';
/**
 * Helps you define a JwtConfigurationProvider
 *
 * @internal
 */
export const createJwtConfigurationProvider = (tokenConfigurationProvider) => (Object.assign({ provide: JWT_CONFIGURATION_TOKEN, multi: false }, tokenConfigurationProvider));
//# sourceMappingURL=create-jwt-configuration-provider.function.js.map