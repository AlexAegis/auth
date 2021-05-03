import {
	JwtModuleRefreshConfigurationProvider,
	JwtRefreshConfigurationProvider,
	JWT_REFRESH_CONFIGURATION_TOKEN,
} from '../token/jwt-configuration.token';

/**
 * Helps you define a JwtConfigurationProvider
 *
 * @internal
 */
export const createJwtRefreshConfigurationProvider = <RefreshRequest, RefreshResponse>(
	tokenRefreshConfigurationProvider: JwtModuleRefreshConfigurationProvider<
		RefreshRequest,
		RefreshResponse
	>
): JwtRefreshConfigurationProvider<RefreshRequest, RefreshResponse> =>
	({
		provide: JWT_REFRESH_CONFIGURATION_TOKEN,
		multi: false,
		...tokenRefreshConfigurationProvider,
	} as JwtRefreshConfigurationProvider<RefreshRequest, RefreshResponse>);
