import {
	JwtConfigurationProvider,
	JwtModuleConfigurationProvider,
	JWT_CONFIGURATION_TOKEN,
} from '../token/jwt-configuration.token';

/**
 * Helps you define a JwtConfigurationProvider
 *
 * @internal
 */
export const createJwtConfigurationProvider = (
	tokenConfigurationProvider: JwtModuleConfigurationProvider
): JwtConfigurationProvider =>
	({
		provide: JWT_CONFIGURATION_TOKEN,
		multi: false,
		...tokenConfigurationProvider,
	} as JwtConfigurationProvider);
